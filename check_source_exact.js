const { Pool } = require('pg');
const pool = new Pool({
    connectionString: 'postgresql://ielts_practice_user:aJPRBfwjpyvMEXDVtzY3kcZCg5epf5Jv@dpg-d6jl0u3h46gs73bdh2kg-a.oregon-postgres.render.com/ielts_practice',
    ssl: { rejectUnauthorized: false }
});

async function check() {
    let res = await pool.query("SELECT passage FROM reading_tests WHERE passage ILIKE '%mini-ielts%' LIMIT 1");
    if (res.rows.length) {
        let p = res.rows[0].passage;
        let idx = p.indexOf('mini-ielts');
        console.log("Reading Passage html snippet around mini-ielts:\n", p.substring(Math.max(0, idx - 100), idx + 100));
    }

    let res2 = await pool.query("SELECT questions FROM listening_tests WHERE questions ILIKE '%mini-ielts%' LIMIT 1");
    if (res2.rows.length) {
        let q = res2.rows[0].questions;
        let idx = q.indexOf('mini-ielts');
        console.log("\nListening Question html snippet around mini-ielts:\n", q.substring(Math.max(0, idx - 100), idx + 100));
    }
    pool.end();
}
check();
