// ==========================================
// TO'G'RI JAVOBLAR VA YECHIMLAR QOIDASI
// ==========================================
let ANSWERS_DATA = {
    // Eshitish va O'qish testlariga oid barcha javoblar sahifa yuklanganda dinamik tarzda qo'shiladi
};

// ==========================================
// DYNAMIC READING TIZIMI
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Agar biz reading sahifasida bo'lsak va test_data.js ulangan bo'lsa
    if (window.location.pathname.includes('reading.html') || window.location.pathname.includes('reading_test.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        let testId = urlParams.get('id');

        // Agar id berilmagan bo'lsa, default holatda activities_for_children ni ochamiz
        if (!testId || !TEST_DATA[testId]) {
            testId = "activities_for_children";
        }

        const testContent = TEST_DATA[testId];

        const passageContainer = document.querySelector('.passage-content');
        const rightPane = document.querySelector('.right-pane');

        if (passageContainer && rightPane && testContent) {
            // HTML ni joylashtirish
            passageContainer.innerHTML = testContent.passage;
            rightPane.innerHTML = testContent.questions;

            // Javoblarni ANSWERS_DATA ga o'zlashtirish
            // Qolgan Listening javoblari bilan qo'shilib ketishi uchun Object.assign ishlatamiz
            Object.assign(ANSWERS_DATA, testContent.answers);
        }
    }
});

// ==========================================
// DYNAMIC LISTENING TIZIMI
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Agar biz listening sahifasida bo'lsak va test_data.js ulangan bo'lsa
    if (window.location.pathname.includes('listening.html') && typeof LISTENING_TEST_DATA !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        let testId = urlParams.get('id');

        // Agar id berilmagan bo'lsa, default holatda theatre_trip_munich ni ochamiz
        if (!testId || !LISTENING_TEST_DATA[testId]) {
            testId = "theatre_trip_munich";
        }

        const testContent = LISTENING_TEST_DATA[testId];

        const passageContainer = document.querySelector('.passage-content');
        const rightPane = document.querySelector('.right-pane');

        if (passageContainer && rightPane && testContent) {
            // HTML ni joylashtirish
            passageContainer.innerHTML = testContent.passage;
            rightPane.innerHTML = testContent.questions;

            // Audio tag mavjudligini tekshiramiz va unga qanday mp3 load bo'lishini aytamiz
            let audioNode = passageContainer.querySelector('audio source');
            if (audioNode && testContent.audio_src) {
                audioNode.src = testContent.audio_src;
                audioNode.parentElement.load();
            }

            // Javoblarni o'zlashtirish
            Object.assign(ANSWERS_DATA, testContent.answers);
        }
    }
});

// ==========================================
// TAYMER MANTIG'I
// ==========================================
let totalSeconds = 20 * 60; // 20 daqiqa
let timerInterval;
const timeText = document.getElementById("time-text");
const timerDisplay = document.getElementById("timer-display");

if (timeText) { // Agar taymer bor bo'lgan sahifada bo'lsak
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    if (totalSeconds <= 0) {
        clearInterval(timerInterval);
        finishTest();
        return;
    }

    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    if (totalSeconds <= 180) timerDisplay.classList.add("warning");

    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;

    timeText.textContent = `${minutes}:${seconds}`;
    totalSeconds--;
}

// ==========================================
// TESTNI YAKUNLASH VA YECHIMLARNI KO'RSATISH
// ==========================================
let testFinished = false;

function finishTest() {
    if (testFinished) return;
    testFinished = true;

    if (timerInterval) clearInterval(timerInterval);

    const submitBtn = document.getElementById("submit-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Finished & Checked";

    let correctCount = 0;

    // Sahifadagi mavjud input/radio larni yig'ib chiqish uchun:
    const allQuestionBlocks = document.querySelectorAll('.question-block');
    let questionsOnPage = 0;

    allQuestionBlocks.forEach(block => {
        // q1, q2 kabi ID larni aniqlaymiz
        const firstInput = block.querySelector('input');
        if (!firstInput) return; // Agar faqat matn bo'lsa o'tkazib yuboramiz

        const qId = firstInput.name || firstInput.id;
        if (!ANSWERS_DATA[qId]) return; // Bazasida yo'q savol

        questionsOnPage++;

        const expectedAnswer = ANSWERS_DATA[qId].answer.toLowerCase().trim();
        const explanation = ANSWERS_DATA[qId].explanation;

        // Feedback Box yaratamiz (Har bir savol tagida chiqadi)
        let feedbackBox = document.createElement("div");
        feedbackBox.className = "feedback-box";

        let userAnswer = "";
        let isCorrect = false;

        // Multiple choice tekshiruvi
        if (firstInput.type === "radio") {
            const radios = block.querySelectorAll('input[type="radio"]');
            let answered = false;

            radios.forEach(r => {
                r.disabled = true;
                if (r.checked) {
                    answered = true;
                    userAnswer = r.value;
                    if (r.value.toLowerCase().trim() === expectedAnswer) {
                        isCorrect = true;
                        r.closest('.option').classList.add('checked-correct');
                    } else {
                        r.closest('.option').classList.add('checked-wrong');
                    }
                }
            });

            if (!answered) { userAnswer = "[No Answer provided]"; }

        }
        // Bo'shliqlarni to'ldirish
        else if (firstInput.type === "text") {
            firstInput.disabled = true;
            userAnswer = firstInput.value;

            if (userAnswer.toLowerCase().trim() === expectedAnswer) {
                isCorrect = true;
                firstInput.classList.add('checked-correct');
            } else {
                firstInput.classList.add('checked-wrong');
            }

            if (userAnswer === "") { userAnswer = "[Empty]"; }
        }

        if (isCorrect) correctCount++;

        // Feedback html yozuvini shakllantirish
        if (isCorrect) {
            feedbackBox.classList.add("correct");
            feedbackBox.innerHTML = `
                <div class="feedback-title">✓ Correct</div>
                <div>Your answer: <strong>${userAnswer}</strong></div>
                <div class="feedback-solution">Solution: ${explanation}</div>
            `;
        } else {
            feedbackBox.classList.add("wrong");
            feedbackBox.innerHTML = `
                <div class="feedback-title">✗ Incorrect</div>
                <div>Your answer: <strong>${userAnswer}</strong></div>
                <div>Correct answer: <strong>${ANSWERS_DATA[qId].answer}</strong></div>
                <div class="feedback-solution">Solution: ${explanation}</div>
            `;
        }

        block.appendChild(feedbackBox);

        // Agar Multiple Choice da adashgan bo'lsa to'g'ri variantni yashil qilib qo'yish
        if (!isCorrect && firstInput.type === "radio") {
            const radios = block.querySelectorAll('input[type="radio"]');
            radios.forEach(r => {
                if (r.value.toLowerCase().trim() === expectedAnswer) {
                    r.closest('.option').style.border = "2px dashed var(--success-color)";
                    r.closest('.option').style.background = "#fff";
                }
            });
        }
    });

    showResultModal(correctCount, questionsOnPage);

    // Save score to backend if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
        // Find which section this is by looking at the page title or filename
        let section = "Practice Test";
        if (window.location.pathname.includes('listening')) section = "Listening";
        else if (window.location.pathname.includes('reading')) section = "Reading";

        fetch('http://localhost:3000/api/score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                section: section,
                correct: correctCount,
                total: questionsOnPage
            })
        }).catch(err => console.error("Error saving score:", err));
    }
}

// Modal oyna funksiyalari
function showResultModal(correct, total) {
    document.getElementById("correct-count").textContent = correct;
    document.getElementById("total-count").textContent = total;
    document.getElementById("result-modal").classList.add("active");
}

function closeModalWindow() {
    document.getElementById("result-modal").classList.remove("active");
    // Scroll automatically to top to see feedback
    window.scrollTo(0, 0);
}

// ==========================================
// AUTHENTICATION & PROFILE LOGIC (API)
// ==========================================
const API_URL = 'http://localhost:3000/api';

// 1. Update Header based on Auth State
function updateHeader() {
    const headerDiv = document.querySelector('.brand');
    const headerElem = document.querySelector('.app-header');

    // Don't modify auth pages or profile page header structure
    if (window.location.pathname.includes('login') ||
        window.location.pathname.includes('register') ||
        window.location.pathname.includes('profile')) return;

    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');

    // Remove existing auth-nav if it exists
    const existingNav = document.querySelector('.auth-nav');
    if (existingNav) existingNav.remove();

    const nav = document.createElement('nav');
    nav.className = 'auth-nav';

    if (token && userName) {
        if (userRole === 'admin') {
            nav.innerHTML = `
                <a href="admin.html" class="nav-btn">👨‍🏫 Admin Panel</a>
                <button onclick="logout()" class="nav-btn logout">Chiqish</button>
            `;
        } else {
            nav.innerHTML = `
                <a href="profile.html" class="nav-btn">👤 ${userName}</a>
                <button onclick="logout()" class="nav-btn logout">Chiqish</button>
            `;
        }
    } else {
        nav.innerHTML = `
            <a href="login.html" class="nav-btn">Kirish</a>
            <a href="register.html" class="nav-btn primary">Ro'yxatdan o'tish</a>
        `;
    }

    headerElem.appendChild(nav);
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    window.location.href = 'index.html';
}

// Run header update on load
document.addEventListener('DOMContentLoaded', updateHeader);

// ------------------------------------------
// NIGHT MODE LOGIC
// ------------------------------------------
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    // Update theme toggle icon if it exists
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.textContent = isDark ? '☀️' : '🌙';
    }
}

// Run immediately to prevent flash of wrong theme
initTheme();
// Update icon on full load
document.addEventListener('DOMContentLoaded', () => {
    const themeIcon = document.getElementById('theme-icon');
    const isDark = document.body.classList.contains('dark-mode');
    if (themeIcon) {
        themeIcon.textContent = isDark ? '☀️' : '🌙';
    }
});

// 2. Register Form Handler
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const phone = document.getElementById('reg-phone').value;
        const password = document.getElementById('reg-password').value;
        const errorDiv = document.getElementById('reg-error');
        const btn = registerForm.querySelector('button');

        btn.disabled = true;
        btn.textContent = 'Kutilmoqda...';
        errorDiv.textContent = '';

        try {
            const res = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, password })
            });
            const data = await res.json();

            if (res.ok) {
                // Auto login after register
                const loginRes = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phone, password })
                });
                const loginData = await loginRes.json();

                if (loginRes.ok) {
                    localStorage.setItem('token', loginData.token);
                    localStorage.setItem('userName', loginData.name);
                    window.location.href = 'profile.html';
                }
            } else {
                errorDiv.textContent = data.error || 'Xatolik yuz berdi';
                btn.disabled = false;
                btn.textContent = "Ro'yxatdan o'tish";
            }
        } catch (err) {
            errorDiv.textContent = 'Server bilan bog\'lanib bo\'lmadi.';
            btn.disabled = false;
            btn.textContent = "Ro'yxatdan o'tish";
        }
    });
}

// 3. Login Form Handler
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const phone = document.getElementById('login-phone').value;
        const password = document.getElementById('login-password').value;
        const errorDiv = document.getElementById('login-error');
        const btn = loginForm.querySelector('button');

        btn.disabled = true;
        btn.textContent = 'Kutilmoqda...';
        errorDiv.textContent = '';

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, password })
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userName', data.name);
                localStorage.setItem('userRole', data.role || 'user'); // Save Role

                if (data.role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'profile.html';
                }
            } else {
                errorDiv.textContent = data.error || 'Telefon yoki parol noto\'g\'ri';
                btn.disabled = false;
                btn.textContent = "Kirish";
            }
        } catch (err) {
            errorDiv.textContent = 'Server bilan bog\'lanib bo\'lmadi.';
            btn.disabled = false;
            btn.textContent = "Kirish";
        }
    });
}

// 4. Fetch Profile Data
async function fetchProfileData() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const res = await fetch(`${API_URL}/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
            if (res.status === 401 || res.status === 403) logout();
            throw new Error('Failed to fetch profile');
        }

        const data = await res.json();
        const user = data.user;
        const scores = data.scores;

        document.getElementById('profile-name').textContent = user.name;
        document.getElementById('profile-phone').textContent = user.phone;

        const scoresContainer = document.getElementById('scores-container');
        scoresContainer.innerHTML = '';

        if (scores.length === 0) {
            scoresContainer.innerHTML = '<p class="loading-msg">Hali hech qanday test ishlanmagan.</p>';
            return;
        }

        scores.forEach(score => {
            const date = new Date(score.date).toLocaleString('uz-UZ');
            const percent = Math.round((score.correct / score.total) * 100);

            const div = document.createElement('div');
            div.className = 'score-item';
            div.innerHTML = `
                <div class="score-details">
                    <div class="score-section-name">${score.section}</div>
                    <div class="score-date">${date}</div>
                </div>
                <div class="score-result">${score.correct}/${score.total} (${percent}%)</div>
            `;
            scoresContainer.appendChild(div);
        });

    } catch (err) {
        console.error("Error fetching profile:", err);
        document.getElementById('profile-name').textContent = "Xatolik";
        document.getElementById('profile-phone').textContent = "Ma'lumotlarni yuklab bo'lmadi";
    }
}

// Handle Logout button inside Profile
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}
