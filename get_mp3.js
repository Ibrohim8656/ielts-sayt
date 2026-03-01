const fs = require('fs');

fetch('https://mini-ielts.com/1163/listening/theatre-trip-to-munich')
    .then(r => r.text())
    .then(t => {
        const regex = /https?:\/\/[^\s\"\'\>]+\.mp3/ig;
        const matches = t.match(regex);
        console.log(matches ? matches[0] : 'No mp3 found');
    })
    .catch(console.error);
