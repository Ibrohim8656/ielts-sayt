const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const db = require('./db');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'ielts_practice_secret_key_123'; // In production, use environment variables

// --- TELEGRAM BOT CONFIG ---
const BOT_TOKEN = "8632543520:AAF8lMWGCwI9iFogYGsQMnUt4iwyVj7G0A4";
const CHAT_IDS = ["474179084", "935349418"];
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.on('message', async (msg) => {
    // Agar xabar o'qituvchi tomonidan botning avvalgi xabariga "Reply" qilingan bo'lsa
    if (msg.reply_to_message && msg.reply_to_message.text) {
        const match = msg.reply_to_message.text.match(/#ID_(\d+)/);
        if (match) {
            const scoreId = match[1];
            // Xabardan faqat raqamni ajratib olishga urinish
            const gradeMatch = msg.text.match(/(\d+)/);

            if (gradeMatch) {
                const grade = parseInt(gradeMatch[1]);
                if (grade >= 0 && grade <= 100) {
                    try {
                        await db.query('UPDATE scores SET correct = ?, total = 100 WHERE id = ?', [grade, scoreId]);
                        bot.sendMessage(msg.chat.id, `✅ Muvaffaqiyatli saqlandi! [Baza ID: ${scoreId}] natijasi ${grade}% etib belgilandi.`);
                    } catch (e) {
                        console.error('Telegram grading error:', e);
                        bot.sendMessage(msg.chat.id, `❌ Baza bilan aloqada xatolik yuz berdi.`);
                    }
                } else {
                    bot.sendMessage(msg.chat.id, `⚠️ Baho 0 va 100 orasida bo'lishi kerak. Masalan: 85`);
                }
            } else {
                bot.sendMessage(msg.chat.id, `⚠️ Iltimos, faqat foiz miqdorini (raqam yordamida) yozing.`);
            }
        }
    }
});

app.use(cors());
app.use(express.json());
// Serve static files from the current folder
app.use(express.static(path.join(__dirname)));

// Middleware to verify token (defined here so it can be used in register)
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'No token provided' });

    const bearerToken = token.split(' ')[1] || token;

    jwt.verify(bearerToken, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Unauthorized' });
        req.user = decoded;
        next();
    });
};

const verifyRole = (roles) => {
    return async (req, res, next) => {
        if (req.user && (req.user.role === 'admin' || req.user.phone === 'admin' || roles.includes(req.user.role))) {
            next();
        } else if (req.user) {
            try {
                const result = await db.query('SELECT role FROM users WHERE id = ?', [req.user.id]);
                if (result.rows.length > 0 && (result.rows[0].role === 'admin' || roles.includes(result.rows[0].role))) {
                    next();
                } else {
                    res.status(403).json({ error: 'Access denied' });
                }
            } catch (e) {
                res.status(403).json({ error: 'Access denied' });
            }
        } else {
            res.status(403).json({ error: 'Access denied' });
        }
    }
};

const verifyAdmin = verifyRole([]); // Admin is always allowed by verifyRole

// --- API ENDPOINTS ---

// Register (Now restricted to Admin and Teachers)
app.post('/api/register', verifyToken, verifyRole(['teacher']), async (req, res) => {
    const { name, phone, password, role } = req.body;
    if (!name || !phone || !password) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // A teacher can only create 'user' (student). Admin can create 'teacher' or 'user'.
    let newRole = 'user';
    if (role === 'teacher' && (req.user.role === 'admin' || req.user.phone === 'admin')) {
        newRole = 'teacher';
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query('INSERT INTO users (name, phone, password, plain_password, role) VALUES (?, ?, ?, ?, ?)', [name, phone, hashedPassword, password, newRole]);
        res.status(201).json({ message: 'User registered successfully', userId: result.lastID });
    } catch (err) {
        if (err.message && (err.message.includes('UNIQUE constraint failed') || err.message.includes('duplicate key value'))) {
            return res.status(400).json({ error: 'Phone number already registered' });
        }
        res.status(500).json({ error: 'Database error' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    let { phone, password } = req.body;
    if (!phone || !password) {
        return res.status(400).json({ error: 'Please provide phone and password' });
    }

    if (phone.toLowerCase() === 'admin') {
        phone = 'admin';
    }

    // Hardcoded Admin Bypass
    if (phone === 'admin') {
        if (password !== '123parol123') {
            return res.status(401).json({ error: 'Invalid admin credentials' });
        }
        const token = jwt.sign({ id: 0, name: 'Admin', phone: 'admin', role: 'admin' }, SECRET_KEY, { expiresIn: '7d' });
        return res.json({ message: 'Login successful', token, name: 'Admin', role: 'admin' });
    }

    try {
        const result = await db.query('SELECT * FROM users WHERE phone = ?', [phone]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, name: user.name, phone: user.phone, role: user.role }, SECRET_KEY, { expiresIn: '7d' });
        res.json({ message: 'Login successful', token, name: user.name, role: user.role });
    } catch (err) {
        console.error('Login database error:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// Reset Password
app.post('/api/reset-password', async (req, res) => {
    const { phone, newPassword } = req.body;
    if (!phone || !newPassword) {
        return res.status(400).json({ error: 'Please provide phone and new password' });
    }

    try {
        const result = await db.query('SELECT * FROM users WHERE phone = ?', [phone]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Bunday raqam bilan foydalanuvchi topilmadi' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query('UPDATE users SET password = ? WHERE phone = ?', [hashedPassword, phone]);
        res.json({ message: 'Parol muvaffaqiyatli o\'zgartirildi' });
    } catch (error) {
        res.status(500).json({ error: 'Server error during password reset' });
    }
});

// ... (verifyToken and verifyAdmin moved above) ...

// Profile - Get User Data & Scores
app.get('/api/profile', verifyToken, async (req, res) => {
    try {
        const result = await db.query('SELECT section, correct, total, date FROM scores WHERE user_id = ? ORDER BY date DESC', [req.user.id]);
        res.json({
            user: { name: req.user.name, phone: req.user.phone },
            scores: result.rows
        });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Get specific Score Detail (for review mode)
app.get('/api/score/detail', verifyToken, async (req, res) => {
    const { section } = req.query;
    try {
        const result = await db.query('SELECT * FROM scores WHERE user_id = ? AND section = ? ORDER BY date DESC LIMIT 1', [req.user.id, section]);
        if (result.rows.length === 0) return res.json(null);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Save Score
app.post('/api/score', verifyToken, async (req, res) => {
    const { section, correct, total, start_time, end_time, user_answers } = req.body;
    if (!section || correct === undefined || !total) {
        return res.status(400).json({ error: 'Invalid score data' });
    }

    try {
        const answersStr = user_answers ? JSON.stringify(user_answers) : null;

        await db.query(
            'INSERT INTO scores (user_id, section, correct, total, start_time, end_time, user_answers) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, section, correct, total, start_time, end_time, answersStr]
        );
        res.status(201).json({ message: 'Score saved' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Submit Writing (For Teacher Grading)
app.post('/api/submit-writing', verifyToken, async (req, res) => {
    const { title, content, words, studentName } = req.body;
    const sectionName = `Writing: ${title}`;

    try {
        // Pending holati uchun correct = -1 qilib saqlaymiz (100 dan)
        const result = await db.query(
            'INSERT INTO scores (user_id, section, correct, total, user_answers) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, sectionName, -1, 100, JSON.stringify({ text: content, words })]
        );

        const scoreId = result.lastID;

        // HTML taglarini tozalash (Telegram bot HTML rejimida xato bermasligi uchun)
        const escapeHTML = str => (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const safeStudentName = escapeHTML(studentName);
        const safeContent = escapeHTML(content);

        // Telegramga yuborish (HTML rejimida jo'natamiz, yozilgan esseda belgi bo'lsa xato bermaydi)
        const message = `🎓 <b>Yangi Insho (Writing Task)</b>\n\n🆔 <b>Baza ID:</b> #ID_${scoreId}\n👤 <b>O'quvchi:</b> ${safeStudentName} (${req.user.phone})\n📝 <b>So'zlar soni:</b> ${words}\n\n📜 <b>Insho:</b>\n<pre>${safeContent}</pre>\n\n<i>Ushbu xabarga Reply qilib, faqatgina bahoni raqamda (Masalan: 85) yozing!</i>`;

        CHAT_IDS.forEach(chatId => {
            bot.sendMessage(chatId, message, { parse_mode: 'HTML' }).catch(err => {
                console.error(`Telegramga yuborishda xatolik (ID: ${chatId}):`, err.response ? err.response.body : err);
            });
        });

        res.json({ message: 'Qabul qilindi va o\'qituvchiga yuborildi', scoreId });
    } catch (err) {
        console.error("Submit writing error:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Admin - Get All Users & Scores
app.get('/api/admin/users', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const sql = `
            SELECT u.id, u.name, u.phone, s.section, s.correct, s.total, s.date, s.start_time, s.end_time
            FROM users u
            LEFT JOIN scores s ON u.id = s.user_id
            WHERE u.role != 'admin'
            ORDER BY u.id DESC, s.date DESC
        `;
        const result = await db.query(sql);

        // Group scores by user
        const usersMap = {};
        result.rows.forEach(row => {
            if (!usersMap[row.id]) {
                usersMap[row.id] = {
                    id: row.id,
                    name: row.name,
                    phone: row.phone,
                    scores: []
                };
            }
            if (row.section) {
                usersMap[row.id].scores.push({
                    section: row.section,
                    correct: row.correct,
                    total: row.total,
                    date: row.date,
                    start_time: row.start_time,
                    end_time: row.end_time
                });
            }
        });

        res.json(Object.values(usersMap));
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Admin - Delete User
app.delete('/api/admin/users/:id', verifyToken, verifyAdmin, async (req, res) => {
    const userId = req.params.id;
    try {
        await db.query('DELETE FROM scores WHERE user_id = ?', [userId]);
        await db.query('DELETE FROM class_students WHERE student_id = ?', [userId]);
        await db.query('DELETE FROM users WHERE id = ?', [userId]);
        res.json({ message: 'User and their scores deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Database error deleting user' });
    }
});

// Admin - Get All Tests
app.get('/api/admin/tests/:type', verifyToken, verifyAdmin, async (req, res) => {
    const type = req.params.type;
    const table = type === 'reading' ? 'reading_tests' : 'listening_tests';
    try {
        const result = await db.query(`SELECT id, title FROM ${table} ORDER BY id DESC`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: `Database error fetching ${type} tests` });
    }
});

// Admin - Get Single Test Details
app.get('/api/admin/tests/:type/:id', verifyToken, verifyAdmin, async (req, res) => {
    const { type, id } = req.params;
    const table = type === 'reading' ? 'reading_tests' : 'listening_tests';
    try {
        const result = await db.query(`SELECT * FROM ${table} WHERE id = ?`, [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Test not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: `Database error fetching test` });
    }
});

// Admin - Create a New Test
app.post('/api/admin/tests/:type', verifyToken, verifyAdmin, async (req, res) => {
    const type = req.params.type;
    const table = type === 'reading' ? 'reading_tests' : 'listening_tests';
    const { title, passage, questions, answers } = req.body;

    try {
        let answersData = typeof answers === 'string' ? answers : JSON.stringify(answers);
        if (type === 'reading') {
            await db.query(`INSERT INTO ${table} (title, passage, questions, answers) VALUES (?, ?, ?, ?)`,
                [title, passage, questions, answersData]);
        } else {
            await db.query(`INSERT INTO ${table} (title, passage, questions, answers) VALUES (?, ?, ?, ?)`,
                [title, passage || '', questions, answersData]);
        }
        res.status(201).json({ message: 'Test created successfully' });
    } catch (err) {
        res.status(500).json({ error: `Database error creating ${type} test`, details: err.message });
    }
});

// Admin - Update an Existing Test
app.put('/api/admin/tests/:type/:id', verifyToken, verifyAdmin, async (req, res) => {
    const { type, id } = req.params;
    const table = type === 'reading' ? 'reading_tests' : 'listening_tests';
    const { title, passage, questions, answers } = req.body;

    try {
        let answersData = typeof answers === 'string' ? answers : JSON.stringify(answers);
        if (type === 'reading') {
            await db.query(`UPDATE ${table} SET title = ?, passage = ?, questions = ?, answers = ? WHERE id = ?`,
                [title, passage, questions, answersData, id]);
        } else {
            await db.query(`UPDATE ${table} SET title = ?, passage = ?, questions = ?, answers = ? WHERE id = ?`,
                [title, passage || '', questions, answersData, id]);
        }
        res.json({ message: 'Test updated successfully' });
    } catch (err) {
        res.status(500).json({ error: `Database error updating ${type} test`, details: err.message });
    }
});

// Admin - Delete a Test
app.delete('/api/admin/tests/:type/:id', verifyToken, verifyAdmin, async (req, res) => {
    const { type, id } = req.params;
    const table = type === 'reading' ? 'reading_tests' : 'listening_tests';
    try {
        await db.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
        res.json({ message: 'Test deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: `Database error deleting ${type} test` });
    }
});

// ==========================================
// CLASSROOM & TEACHER API (NEW)
// ==========================================

// Teacher - Get own classes
app.get('/api/teacher/classes', verifyToken, verifyRole(['teacher']), async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM classes WHERE teacher_id = ? ORDER BY id DESC', [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Database error fetching classes' });
    }
});

// Teacher - Get all students from all classes
app.get('/api/teacher/all-students', verifyToken, verifyRole(['teacher']), async (req, res) => {
    try {
        const q = `
            SELECT u.id, u.name, u.phone as login, u.plain_password as password, c.name as class_name, c.id as class_id
            FROM users u
            JOIN class_students cs ON u.id = cs.student_id
            JOIN classes c ON cs.class_id = c.id
            WHERE c.teacher_id = ?
            ORDER BY c.name, u.name
        `;
        const result = await db.query(q, [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Database error fetching all students' });
    }
});

// Teacher - Create a class
app.post('/api/teacher/classes', verifyToken, verifyRole(['teacher']), async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Class name required' });
    try {
        const result = await db.query('INSERT INTO classes (name, teacher_id) VALUES (?, ?)', [name, req.user.id]);
        res.status(201).json({ message: 'Class created', id: result.lastID });
    } catch (err) {
        res.status(500).json({ error: 'Database error creating class' });
    }
});

// Teacher - Delete a class
app.delete('/api/teacher/classes/:id', verifyToken, verifyRole(['teacher']), async (req, res) => {
    const classId = req.params.id;
    try {
        // Only allow if teacher owns the class
        const check = await db.query('SELECT teacher_id FROM classes WHERE id = ?', [classId]);
        if (check.rows.length === 0 || check.rows[0].teacher_id !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized or class not found' });
        }
        await db.query('DELETE FROM assignments WHERE class_id = ?', [classId]);
        await db.query('DELETE FROM class_students WHERE class_id = ?', [classId]);
        await db.query('DELETE FROM classes WHERE id = ?', [classId]);
        res.json({ message: 'Class deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error deleting class' });
    }
});

// Teacher - Add student to class
app.post('/api/teacher/classes/:classId/students', verifyToken, verifyRole(['teacher']), async (req, res) => {
    const { classId } = req.params;
    const { userPhone } = req.body;

    try {
        // Teacher owns the class?
        const check = await db.query('SELECT teacher_id FROM classes WHERE id = ?', [classId]);
        if (check.rows.length === 0 || check.rows[0].teacher_id !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        // Find user by phone
        const userRes = await db.query('SELECT id FROM users WHERE phone = ? AND role = ?', [userPhone, 'user']);
        if (userRes.rows.length === 0) return res.status(404).json({ error: 'Student not found with this phone' });

        try {
            await db.query('INSERT INTO class_students (class_id, student_id) VALUES (?, ?)', [classId, userRes.rows[0].id]);
            res.json({ message: 'Student added to class' });
        } catch (e) {
            res.status(400).json({ error: 'Student may already be in this class' });
        }

    } catch (err) {
        res.status(500).json({ error: 'Database error adding student' });
    }
});

// Teacher - Get Students in a specific class
app.get('/api/teacher/classes/:classId/students', verifyToken, verifyRole(['teacher']), async (req, res) => {
    const { classId } = req.params;
    try {
        const check = await db.query('SELECT teacher_id FROM classes WHERE id = ?', [classId]);
        if (check.rows.length === 0 || check.rows[0].teacher_id !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const sql = `
            SELECT u.id, u.name, u.phone 
            FROM users u
            JOIN class_students cs ON u.id = cs.student_id
            WHERE cs.class_id = ?
        `;
        const result = await db.query(sql, [classId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Database error fetching students' });
    }
});

// Teacher - Assign a test to a class
app.post('/api/teacher/assignments', verifyToken, verifyRole(['teacher']), async (req, res) => {
    const { classId, testType, testId } = req.body;
    try {
        const check = await db.query('SELECT teacher_id FROM classes WHERE id = ?', [classId]);
        if (check.rows.length === 0 || check.rows[0].teacher_id !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }
        await db.query('INSERT INTO assignments (class_id, test_type, test_id) VALUES (?, ?, ?)', [classId, testType, testId]);
        res.status(201).json({ message: 'Test assigned to class' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to assign test' });
    }
});

// Teacher - Get assignments for own classes
app.get('/api/teacher/assignments', verifyToken, verifyRole(['teacher']), async (req, res) => {
    try {
        const sql = `
            SELECT a.id, a.test_type, a.test_id, a.assigned_at, c.name as class_name,
                   COALESCE(rt.title, lt.title, wt.title) as test_title
            FROM assignments a
            JOIN classes c ON a.class_id = c.id
            LEFT JOIN reading_tests rt ON a.test_type = 'reading' AND a.test_id = rt.id
            LEFT JOIN listening_tests lt ON a.test_type = 'listening' AND a.test_id = lt.id
            LEFT JOIN writing_tests wt ON a.test_type = 'writing' AND a.test_id = wt.id
            WHERE c.teacher_id = ?
            ORDER BY a.id DESC
        `;
        const result = await db.query(sql, [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error fetching assignments' });
    }
});

// Teacher - Delete Assignment
app.delete('/api/teacher/assignments/:id', verifyToken, verifyRole(['teacher']), async (req, res) => {
    try {
        // Ensure teacher owns the class for this assignment
        const check = await db.query(`
            SELECT c.teacher_id FROM assignments a 
            JOIN classes c ON a.class_id = c.id
            WHERE a.id = ?
        `, [req.params.id]);

        if (check.rows.length === 0 || check.rows[0].teacher_id !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await db.query('DELETE FROM assignments WHERE id = ?', [req.params.id]);
        res.json({ message: 'Assignment deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Database error deleting assignment' });
    }
});

// Teacher - specific student results from teacher's classes (Proctor Results)
app.get('/api/teacher/results', verifyToken, verifyRole(['teacher']), async (req, res) => {
    try {
        // Get all scores from students that belong to this teacher's classes
        const sql = `
            SELECT s.id, s.section, s.correct, s.total, s.date,
                   u.name as student_name, u.phone as student_phone, c.name as class_name
            FROM scores s
            JOIN users u ON s.user_id = u.id
            JOIN class_students cs ON u.id = cs.student_id
            JOIN classes c ON cs.class_id = c.id
            WHERE c.teacher_id = ?
            ORDER BY s.id DESC
        `;
        const result = await db.query(sql, [req.user.id]);

        // Remove duplicates based on score ID (if a student is in multiple classes of the same teacher)
        const uniqueScores = {};
        result.rows.forEach(r => { uniqueScores[r.id] = r; });

        res.json(Object.values(uniqueScores));
    } catch (err) {
        res.status(500).json({ error: 'Database error fetching results' });
    }
});

// Student - Get My Assignments
app.get('/api/user/assignments', verifyToken, async (req, res) => {
    try {
        const sql = `
            SELECT a.id, a.test_type, a.test_id, a.assigned_at, c.name as class_name,
                   COALESCE(rt.title, lt.title, wt.title) as test_title
            FROM assignments a
            JOIN classes c ON a.class_id = c.id
            JOIN class_students cs ON c.id = cs.class_id
            LEFT JOIN reading_tests rt ON a.test_type = 'reading' AND a.test_id = rt.id
            LEFT JOIN listening_tests lt ON a.test_type = 'listening' AND a.test_id = lt.id
            LEFT JOIN writing_tests wt ON a.test_type = 'writing' AND a.test_id = wt.id
            WHERE cs.student_id = ?
            ORDER BY a.id DESC
        `;
        const result = await db.query(sql, [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error fetching derived assignments' });
    }
});

// Leaderboard API
app.get('/api/leaderboard', async (req, res) => {
    const { type } = req.query; // e.g: 'reading', 'listening', 'writing', 'speaking'

    // Fallback: if no type defined, load all except pending.
    let sectionFilter = "AND s.correct >= 0";
    const params = [];

    if (type) {
        sectionFilter += " AND LOWER(s.section) LIKE ?";
        params.push(`%${type}%`);
    }

    try {
        const sql = `
            SELECT u.id, u.name, 
                   COUNT(s.id) as tests_taken, 
                   SUM(s.correct) as total_correct, 
                   SUM(s.total) as total_questions,
                   ROUND((SUM(CAST(s.correct AS FLOAT)) / SUM(s.total)) * 100) as percentage
            FROM users u
            JOIN scores s ON u.id = s.user_id
            WHERE u.role != 'admin' ${sectionFilter}
            GROUP BY u.id, u.name
            HAVING SUM(s.total) > 0
            ORDER BY percentage DESC, total_correct DESC
        `;
        const result = await db.query(sql, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error fetching leaderboard' });
    }
});

// Reading Tests API
app.get('/api/reading-tests', async (req, res) => {
    try {
        const result = await db.query('SELECT id, title, source_url FROM reading_tests ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error fetching reading tests' });
    }
});

app.get('/api/reading-tests/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await db.query('SELECT * FROM reading_tests WHERE id = ?', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Test not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error fetching test data' });
    }
});

// Listening Tests API
app.get('/api/listening-tests', async (req, res) => {
    try {
        const result = await db.query('SELECT id, title, source_url FROM listening_tests ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error fetching listening tests' });
    }
});

app.get('/api/listening-tests/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await db.query('SELECT * FROM listening_tests WHERE id = ?', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Test not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error fetching test data' });
    }
});

// Writing Tests API
app.get('/api/writing-tests', async (req, res) => {
    try {
        const result = await db.query('SELECT id, title, min_words FROM writing_tests ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error fetching writing tests' });
    }
});

app.get('/api/writing-tests/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await db.query('SELECT * FROM writing_tests WHERE id = ?', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Test not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error fetching test data' });
    }
});

// Provisional Fix for Water hyacinth test bug
db.query(`SELECT id, questions, answers FROM listening_tests WHERE title LIKE '%Water hyacinth%'`).then(result => {
    if (result && result.rows && result.rows.length > 0) {
        const row = result.rows[0];
        if (row.questions.includes('type="checkbox"')) {
            let html = row.questions.replace(/<p><span style="font-weight: 400;"><span><b>A<\/b><\/span>[\s\S]*Electricity production is affected\.<\/span><\/p>/,
                `<p><b>Problem 1: </b><select id="q1"><option value=""></option><option value="A">A - plants and fish are poisoned</option><option value="B">B - Farmers cannot fish</option><option value="C">C - the dam's structure is damaged</option><option value="D">D - Electricity production is affected</option></select></p>
<p><b>Problem 2: </b><select id="q2"><option value=""></option><option value="A">A - plants and fish are poisoned</option><option value="B">B - Farmers cannot fish</option><option value="C">C - the dam's structure is damaged</option><option value="D">D - Electricity production is affected</option></select></p>`);
            let answers = typeof row.answers === 'string' ? JSON.parse(row.answers) : row.answers;
            answers.q1.answer = 'B';
            answers.q2.answer = 'D';
            db.query('UPDATE listening_tests SET questions = ?, answers = ? WHERE id = ?', [html, JSON.stringify(answers), row.id])
                .then(() => console.log('Successfully patched Water Hyacinth test data on startup.'))
                .catch(err => console.error('Error patching Water Hyacinth', err));
        }
    }
}).catch(err => console.error("Could not run startup migration:", err));

// Provisional Fix: Add "Average life expectancy" writing task
db.query(`SELECT id FROM writing_tests WHERE title LIKE '%The chart shows the average life expectancy for males and females in 1900, 1950 and 1990%'`).then(result => {
    if (!result || !result.rows || result.rows.length === 0) {
        const title = "The chart shows the average life expectancy for males and females in 1900, 1950 and 1990.";
        const html = `<p><strong>The chart below shows the average life expectancy for males and females in 1900, 1950 and 1990 in 5 countries.</strong></p>
<p>Summarise the information by selecting and reporting the main features, and make comparisons where relevant.</p>
<div style='text-align: center; margin: 20px 0;'>
    <img src='images/life_expectancy.png' alt='Life expectancy chart' style='max-width: 100%; border: 1px solid #ccc; border-radius: 8px;'/>
</div>`;
        db.query('INSERT INTO writing_tests (title, content, min_words) VALUES (?, ?, ?)', [title, html, 100])
            .then(() => console.log('Successfully added "Life Expectancy" writing task on startup.'))
            .catch(err => console.error('Error inserting Life Expectancy task', err));
    }
}).catch(err => console.error("Could not check writing_tests migration:", err));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    if (db.isPg) {
        console.log(`Operating in Cloud PostgreSQL mode`);
    } else {
        console.log(`Operating in Local SQLite mode`);
    }
});
