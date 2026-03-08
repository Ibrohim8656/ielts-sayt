const { Pool } = require('pg');
const pool = new Pool({
    connectionString: 'postgresql://ielts_practice_user:aJPRBfwjpyvMEXDVtzY3kcZCg5epf5Jv@dpg-d6jl0u3h46gs73bdh2kg-a.oregon-postgres.render.com/ielts_practice',
    ssl: { rejectUnauthorized: false }
});

pool.query("SELECT title, passage, questions FROM reading_tests LIMIT 2").then(res => {
    const p = res.rows[0].passage;
    console.log("Passage matches 'mini-ielts' or 'Source' or 'manba':");
    const matches = p.match(/.{0,30}(mini-ielts|Source|http|manba).{0,30}/gi);
    if (matches) console.log(matches);

    // Check questions too
    const qMatches = res.rows[0].questions.match(/.{0,30}(mini-ielts|Source|http|manba).{0,30}/gi);
    if (qMatches) console.log("Questions matches: ", qMatches);

    pool.end();
}).catch(console.error);
