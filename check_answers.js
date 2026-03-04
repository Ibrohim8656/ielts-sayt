const { Pool } = require('pg');
const pool = new Pool({
    connectionString: 'postgresql://ielts_practice_user:aJPRBfwjpyvMEXDVtzY3kcZCg5epf5Jv@dpg-d6jl0u3h46gs73bdh2kg-a.oregon-postgres.render.com/ielts_practice',
    ssl: { rejectUnauthorized: false }
});

pool.query('SELECT questions, answers FROM listening_tests ORDER BY id DESC LIMIT 5').then(r => {
    const cheerio = require('cheerio');
    r.rows.forEach((row, idx) => {
        const $ = cheerio.load(row.questions);
        const names = [];
        $('input, select').each((i, el) => {
            names.push($(el).attr('name') || $(el).attr('id'));
        });
        console.log('Test', idx);
        console.log('  Ans Keys:', Object.keys(row.answers || {}));
        console.log('  Inputs:', names);
    });
    pool.end();
}).catch(e => console.error(e));
