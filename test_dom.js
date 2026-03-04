const { Pool } = require('pg');
const cheerio = require('cheerio');

const pool = new Pool({
    connectionString: 'postgresql://ielts_practice_user:aJPRBfwjpyvMEXDVtzY3kcZCg5epf5Jv@dpg-d6jl0u3h46gs73bdh2kg-a.oregon-postgres.render.com/ielts_practice',
    ssl: { rejectUnauthorized: false }
});

async function runSim() {
    const res = await pool.query('SELECT questions, answers FROM reading_tests ORDER BY id DESC LIMIT 1');
    if (res.rows.length === 0) return;
    const { questions, answers } = res.rows[0];

    const $ = cheerio.load(questions);

    const ANSWERS_DATA = typeof answers === 'string' ? JSON.parse(answers) : answers;
    const allQuestions = Object.keys(ANSWERS_DATA);

    let missingElements = [];
    let foundElements = [];

    allQuestions.forEach(qId => {
        const inputElem = $('#' + qId).length ? $('#' + qId).first() :
            $('input[name="' + qId + '"]').length ? $('input[name="' + qId + '"]').first() :
                $('select[id="' + qId + '"]').length ? $('select[id="' + qId + '"]').first() :
                    $('select[name="' + qId + '"]').length ? $('select[name="' + qId + '"]').first() : null;

        if (!inputElem) {
            missingElements.push(qId);
        } else {
            foundElements.push(qId + " -> " + inputElem.prop('tagName'));
        }
    });

    console.log("Found:", foundElements.length, "Missing:", missingElements.length);
    if (missingElements.length > 0) {
        console.log("Missing IDs:", missingElements);
    } else {
        console.log("Found Elements Sample:", foundElements.slice(0, 5));
    }
    pool.end();
}

runSim().catch(console.error);
