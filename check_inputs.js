const { Pool } = require('pg');
const cheerio = require('cheerio');
const pool = new Pool({
    connectionString: 'postgresql://ielts_practice_user:aJPRBfwjpyvMEXDVtzY3kcZCg5epf5Jv@dpg-d6jl0u3h46gs73bdh2kg-a.oregon-postgres.render.com/ielts_practice',
    ssl: { rejectUnauthorized: false }
});

pool.query('SELECT questions FROM reading_tests ORDER BY id DESC LIMIT 1').then(r => {
    const $ = cheerio.load(r.rows[0].questions);
    $('input, select').each((i, el) => {
        console.log($(el).prop('tagName'), 'name:', $(el).attr('name'), 'id:', $(el).attr('id'));
    });
    pool.end();
}).catch(e => console.error(e));
