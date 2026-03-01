# Saytga yangi test materiallarini qo'shish bo'yicha qo'llanma

Saytingiz endi to'liq platformaga aylandi. U 4 xil qismdan (Listening, Reading, Writing, Speaking) tashkil topgan hamda "Home" (Bosh Sahifa) sahifasi bilan barpo qilingan.

Har bir bo'limni o'zgartirish uchun endi o'ziga tegishli nomdagi faylni tahrirlashingiz kerak bo'ladi.

---

## 1. Fayllar Tuzilishi
- **`index.html`** - Saytning Bosh sahifasi (Home). Saytga kirgan odam birinchi shuni ko'radi.
- **`reading.html`** - Reading testi joylashgan fayl. Matn va savollarni shu yerdan o'zgartirasiz.
- **`listening.html`** - Listening testi joylashgan fayl. Audio va xuddi Reading'dagi kabi savollarni o'z ichiga oladi.
- **`speaking.html`** - Gapirishga doir qismlar.
- **`writing.html`** - Yozma vazifalar sahifasi (unda maxsus so'zlarni sanaydigan funksiya bor).
- **`script.js`** - Barcha **To'g'ri Javoblar** va Natijalarni hisoblash / Yechimlarni ko'rsatish (Feedback) mantig'i shu fayl ichida yozilgan.

---

## 2. Savollar va ularga mos "To'g'ri Javob / Yechim" larni kiritish

Ilgari sayt faqat "To'g'ri yoki Xato" deb chiqarardi. Hozirgi yangi tuzilish bo'yicha, noto'g'ri yoki to'g'ri javobni tanlaganingizdan so'ng, uning ostida yashil rangda to'liq "**Yechim (Solution)**" chiqib keladi.

Siz savollarni `reading.html` yoki `listening.html` ichida o'zgartirganingizdan SO'NG, ularning qaysi qismi nega to'g'ri ekanligini quyidagicha kiritishingiz kerak bo'ladi.

**Buning uchun `script.js` faylini** oching. Eng yuqori qismida shunday obyektni ko'rasiz:

```javascript
const ANSWERS_DATA = {
    // READING savollari
    "q1": { answer: "B", explanation: "Paragraph 2 states: 'Criminal laws deal with actions that threaten people...'" },
    "q2": { answer: "B", explanation: "Paragraph 2 states: 'By punishing criminals...'" },

    // LISTENING savollari
    "q1_listen": { answer: "10 am", explanation: "The speaker said the event starts promptly at 10 am." }
};
```

1. **`"q1"`** — Siz HTML faylda qaysi nomli (`id="q1"` yoki `name="q1"`) savolni yozganingizni bildiradi.
2. **`answer: "B"`** — Nima yozilsa, shuni "To'g'ri" javob deb qabul qiladi. Multiple choice bo'lsa harf yoki so'z, bo'sh joy bo'lsa (masalan "10 am") kiritiladi.
3. **`explanation: "..."`** — Test tugaganda tagidan chiqib turadigan yechim. Bunga xohlang O'zbekcha "2-abzasda ushbu gap yozilgan" deb ham izoh berishingiz mumkin!

---

## 3. Listening Audionisini Qo'shish
Listening testi audio faylsiz bo'lmaydi. Saytda tayyor Audio Pleyer kodi bor. O'z audiongizni qo'shish uchun:
1. Tayyor MP3 audio faylingizni `Desktop\site for ielts` papkani o'ziga tashlang (masalan nomi `mening_audiom.mp3` bo'lsin).
2. **`listening.html`** faylini ochib quyidagi qismni qidiring:
```html
<audio controls style="width: 100%; margin-top: 20px;">
    <source src="l_audio.mp3" type="audio/mpeg">
</audio>
```
3. `src="l_audio.mp3"` degan joyni o'zingizning faylingiz nomi bilan almashtirib qo'ying: `<source src="mening_audiom.mp3" type="audio/mpeg">`

---

## 4. Writing Va Speakingni yangilash
- **`writing.html`** da `<h2>Writing Task 2</h2>` degan joy atrofidagi matnlarni o'zingiz berayotgan "Essay topic"ga o'zgartirib qo'yishingiz mumkin.
- O'sha sahifani o'ng tarafida avtomatik "so'zlarni sanaydigan (Word count)" va ekran yuqorisida 60 daqiqalik taymer ishlaydi.
- **`speaking.html`** da esa tayyor namuna sifatida 3 xil (Part 1, Part 2, Part 3) savollar kiritilgan, ularni shunchaki Notepad orqali tahrirlab yangilab qoyishingiz mumkin.

*Dastur murakkab va professional "Platforma" ko'rinishiga kelgan. Uni kundan kunga boyitib, o'z materiallaringizni erkin qo'shib borishingiz mumkin!*
