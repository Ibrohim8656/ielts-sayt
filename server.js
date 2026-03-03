const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'ielts_practice_secret_key_123'; // In production, use environment variables

app.use(cors());
app.use(express.json());
// Serve static files from the current folder
app.use(express.static(path.join(__dirname)));

// --- API ENDPOINTS ---

// Register
app.post('/api/register', async (req, res) => {
    const { name, phone, password } = req.body;
    if (!name || !phone || !password) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query('INSERT INTO users (name, phone, password) VALUES (?, ?, ?)', [name, phone, hashedPassword]);
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
    const { phone, password } = req.body;
    if (!phone || !password) {
        return res.status(400).json({ error: 'Please provide phone and password' });
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

// Middleware to verify token
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

const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied: Requires admin role' });
    }
};

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

// Save Score
app.post('/api/score', verifyToken, async (req, res) => {
    const { section, correct, total } = req.body;
    if (!section || correct === undefined || !total) {
        return res.status(400).json({ error: 'Invalid score data' });
    }

    try {
        await db.query('INSERT INTO scores (user_id, section, correct, total) VALUES (?, ?, ?, ?)', [req.user.id, section, correct, total]);
        res.status(201).json({ message: 'Score saved' });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Admin - Get All Users & Scores
app.get('/api/admin/users', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const sql = `
            SELECT u.id, u.name, u.phone, s.section, s.correct, s.total, s.date
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
                    date: row.date
                });
            }
        });

        res.json(Object.values(usersMap));
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    if (db.isPg) {
        console.log(`Operating in Cloud PostgreSQL mode`);
    } else {
        console.log(`Operating in Local SQLite mode`);
    }
});
