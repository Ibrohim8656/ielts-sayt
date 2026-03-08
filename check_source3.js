const { Pool } = require('pg');
const pool = new Pool({
    connectionString: 'postgresql://ielts_practice_user:aJPRBfwjpyvMEXDVtzY3kcZCg5epf5Jv@dpg-d6jl0u3h46gs73bdh2kg-a.oregon-postgres.render.com/ielts_practice',
    ssl: { rejectUnauthorized: false }
});

async function check() {
    let res = await pool.query("SELECT title FROM reading_tests WHERE passage ILIKE '%mini-ielts%' OR questions ILIKE '%mini-ielts%'");
    console.log("Reading mini-ielts references:", res.rows.length);

    res = await pool.query("SELECT title FROM listening_tests WHERE questions ILIKE '%mini-ielts%'");
    console.log("Listening mini-ielts references in questions:", res.rows.length);
    pool.end();
}
check();
