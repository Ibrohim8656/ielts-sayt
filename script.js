// ==========================================
// TO'G'RI JAVOBLAR VA YECHIMLAR QOIDASI
// ==========================================
let ANSWERS_DATA = {
    // Eshitish va O'qish testlariga oid barcha javoblar sahifa yuklanganda dinamik tarzda qo'shiladi
};

// ==========================================
// DYNAMIC READING TIZIMI
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    // Agar biz reading sahifasida bo'lsak
    if (window.location.pathname.includes('reading.html') || window.location.pathname.includes('reading_test.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        let testId = urlParams.get('id');

        if (!testId) {
            document.querySelector('.passage-content').innerHTML = "<p>Test ID berilmadi.</p>";
            return;
        }

        try {
            const res = await fetch(`/api/reading-tests/${testId}`);
            if (res.ok) {
                const testContent = await res.json();

                // Store test title globally for score saving later
                window.currentReadingTestTitle = testContent.title;

                const passageContainer = document.querySelector('.passage-content');
                const rightPane = document.querySelector('.right-pane');

                if (passageContainer && rightPane && testContent) {
                    passageContainer.innerHTML = testContent.passage;
                    rightPane.innerHTML = testContent.questions;
                    Object.assign(ANSWERS_DATA, typeof testContent.answers === 'string' ? JSON.parse(testContent.answers) : testContent.answers);
                }
            } else {
                document.querySelector('.passage-content').innerHTML = "<p>Test topilmadi.</p>";
            }
        } catch (e) {
            console.error("Fetch DB xatosi:", e);
            document.querySelector('.passage-content').innerHTML = "<p>Server ishlamayapti.</p>";
        }
    }
});

// ==========================================
// DYNAMIC LISTENING TIZIMI
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    // Agar biz listening sahifasida bo'lsak
    if (window.location.pathname.includes('listening.html') || window.location.pathname.includes('listening_test.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        let testId = urlParams.get('id');

        if (!testId) {
            document.querySelector('.passage-content').innerHTML = "<p>Test ID berilmadi.</p>";
            return;
        }

        try {
            const res = await fetch(`/api/listening-tests/${testId}`);
            if (res.ok) {
                const testContent = await res.json();

                // Store test title globally for score
                window.currentListeningTestTitle = testContent.title;

                const passageContainer = document.querySelector('.passage-content');
                const rightPane = document.querySelector('.right-pane');

                if (passageContainer && rightPane && testContent) {
                    // HTML ni joylashtirish
                    passageContainer.innerHTML = `
                        <div class="audio-container" style="margin-bottom: 20px; text-align: center; background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                            <audio controls style="width: 100%;" id="listening-audio">
                                <source src="/audio/${encodeURIComponent(testContent.title)}.mp3" type="audio/mpeg">
                                Sizning brauzeringiz audio elementini qo'llab-quvvatlamaydi.
                            </audio>
                        </div>
                    `;
                    rightPane.innerHTML = testContent.questions;

                    // Javoblarni o'zlashtirish
                    Object.assign(ANSWERS_DATA, typeof testContent.answers === 'string' ? JSON.parse(testContent.answers) : testContent.answers);
                }
            } else {
                document.querySelector('.passage-content').innerHTML = "<p>Test topilmadi.</p>";
            }
        } catch (e) {
            console.error("Fetch DB xatosi:", e);
            document.querySelector('.passage-content').innerHTML = "<p>Server ishlamayapti.</p>";
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

function finishTest(isReviewMode = false) {
    if (testFinished) return;
    testFinished = true;

    if (timerInterval) clearInterval(timerInterval);

    const submitBtn = document.getElementById("submit-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = isReviewMode ? "Test Yechimlari Tahlili" : "Finished & Checked";

    let correctCount = 0;
    const userAnswersMap = {};
    const testEndTime = new Date().toISOString();

    // LUKUP OVER ALL ANSWERS TO CALCULATE SCORES AND RENDER FEEDBACK
    const allQuestions = Object.keys(ANSWERS_DATA);
    let questionsOnPage = allQuestions.length;

    // First, map each question-block to hold the feedback at the bottom of it.
    // We Group feedbacks by their closest question-block so we don't spam the UI in weird places.
    const blockFeedbacks = new Map();

    allQuestions.forEach(qId => {
        const expectedAnswer = ANSWERS_DATA[qId].answer.toLowerCase().trim();
        const explanation = ANSWERS_DATA[qId].explanation;
        let isCorrect = false;
        let userAnswer = "[Bo'sh / Kiritilmagan]";

        // Find the input element(s) for this question
        const inputElem = document.getElementById(qId) || document.querySelector(`input[name="${qId}"]`);

        if (!inputElem) {
            questionsOnPage--;
            return;
        }

        // We wrap feedbacks relative to the closest div or form if question-block doesn't exist
        const block = inputElem.closest('.question-block') || inputElem.parentElement;
        if (!blockFeedbacks.has(block)) {
            blockFeedbacks.set(block, []);
        }

        if (inputElem.tagName === "SELECT") {
            inputElem.disabled = true;
            if (inputElem.value.trim() !== "") userAnswer = inputElem.value;

            if (userAnswer.toLowerCase().trim() === expectedAnswer) {
                isCorrect = true;
                inputElem.classList.add('checked-correct');
                inputElem.style.borderColor = "var(--success-color)";
            } else {
                inputElem.classList.add('checked-wrong');
                inputElem.style.borderColor = "var(--error-color)";
            }
        }
        else if (inputElem.type === "radio") {
            const radios = document.querySelectorAll(`input[name="${qId}"]`);
            let answered = false;

            radios.forEach(r => {
                r.disabled = true;
                const parent = r.closest('.option') || r.parentElement;

                if (r.checked) {
                    answered = true;
                    userAnswer = r.value;
                    if (r.value.toLowerCase().trim() === expectedAnswer) {
                        isCorrect = true;
                        if (parent) parent.classList.add('checked-correct');
                    } else {
                        if (parent) parent.classList.add('checked-wrong');
                    }
                }

                // Show the correct answer visually if they were wrong
                if (!isCorrect && r.value.toLowerCase().trim() === expectedAnswer) {
                    if (parent) {
                        parent.style.border = "2px dashed var(--success-color)";
                        parent.style.background = "#f0fdf4"; // equivalent to success-bg
                    }
                }
            });

        }
        // Bo'shliqlarni to'ldirish (text, checkbox etc)
        else {
            inputElem.disabled = true;
            if (inputElem.value && inputElem.value.trim() !== "") userAnswer = inputElem.value;

            if (userAnswer.toLowerCase().trim() === expectedAnswer) {
                isCorrect = true;
                inputElem.classList.add('checked-correct');
                inputElem.style.borderColor = "var(--success-color)";
            } else {
                inputElem.classList.add('checked-wrong');
                inputElem.style.borderColor = "var(--error-color)";
            }
        }

        userAnswersMap[qId] = userAnswer;
        if (isCorrect) correctCount++;

        // Feedback html yozuvini shakllantirish
        let feedbackHTML = "";
        if (isCorrect) {
            feedbackHTML = `
                <div class="feedback-box correct" style="margin-top: 10px;">
                    <div class="feedback-title">✓ Correct (${qId})</div>
                    <div>Your answer: <strong>${userAnswer}</strong></div>
                    <div class="feedback-solution">Solution: ${explanation}</div>
                </div>
            `;
        } else {
            feedbackHTML = `
                <div class="feedback-box wrong" style="margin-top: 10px;">
                    <div class="feedback-title">✗ Incorrect (${qId})</div>
                    <div>Your answer: <strong>${userAnswer}</strong></div>
                    <div>Correct answer: <strong>${ANSWERS_DATA[qId].answer}</strong></div>
                    <div class="feedback-solution">Solution: ${explanation}</div>
                </div>
            `;
        }
        blockFeedbacks.get(block).push(feedbackHTML);
    });

    // Append all grouped feedbacks to their respective blocks
    blockFeedbacks.forEach((feedbacks, block) => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = feedbacks.join('');
        block.appendChild(wrapper);
    });

    if (!isReviewMode) {
        showResultModal(correctCount, questionsOnPage);
    } else {
        // Tahlil rejimida modalni ko'rsatmasdan shunchaki tahlilni ochiq qoldiramiz
        document.getElementById("timer-display").style.display = "none";
    }

    // Save score to backend if user is logged in AND it is not review mode
    const token = localStorage.getItem('token');
    if (token && !isReviewMode) {
        // Find which section this is by looking at the page title or filename
        let section = "Practice Test";
        const urlParams = new URLSearchParams(window.location.search);
        let testId = urlParams.get('id');

        if (window.location.pathname.includes('listening')) {
            const title = window.currentListeningTestTitle || "Test";
            section = `Listening: ${title}`;
        }
        else if (window.location.pathname.includes('reading')) {
            const title = window.currentReadingTestTitle || "Test";
            section = `Reading: ${title}`;
        }

        fetch('/api/score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                section: section,
                correct: correctCount,
                total: questionsOnPage,
                start_time: window.testStartTime || new Date().toISOString(),
                end_time: testEndTime,
                user_answers: userAnswersMap
            })
        }).catch(err => console.error("Error saving score:", err));
    }
}

// Global start time tracking
window.testStartTime = new Date().toISOString();

// Check for review mode on load
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('review') === 'true') {
        const token = localStorage.getItem('token');

        // Biraz vaqt berib, HTML to'liq chizilgach finishTest() ni ishga tushiring
        setTimeout(async () => {
            if (token) {
                try {
                    let sectionName = window.location.pathname.includes('listening')
                        ? `Listening: ${window.currentListeningTestTitle || "Test"}`
                        : `Reading: ${window.currentReadingTestTitle || "Test"}`;

                    const res = await fetch(`/api/score/detail?section=${encodeURIComponent(sectionName)}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    if (res.ok) {
                        const savedData = await res.json();
                        if (savedData && savedData.user_answers) {
                            const answersMap = typeof savedData.user_answers === 'string' ? JSON.parse(savedData.user_answers) : savedData.user_answers;

                            // Kiritilgan javoblarni joyiga qo'yib chiqamiz
                            Object.keys(answersMap).forEach(qId => {
                                const inputElem = document.getElementById(qId) || document.querySelector(`input[name="${qId}"]`);
                                if (inputElem) {
                                    if (inputElem.type === "radio") {
                                        const radios = document.querySelectorAll(`input[name="${qId}"]`);
                                        radios.forEach(r => { if (r.value === answersMap[qId]) r.checked = true; });
                                    } else {
                                        inputElem.value = answersMap[qId];
                                    }
                                }
                            });

                            // Vaqtlarni ko'rsatish
                            if (savedData.start_time && savedData.end_time) {
                                const st = new Date(savedData.start_time).toLocaleString('uz-UZ');
                                const et = new Date(savedData.end_time).toLocaleString('uz-UZ');
                                const infoDiv = document.createElement('div');
                                infoDiv.style.padding = "10px";
                                infoDiv.style.background = "#e0f2fe";
                                infoDiv.style.marginBottom = "15px";
                                infoDiv.style.borderRadius = "8px";
                                infoDiv.innerHTML = `<strong>Sizning natijangiz:</strong> Boshlandi: ${st} | Tugatildi: ${et}`;
                                const pane = document.querySelector('.right-pane') || document.body;
                                pane.prepend(infoDiv);

                                const tDisp = document.getElementById("timer-display");
                                if (tDisp) tDisp.innerHTML = "Past Score Review";
                            }
                        }
                    }
                } catch (e) { console.error("Could not fetch old answers", e); }
            }

            finishTest(true);
        }, 800);
    }
});

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
const API_URL = '/api';

// 1. Update Header based on Auth State
function updateHeader() {
    const headerDiv = document.querySelector('.brand');
    const headerElem = document.querySelector('.app-header');

    // Avoid redirect loops on auth pages
    if (window.location.pathname.includes('login.html') ||
        window.location.pathname.includes('register.html') ||
        window.location.pathname.includes('reset.html')) {
        return;
    }

    const token = localStorage.getItem('token');

    // Auth Guard: Redirect to login if no token is found
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

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

// 3.5 Reset Form Handler
const resetForm = document.getElementById('reset-form');
if (resetForm) {
    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const phone = document.getElementById('reset-phone').value;
        const newPassword = document.getElementById('reset-password').value;
        const errorDiv = document.getElementById('reset-error');
        const successDiv = document.getElementById('reset-success');
        const btn = resetForm.querySelector('button');

        btn.disabled = true;
        btn.textContent = 'Kutilmoqda...';
        errorDiv.textContent = '';
        successDiv.textContent = '';

        try {
            const res = await fetch(`${API_URL}/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, newPassword })
            });
            const data = await res.json();

            if (res.ok) {
                successDiv.textContent = data.message;
                // Bo'shatish
                document.getElementById('reset-phone').value = '';
                document.getElementById('reset-password').value = '';

                // 2 soniyadan keyin login sahifaga qaytaramiz
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                errorDiv.textContent = data.error || 'Xatolik yuz berdi';
                btn.disabled = false;
                btn.textContent = "Parolni o'zgartirish";
            }
        } catch (err) {
            errorDiv.textContent = 'Server bilan bog\'lanib bo\'lmadi.';
            btn.disabled = false;
            btn.textContent = "Parolni o'zgartirish";
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

        window.userScores = scores; // Expose globally for Chart.js in profile.html

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
            let scoreResultText = "";

            if (score.correct < 0) {
                // Pending status for Writing/Speaking
                scoreResultText = `<span style="color: #fbbf24; font-weight: 500;">⏳ Tekshirilmoqda...</span>`;
            } else {
                const percent = Math.round((score.correct / score.total) * 100);
                scoreResultText = `${score.correct}/${score.total} (${percent}%)`;
            }

            const div = document.createElement('div');
            div.className = 'score-item';
            div.innerHTML = `
                <div class="score-details">
                    <div class="score-section-name">${score.section}</div>
                    <div class="score-date">${date}</div>
                </div>
                <div class="score-result">${scoreResultText}</div>
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

// ==========================================
// TEXT HIGHLIGHTING LOGIC
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Inject tooltip UI into body
    const tooltip = document.createElement('div');
    tooltip.className = 'hl-tooltip';
    tooltip.innerHTML = `
        <button class="hl-btn-yellow" data-color="#eab308" title="Sariq"></button>
        <button class="hl-btn-green" data-color="#22c55e" title="Yashil"></button>
        <button class="hl-btn-red" data-color="#ef4444" title="Qizil"></button>
        <button class="hl-btn-clear" data-color="clear" title="Tozalash">✖</button>
    `;
    document.body.appendChild(tooltip);

    // Show Tooltip on Mouse Up
    document.addEventListener('mouseup', (e) => {
        // Only allow highlighting inside passage-content
        const passage = e.target.closest('.passage-content');

        if (!passage) {
            // Hide tooltip if clicking outside
            if (!e.target.closest('.hl-tooltip')) {
                tooltip.style.display = 'none';
            }
            return;
        }

        setTimeout(() => {
            const selection = window.getSelection();
            const text = selection.toString().trim();

            if (text.length > 0 && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();

                // Position above the selection
                tooltip.style.top = `${rect.top + window.scrollY - 45}px`;
                tooltip.style.left = `${rect.left + window.scrollX + (rect.width / 2) - 60}px`;
                tooltip.style.display = 'flex';
            } else {
                tooltip.style.display = 'none';
            }
        }, 10);
    });

    // Apply color when button is clicked
    tooltip.addEventListener('click', (e) => {
        e.preventDefault();
        const btn = e.target.closest('button');
        if (!btn) return;

        const color = btn.getAttribute('data-color');
        const passage = document.querySelector('.passage-content');

        if (passage) {
            // Enable editing to allow execCommand without breaking HTML structure
            passage.contentEditable = "true";

            if (color === 'clear') {
                // Remove formatting (text color)
                document.execCommand('removeFormat', false, null);
            } else {
                // Apply text color directly
                document.execCommand('styleWithCSS', false, true);
                document.execCommand('foreColor', false, color);
            }

            // Disable editing right after
            passage.contentEditable = "false";
        }

        tooltip.style.display = 'none';
        window.getSelection().removeAllRanges();
    });
});
