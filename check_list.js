const { Pool } = require('pg');
const pool = new Pool({
    connectionString: 'postgresql://ielts_practice_user:aJPRBfwjpyvMEXDVtzY3kcZCg5epf5Jv@dpg-d6jl0u3h46gs73bdh2kg-a.oregon-postgres.render.com/ielts_practice',
    ssl: { rejectUnauthorized: false }
});

pool.query("SELECT COUNT(*) FROM listening_tests").then(r => {
    console.log("Listening Tests Count:", r.rows[0].count);
    return pool.query("SELECT id, title FROM listening_tests LIMIT 5");
}).then(r => {
    console.log("Sample Tests:", r.rows);
    pool.end();
}).catch(e => console.error(e));
