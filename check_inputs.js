const { Pool } = require('pg');
const pool = new Pool({
    connectionString: 'postgresql://ielts_practice_user:aJPRBfwjpyvMEXDVtzY3kcZCg5epf5Jv@dpg-d6jl0u3h46gs73bdh2kg-a.oregon-postgres.render.com/ielts_practice',
    ssl: { rejectUnauthorized: false }
});

pool.query('SELECT title, questions, answers FROM reading_tests ORDER BY id DESC LIMIT 3').then(r => {
    const cheerio = require('cheerio');
    r.rows.forEach(row => {
        console.log('--- TEST:', row.title, '---');
        const $ = cheerio.load(row.questions);
        $('input, select').each((i, el) => console.log($.html(el)));
        console.log('Ans Keys:', Object.keys(typeof row.answers === 'string' ? JSON.parse(row.answers) : row.answers));
    });
    pool.end();
}).catch(e => console.error(e));
