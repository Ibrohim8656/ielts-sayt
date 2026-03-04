const { Pool } = require('pg');
const pool = new Pool({
    connectionString: 'postgresql://ielts_practice_user:aJPRBfwjpyvMEXDVtzY3kcZCg5epf5Jv@dpg-d6jl0u3h46gs73bdh2kg-a.oregon-postgres.render.com/ielts_practice',
    ssl: { rejectUnauthorized: false }
});

pool.query('SELECT * FROM scores ORDER BY id DESC LIMIT 10').then(r => {
    console.log("Recent Scores:", r.rows);
    pool.end();
}).catch(e => console.error(e));
