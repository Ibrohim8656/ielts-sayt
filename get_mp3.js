const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://ielts_practice_user:aJPRBfwjpyvMEXDVtzY3kcZCg5epf5Jv@dpg-d6jl0u3h46gs73bdh2kg-a.oregon-postgres.render.com/ielts_practice',
    ssl: { rejectUnauthorized: false }
});

const audioDir = path.join(__dirname, 'audio');
if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir);

async function downloadMP3s() {
    try {
        const res = await pool.query('SELECT id, title, audio_src FROM listening_tests');
        const tests = res.rows;

        console.log(`Found ${tests.length} listening tests. Starting MP3 downloads...`);

        let successCount = 0;
        let failCount = 0;

        for (const test of tests) {
            if (!test.audio_src) continue;

            // Extract the actual MP3 URL from the audio_src iframe or direct link.
            // Often audio_src is an iframe like <iframe src="https://mini-ielts.com/listen/... 
            // In our DB, we extracted the 'src' attribute. So it's a URL.
            // We need to fetch that URL and find the <audio> or <source> tag inside it.

            try {
                // Determine MP3 link
                let mp3Link = test.audio_src;
                if (!mp3Link.endsWith('.mp3')) {
                    // The src is usually the iframe embed page, we must fetch it to get the MP3
                    const embedRes = await axios.get(mp3Link);
                    const match = embedRes.data.match(/src="(https?:\/\/[^"]+\.mp3)"/);
                    if (match && match[1]) {
                        mp3Link = match[1];
                    } else {
                        // Some alternative matching
                        const match2 = embedRes.data.match(/file:\s*"([^"]+\.mp3)"/);
                        if (match2 && match2[1]) {
                            mp3Link = match2[1];
                        } else {
                            console.log(`[x] Could not find MP3 for ${test.title}`);
                            failCount++;
                            continue;
                        }
                    }
                }

                const safeTitle = test.title.replace(/[<>:"/\\|?*]+/g, '_'); // sanitize filename
                const filePath = path.join(audioDir, `${safeTitle}.mp3`);

                if (fs.existsSync(filePath)) {
                    console.log(`[-] Skiping ${safeTitle}.mp3 (Already exists)`);
                    continue; // Skip existing
                }

                console.log(`[⬇] Downloading ${safeTitle}.mp3 ...`);

                const mp3Res = await axios({
                    method: 'GET',
                    url: mp3Link,
                    responseType: 'stream'
                });

                const writer = fs.createWriteStream(filePath);
                mp3Res.data.pipe(writer);

                await new Promise((resolve, reject) => {
                    writer.on('finish', resolve);
                    writer.on('error', reject);
                });

                successCount++;

            } catch (err) {
                console.log(`[Error] Failed to download ${test.title} - ${err.message}`);
                failCount++;
            }
        }

        console.log(`\nFinished! Successfully downloaded ${successCount} MP3s.`);
        console.log(`Failed or not found: ${failCount}`);
        pool.end();

    } catch (e) {
        console.error("Database connection failed", e);
        pool.end();
    }
}

downloadMP3s();
