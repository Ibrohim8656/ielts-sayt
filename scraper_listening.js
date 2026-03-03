const axios = require('axios');
const cheerio = require('cheerio');
const db = require('./db');

async function getTestLinksFromPage(pageNumber) {
    try {
        console.log(`Fetching listening test list on page ${pageNumber}...`);
        const url = `https://mini-ielts.com/listening?page=${pageNumber}`;
        const response = await axios.get(url, { timeout: 15000 });
        const $ = cheerio.load(response.data);

        const testLinks = [];
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            if (href && href.match(/^\/\d+\/listening\/.+$/)) {
                const fullUrl = 'https://mini-ielts.com' + href;
                if (!testLinks.includes(fullUrl)) {
                    testLinks.push(fullUrl);
                }
            }
        });
        return testLinks;
    } catch (e) {
        console.error(`Error on list page ${pageNumber}: `, e.message);
        return [];
    }
}

async function scrapeTest(testUrl) {
    try {
        const response = await axios.get(testUrl, { timeout: 15000 });
        const $ = cheerio.load(response.data);
        const title = $('h2').first().text().trim();

        const audioSrc = $('iframe#player').attr('src') || $('iframe').first().attr('src');
        if (!audioSrc) return null; // If there is no audio, we might skip or let it fail, but audio is required here.

        let questionsHtml = '';
        $('.exam-content .exam-section').each((i, el) => {
            if ($(el).find('.ads').length > 0) return;
            if ($(el).text().includes('---End of the Test---')) return;
            // Also skip modal popups if they exist here
            if ($(el).find('#myModal').length > 0) return;

            // Remove the 'Show workspace' buttons and textareas entirely
            $(el).find('.workspace').remove();
            $(el).find('.workspace-text').remove();

            questionsHtml += $(el).html();
        });

        // get answers
        const solUrl = testUrl.replace('/listening/', '/view-solution/listening/');
        const solRes = await axios.get(solUrl, { timeout: 15000 });
        const $sol = cheerio.load(solRes.data);

        const answers = {};
        let ansCount = 1;
        $sol('*:contains("Answer:")').each((i, el) => {
            if ($sol(el).children().length === 0 && $sol(el).text().includes("Answer:")) {
                const val = $sol(el).text().trim().replace(/Answer:\s*/g, '');
                answers["q" + ansCount] = { answer: val, explanation: "" };
                ansCount++;
            }
        });

        return {
            source_url: testUrl,
            title,
            audio_src: audioSrc,
            questions: questionsHtml,
            answers
        };
    } catch (e) {
        console.error(`Error scraping test ${testUrl}: `, e.message);
        return null;
    }
}

async function runScraper() {
    // Start scraping for listening
    const maxPages = 40; // Hard limit but will break early if no links
    let totalAdded = 0;

    for (let p = 1; p <= maxPages; p++) {
        const links = await getTestLinksFromPage(p);
        if (links.length === 0) break; // Reached the end early

        // process 3 links at a time
        for (let i = 0; i < links.length; i += 3) {
            const batch = links.slice(i, i + 3);
            const results = await Promise.all(batch.map(link => scrapeTest(link)));

            for (const test of results) {
                if (test && test.audio_src && Object.keys(test.answers).length > 0) {
                    try {
                        await db.query(`
                            INSERT INTO listening_tests (source_url, title, audio_src, questions, answers) 
                            VALUES ($1, $2, $3, $4, $5)
                            ON CONFLICT (source_url) DO NOTHING
                        `, [test.source_url, test.title, test.audio_src, test.questions, JSON.stringify(test.answers)]);
                        totalAdded++;
                        process.stdout.write(".");
                    } catch (e) {
                        // ignore conflict
                    }
                }
            }
        }
        console.log(`\nFinished page ${p}, Total added so far: ${totalAdded}`);
    }
    console.log(`\nScraping complete. Added ${totalAdded} listening tests.`);
    process.exit(0);
}

runScraper();
