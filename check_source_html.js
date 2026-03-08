const { Pool } = require('pg');
const cheerio = require('cheerio');

const pool = new Pool({
    connectionString: 'postgresql://ielts_practice_user:aJPRBfwjpyvMEXDVtzY3kcZCg5epf5Jv@dpg-d6jl0u3h46gs73bdh2kg-a.oregon-postgres.render.com/ielts_practice',
    ssl: { rejectUnauthorized: false }
});

pool.query("SELECT title, passage FROM reading_tests LIMIT 10").then(res => {
    for (let row of res.rows) {
        const $ = cheerio.load(row.passage);
        let found = false;
        $('*').each((i, el) => {
            const text = $(el).text();
            if (text.includes('Source') || text.includes('script') || text.includes('source')) {
                // To avoid logging massive passages
                if (text.length < 200 && (text.toLowerCase().includes('source'))) {
                    console.log(`[${row.title}] Found source attribution html:`, $.html(el));
                    found = true;
                }
            }
        });
        if (!found) {
            // Also check raw string
            const idx = row.passage.toLowerCase().indexOf('source');
            if (idx !== -1) {
                console.log(`[${row.title}] Found raw string around source:`, row.passage.substring(Math.max(0, idx - 50), idx + 50));
            }
        }
    }
    pool.end();
}).catch(console.error);
