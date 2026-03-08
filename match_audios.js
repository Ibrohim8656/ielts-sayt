const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://ielts_practice_user:aJPRBfwjpyvMEXDVtzY3kcZCg5epf5Jv@dpg-d6jl0u3h46gs73bdh2kg-a.oregon-postgres.render.com/ielts_practice',
    ssl: { rejectUnauthorized: false }
});

const sourceDir = 'C:\\Users\\IBM_R\\Desktop\\audios 2';
const destDir = path.join(__dirname, 'audio');

// Simple similarity check (very basic overlap)
function extractKeyWords(str) {
    return str.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(' ').filter(w => w.length > 2);
}

async function matchAudios() {
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir);

    // Get all titles from DB
    const res = await pool.query('SELECT title FROM listening_tests');
    const dbTitles = res.rows.map(r => r.title);

    const files = fs.readdirSync(sourceDir);
    let matchedCount = 0;

    for (const file of files) {
        if (!file.endsWith('.m4a') && !file.endsWith('.mp3')) continue;

        let bestMatch = null;
        let maxScore = 0;

        const fileWords = extractKeyWords(file.replace('.m4a', '').replace('.mp3', ''));

        for (const title of dbTitles) {
            const titleWords = extractKeyWords(title);

            // Check how many words from file match title
            let score = 0;
            for (const fw of fileWords) {
                if (titleWords.includes(fw)) score++;
            }
            // Normalize score
            score = score / Math.max(fileWords.length, 1);

            if (score > maxScore) {
                maxScore = score;
                bestMatch = title;
            }
        }

        if (maxScore > 0.4 && bestMatch) {
            console.log(`[MATCH] ${file}  -->  ${bestMatch}`);

            const sourcePath = path.join(sourceDir, file);

            // Rename and save as .mp3 (browsers are usually okay with m4a containing mp3 extension as long as audio element plays it, 
            // but we'll just name it exactly what the front-end wants: Title.mp3)
            const safeTitle = bestMatch.replace(/[<>:"/\\|?*]+/g, '_');
            const destPath = path.join(destDir, `${safeTitle}.mp3`);

            fs.copyFileSync(sourcePath, destPath);
            matchedCount++;
        } else {
            console.log(`[NO MATCH] ${file} (Best was: ${bestMatch} - score: ${maxScore.toFixed(2)})`);
        }
    }

    console.log(`\nMatched and copied ${matchedCount} audio files.`);
    pool.end();
}

matchAudios().catch(console.error);
