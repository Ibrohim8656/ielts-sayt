const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbUrl = process.env.DATABASE_URL;
let pool;
let sqliteDb;
const isPg = !!dbUrl;

if (isPg) {
    // Render.com PostgreSQL connection
    pool = new Pool({
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false } // Required for Render DB
    });

    pool.on('connect', () => {
        console.log('Connected to PostgreSQL database.');
    });

    pool.on('error', (err) => {
        console.error('Unexpected error on idle PostgreSQL client', err);
        process.exit(-1);
    });

} else {
    // Local SQLite connection
    const dbPath = path.resolve(__dirname, 'database.sqlite');
    sqliteDb = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error opening SQLite database', err.message);
        } else {
            console.log('Connected to local SQLite database.');
        }
    });
}

// Internal query wrapper mechanism to support BOTH pg and sqlite seamlessly.
// SQLite uses ?, pg uses $1, $2, etc.
const query = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        if (isPg) {
            // Translate "?" in sql to "$1", "$2", etc for PG
            let pgSql = sql;
            let counter = 1;

            // Only replace ? when they are outside of quotes if we wanted to be perfectly safe,
            // but for our simple queries indexOf is fine. However we must only replace parameters we actually supply!
            if (params && params.length > 0) {
                while (pgSql.includes('?')) {
                    pgSql = pgSql.replace('?', `$${counter++}`);
                }
            }

            // Adjust Data Types for Postgres explicitly in create table commands
            pgSql = pgSql.replace(/INTEGER PRIMARY KEY AUTOINCREMENT/gi, 'SERIAL PRIMARY KEY');
            // Adjust for JSONB type in Postgres
            pgSql = pgSql.replace(/answers TEXT/gi, 'answers JSONB');
            pgSql = pgSql.replace(/VARCHAR/gi, 'VARCHAR(255)'); // Ensure VARCHAR has a length if not specified

            // Postgres pool.query fails if params is undefined, but [] is perfectly fine.
            pool.query(pgSql, params || [], (err, result) => {
                if (err) {
                    console.error('PostgreSQL Execution Error:', err.message, '\nQuery:', pgSql, '\nParams:', params);
                    return reject(err);
                }
                // Unified standard response: { rows: [...], lastID: result.insertId }
                resolve({
                    rows: result.rows || [],
                    // Postgres typically requires RETURNING id. Since we don't have it uniformly, return null safely.
                    lastID: (result.rows && result.rows.length) ? result.rows[0].id : null
                });
            });
        } else {
            // SQLite Execution
            const isSelect = sql.trim().toUpperCase().startsWith('SELECT');

            if (isSelect) {
                sqliteDb.all(sql, params || [], (err, rows) => {
                    if (err) reject(err);
                    else resolve({ rows });
                });
            } else {
                sqliteDb.run(sql, params || [], function (err) {
                    if (err) reject(err);
                    else resolve({ rows: [], lastID: this.lastID });
                });
            }
        }
    });
};

// Initialize schema on startup
const initSchema = async () => {
    try {
        // Users Table
        await query(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) NOT NULL,
            phone VARCHAR(20) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role VARCHAR(50) DEFAULT 'user'
        )`);

        if (!isPg) {
            // Check if column role exists in SQLite, if not, add it safely
            sqliteDb.run(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'`, (err) => {
                // Ignore error if column already exists
            });
        }

        // Scores Table
        await query(`CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            section VARCHAR(255) NOT NULL,
            correct INTEGER NOT NULL,
            total INTEGER NOT NULL,
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        // Reading Tests Table
        await query(`CREATE TABLE IF NOT EXISTS reading_tests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source_url VARCHAR UNIQUE,
            title VARCHAR,
            passage TEXT,
            questions TEXT,
            answers TEXT
        )`);

        // Seed Admin User
        const adminPhone = 'admin';
        const adminPass = '123parol123';
        const res = await query('SELECT * FROM users WHERE phone = ?', [adminPhone]);

        if (res.rows.length === 0) {
            const hashed = await bcrypt.hash(adminPass, 10);
            await query('INSERT INTO users (name, phone, password, role) VALUES (?, ?, ?, ?)',
                ['Administrator', adminPhone, hashed, 'admin']);
            console.log('Admin user seeded successfully.');
        }

    } catch (err) {
        console.error('Error initializing schema:', err);
    }
};

// Start initialization
initSchema();

module.exports = {
    query,
    isPg
};
