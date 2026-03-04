const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function checkListeningPage() {
    const url = 'https://mini-ielts.com/listening?page=1';
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);

    // Find links that match listening tests
    $('a[href*="/listening/"]').each((i, el) => {
        if (i < 5) {
            console.log("Link:", $(el).attr('href'));
            console.log("Text inside A:", $(el).text().trim());
            console.log("Parent text:", $(el).parent().text().trim());
            console.log("---");
        }
    });
}
checkListeningPage();
