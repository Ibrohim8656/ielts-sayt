const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');

        // Create Users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'user'
        )`, () => {
            // Check if column exists, if not, add it (for existing db)
            db.run(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'`, (err) => {
                // Ignore error if column already exists
            });

            // Seed Admin User
            const adminPhone = 'admin';
            const adminPass = '123parol123';
            const bcrypt = require('bcrypt');

            db.get('SELECT * FROM users WHERE phone = ?', [adminPhone], async (err, row) => {
                if (!row) {
                    const hashed = await bcrypt.hash(adminPass, 10);
                    db.run('INSERT INTO users (name, phone, password, role) VALUES (?, ?, ?, ?)',
                        ['Administrator', adminPhone, hashed, 'admin']);
                    console.log('Admin user seeded.');
                }
            });
        });

        // Create Scores table
        db.run(`CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            section TEXT NOT NULL,
            correct INTEGER NOT NULL,
            total INTEGER NOT NULL,
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);
    }
});

module.exports = db;
