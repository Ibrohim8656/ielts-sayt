const db = require('./db');

const writeDataToDB = async () => {
    // Ajoyib, yangi yozish jadvalini yaratib ma'lumotlarni yozamiz

    const taskContent = `
        <h2>Writing Task 1</h2>
        <p><strong>You should spend about 20 minutes on this task.</strong></p>
        
        <div style="background:var(--bg-color); padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid var(--primary-color);">
            <p style="font-style: italic; font-weight: 500;">
                The table below shows information about the population of New Zealand from 2011 to 2012 by age group.
            </p>
            <p style="font-weight: 600;">
                Summarise the information by selecting and reporting the main features, and make comparisons where relevant.
            </p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; border: 1px solid var(--border-color); text-align: left;">
            <thead>
                <tr style="background: rgba(0,0,0,0.05);">
                    <th style="padding: 10px; border: 1px solid var(--border-color);">Group</th>
                    <th style="padding: 10px; border: 1px solid var(--border-color);">2011</th>
                    <th style="padding: 10px; border: 1px solid var(--border-color);">2012</th>
                    <th style="padding: 10px; border: 1px solid var(--border-color);">Percentage Change</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="padding: 10px; border: 1px solid var(--border-color);">All ages</td>
                    <td style="padding: 10px; border: 1px solid var(--border-color);">4.400.000</td>
                    <td style="padding: 10px; border: 1px solid var(--border-color);">4.460.000</td>
                    <td style="padding: 10px; border: 1px solid var(--border-color);">+0,6</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid var(--border-color);">Under 15</td>
                    <td style="padding: 10px; border: 1px solid var(--border-color);">801.750</td>
                    <td style="padding: 10px; border: 1px solid var(--border-color);">800.000</td>
                    <td style="padding: 10px; border: 1px solid var(--border-color);">-0,2</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid var(--border-color);">15-39</td>
                    <td style="padding: 10px; border: 1px solid var(--border-color);">1.520.000</td>
                    <td style="padding: 10px; border: 1px solid var(--border-color);">1500.000</td>
                    <td style="padding: 10px; border: 1px solid var(--border-color);">-0,2</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid var(--border-color);">40-64</td>
                    <td style="padding: 10px; border: 1px solid var(--border-color);">1.400.000</td>
                    <td style="padding: 10px; border: 1px solid var(--border-color);">1.460.000</td>
                    <td style="padding: 10px; border: 1px solid var(--border-color);">+0,6</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid var(--border-color);">65 +</td>
                    <td style="padding: 10px; border: 1px solid var(--border-color);">500.000</td>
                    <td style="padding: 10px; border: 1px solid var(--border-color);">900.000</td>
                    <td style="padding: 10px; border: 1px solid var(--border-color);">+4,0</td>
                </tr>
            </tbody>
        </table>

        <p style="margin-top: 20px;"><strong>Write at least 100 words.</strong></p>
    `;

    try {
        await db.query(
            "INSERT INTO writing_tests (title, content, min_words) VALUES (?, ?, ?) ON CONFLICT (title) DO UPDATE SET content=excluded.content",
            ["Population of New Zealand from 2011 to 2012 by age group", taskContent, 100]
        );
        console.log("Muvaffaqiyatli saqlandi!");
    } catch (err) {
        if (err.code === 'SQLITE_ERROR' && err.message.includes('ON CONFLICT')) {
            // SQLite doesn't directly support Postgres syntax for upsert, so let's check first
            const existing = await db.query("SELECT id FROM writing_tests WHERE title = ?", ["Population of New Zealand from 2011 to 2012 by age group"]);
            if (existing.rows.length > 0) {
                await db.query("UPDATE writing_tests SET content = ?, min_words = ? WHERE title = ?", [taskContent, 100, "Population of New Zealand from 2011 to 2012 by age group"]);
                console.log("Tahrirlandi.");
            } else {
                await db.query("INSERT INTO writing_tests (title, content, min_words) VALUES (?, ?, ?)", ["Population of New Zealand from 2011 to 2012 by age group", taskContent, 100]);
                console.log("Yaratildi.");
            }
        } else {
            console.error(err);
        }
    }

    // Yana bitta oldingi Writing Task 2 ni ham saqlab qo'yamiz adashib o'chib ketgan bo'lsa
    const oldTaskContent = `
        <h2>Writing Task 2</h2>
        <p><strong>You should spend about 40 minutes on this task.</strong></p>
        <p>Write about the following topic:</p>

        <div style="background:var(--bg-color); padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid var(--primary-color);">
            <p style="font-weight: 600; font-size: 1.15rem;">Some people believe that unpaid community service should be a compulsory part of high school programs.</p>
            <p style="font-weight: 600; font-size: 1.15rem;">To what extent do you agree or disagree?</p>
        </div>

        <p>Give reasons for your answer and include any relevant examples from your own knowledge or experience.</p>
        <p><strong>Write at least 250 words.</strong></p>
    `;

    try {
        const existing = await db.query("SELECT id FROM writing_tests WHERE title = ?", ["Unpaid community service in high schools"]);
        if (existing.rows.length === 0) {
            await db.query("INSERT INTO writing_tests (title, content, min_words) VALUES (?, ?, ?)", ["Unpaid community service in high schools", oldTaskContent, 250]);
            console.log("Eski task xam bazaga olindi!");
        }
    } catch (e) {
        console.log(e);
    }

    process.exit(0);
}

// 2 sekund kutish (DB initialize bo'lishi uchun db.js orqali)
setTimeout(() => {
    writeDataToDB();
}, 2000);
