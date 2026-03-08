const { Pool } = require('pg');
const pool = new Pool({
    connectionString: 'postgresql://ielts_practice_user:aJPRBfwjpyvMEXDVtzY3kcZCg5epf5Jv@dpg-d6jl0u3h46gs73bdh2kg-a.oregon-postgres.render.com/ielts_practice',
    ssl: { rejectUnauthorized: false }
});

async function check() {
    let res = await pool.query("SELECT passage, questions FROM reading_tests WHERE passage ILIKE '%<a%mini-ielts%>%' OR questions ILIKE '%<a%mini-ielts%>%'");
    console.log("Reading a tags:", res.rows.length);
    pool.end();
}
check();
