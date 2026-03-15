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

            // Ensure VARCHAR has a length if not specified, without breaking existing lengths like VARCHAR(20)
            // Use word boundary to only replace VARCHAR when it's not immediately followed by (
            pgSql = pgSql.replace(/\bVARCHAR\b(?!\()/gi, 'VARCHAR(255)');

            // Append RETURNING id for INSERT queries if it doesn't already have it
            if (pgSql.trim().toUpperCase().startsWith('INSERT INTO') && !pgSql.toUpperCase().includes('RETURNING')) {
                pgSql = pgSql + ' RETURNING id';
            }

            // Postgres pool.query fails if params is undefined, but [] is perfectly fine.
            pool.query(pgSql, params || [], (err, result) => {
                if (err) {
                    console.error('PostgreSQL Execution Error:', err.message, '\nQuery:', pgSql, '\nParams:', params);
                    return reject(err);
                }

                // Unified standard response: { rows: [...], lastID: result.insertId }
                // For INSERT queries returning id, lastID is in result.rows[0].id
                resolve({
                    rows: result.rows || [],
                    lastID: (result.rows && result.rows.length && result.rows[0].id) ? result.rows[0].id : null
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
            plain_password VARCHAR(255) DEFAULT '123456',
            role VARCHAR(50) DEFAULT 'user'
        )`);

        if (!isPg) {
            // Check if column role exists in SQLite, if not, add it safely
            sqliteDb.run(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'`, (err) => {
                // Ignore error if column already exists
            });
            sqliteDb.run(`ALTER TABLE users ADD COLUMN plain_password TEXT DEFAULT '123456'`, (err) => { });
        } else {
            try { await query(`ALTER TABLE users ADD COLUMN plain_password VARCHAR(255) DEFAULT '123456'`); } catch (e) { }
        }

        // Scores Table
        await query(`CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            section VARCHAR(255) NOT NULL,
            correct INTEGER NOT NULL,
            total INTEGER NOT NULL,
            start_time TIMESTAMP,
            end_time TIMESTAMP,
            user_answers TEXT,
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        // Safely add missing columns to scores table for existing databases
        if (!isPg) {
            sqliteDb.run(`ALTER TABLE scores ADD COLUMN start_time TEXT`, (e) => { });
            sqliteDb.run(`ALTER TABLE scores ADD COLUMN end_time TEXT`, (e) => { });
            sqliteDb.run(`ALTER TABLE scores ADD COLUMN user_answers TEXT`, (e) => { });
            sqliteDb.run(`ALTER TABLE scores ADD COLUMN trust_score INTEGER DEFAULT 100`, (e) => { });
        } else {
            // Postgres ignores duplicate column errors if using catch
            const addCols = [
                'ALTER TABLE scores ADD COLUMN start_time TIMESTAMP',
                'ALTER TABLE scores ADD COLUMN end_time TIMESTAMP',
                'ALTER TABLE scores ADD COLUMN user_answers JSONB',
                'ALTER TABLE scores ADD COLUMN trust_score INTEGER DEFAULT 100'
            ];
            for (let c of addCols) {
                try { await query(c); } catch (e) { /* ignore already exists */ }
            }
        }

        // Reading Tests Table
        await query(`CREATE TABLE IF NOT EXISTS reading_tests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source_url VARCHAR UNIQUE,
            title VARCHAR,
            passage TEXT,
            questions TEXT,
            answers TEXT
        )`);

        // Listening Tests Table
        await query(`CREATE TABLE IF NOT EXISTS listening_tests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source_url VARCHAR UNIQUE,
            title VARCHAR,
            audio_src TEXT,
            questions TEXT,
            answers TEXT
        )`);

        // Writing Tests Table
        await query(`CREATE TABLE IF NOT EXISTS writing_tests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title VARCHAR UNIQUE,
            content TEXT,
            min_words INTEGER DEFAULT 250
        )`);

        // Classes Table (Classroom)
        await query(`CREATE TABLE IF NOT EXISTS classes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255) NOT NULL,
            teacher_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(teacher_id) REFERENCES users(id)
        )`);

        // Class Students Table (Classroom)
        await query(`CREATE TABLE IF NOT EXISTS class_students (
            class_id INTEGER NOT NULL,
            student_id INTEGER NOT NULL,
            PRIMARY KEY (class_id, student_id),
            FOREIGN KEY(class_id) REFERENCES classes(id),
            FOREIGN KEY(student_id) REFERENCES users(id)
        )`);

        // Assignments Table (Classroom)
        await query(`CREATE TABLE IF NOT EXISTS assignments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            class_id INTEGER NOT NULL,
            test_type VARCHAR(50) NOT NULL, -- 'reading', 'listening', 'writing', 'speaking'
            test_id INTEGER NOT NULL,
            assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(class_id) REFERENCES classes(id)
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
