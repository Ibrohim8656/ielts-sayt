const { Pool } = require('pg');
const pool = new Pool({
    connectionString: 'postgresql://ielts_practice_user:aJPRBfwjpyvMEXDVtzY3kcZCg5epf5Jv@dpg-d6jl0u3h46gs73bdh2kg-a.oregon-postgres.render.com/ielts_practice',
    ssl: { rejectUnauthorized: false }
});

pool.query("SELECT passage, questions FROM reading_tests LIMIT 5").then(res => {
    for (let row of res.rows) {
        if (row.passage.includes('mini-ielts.com')) console.log("Found in passage");
        if (row.questions.includes('mini-ielts.com')) console.log("Found in questions");
        if (row.passage.toLowerCase().includes('source') || row.passage.toLowerCase().includes('manba')) {
            console.log("Found 'source' word in passage");
        }
    }
    pool.end();
}).catch(console.error);
