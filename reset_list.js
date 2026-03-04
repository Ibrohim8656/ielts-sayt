const { Pool } = require('pg');
const pool = new Pool({
    connectionString: 'postgresql://ielts_practice_user:aJPRBfwjpyvMEXDVtzY3kcZCg5epf5Jv@dpg-d6jl0u3h46gs73bdh2kg-a.oregon-postgres.render.com/ielts_practice',
    ssl: { rejectUnauthorized: false }
});

pool.query("DELETE FROM listening_tests").then(r => {
    console.log("Deleted all buggy listening tests. Starting fresh scaper...");
    pool.end();
}).catch(e => console.error(e));
