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
        db.run('INSERT INTO users (name, phone, password) VALUES (?, ?, ?)', [name, phone, hashedPassword], function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'Phone number already registered' });
                }
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
app.post('/api/login', (req, res) => {
    const { phone, password } = req.body;
    if (!phone || !password) {
        return res.status(400).json({ error: 'Please provide phone and password' });
    }

    db.get('SELECT * FROM users WHERE phone = ?', [phone], async (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, name: user.name, phone: user.phone, role: user.role }, SECRET_KEY, { expiresIn: '7d' });
        res.json({ message: 'Login successful', token, name: user.name, role: user.role });
    });
});

// Reset Password
app.post('/api/reset-password', async (req, res) => {
    const { phone, newPassword } = req.body;
    if (!phone || !newPassword) {
        return res.status(400).json({ error: 'Please provide phone and new password' });
    }

    db.get('SELECT * FROM users WHERE phone = ?', [phone], async (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!user) return res.status(404).json({ error: 'Bunday raqam bilan foydalanuvchi topilmadi' });

        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            db.run('UPDATE users SET password = ? WHERE phone = ?', [hashedPassword, phone], function (err) {
                if (err) return res.status(500).json({ error: 'Database update error' });
                res.json({ message: 'Parol muvaffaqiyatli o\'zgartirildi' });
            });
        } catch (error) {
            res.status(500).json({ error: 'Server error during password hashing' });
        }
    });
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
app.get('/api/profile', verifyToken, (req, res) => {
    db.all('SELECT section, correct, total, date FROM scores WHERE user_id = ? ORDER BY date DESC', [req.user.id], (err, scores) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({
            user: { name: req.user.name, phone: req.user.phone },
            scores: scores
        });
    });
});

// Save Score
app.post('/api/score', verifyToken, (req, res) => {
    const { section, correct, total } = req.body;
    if (!section || correct === undefined || !total) {
        return res.status(400).json({ error: 'Invalid score data' });
    }

    db.run('INSERT INTO scores (user_id, section, correct, total) VALUES (?, ?, ?, ?)',
        [req.user.id, section, correct, total],
        function (err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.status(201).json({ message: 'Score saved' });
        });
});

// Admin - Get All Users & Scores
app.get('/api/admin/users', verifyToken, verifyAdmin, (req, res) => {
    const query = `
        SELECT u.id, u.name, u.phone, s.section, s.correct, s.total, s.date
        FROM users u
        LEFT JOIN scores s ON u.id = s.user_id
        WHERE u.role != 'admin'
        ORDER BY u.id DESC, s.date DESC
    `;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        // Group scores by user
        const usersMap = {};
        rows.forEach(row => {
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
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
