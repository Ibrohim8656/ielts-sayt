const axios = require('axios');
const cheerio = require('cheerio');

async function testFetch() {
    try {
        const solUrl = 'https://mini-ielts.com/1518/view-solution/reading/australian-artist-margaret-preston';
        const solRes = await axios.get(solUrl);
        const $ = cheerio.load(solRes.data);

        let ansCount = 1;
        $('*:contains("Answer:")').each((i, el) => {
            // Find innermost texts containing "Answer:"
            if ($(el).children().length === 0 && $(el).text().includes("Answer:")) {
                console.log(`Q${ansCount}: ` + $(el).text().trim());
                ansCount++;
            }
        });

    } catch (e) {
        console.error(e.message);
    }
}

testFetch();
