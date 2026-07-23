const micBtn = document.getElementById("micBtn");
const speakBtn = document.getElementById("speakBtn");
const copyBtn = document.getElementById("copyBtn");
const swapBtn = document.getElementById("swapBtn");

const fromLang = document.getElementById("fromLang");
const toLang = document.getElementById("toLang");

const sourceText = document.getElementById("sourceText");
const translatedText = document.getElementById("translatedText");
const status = document.getElementById("status");

function getSpeechLang(lang) {
    switch (lang) {
        case "id":
            return "id-ID";
        case "en":
            return "en-US";
        case "zh":
            return "zh-CN";
        default:
            return "id-ID";
    }
}

function translateText(text) {

    const lower = text.toLowerCase().trim();

    if (fromLang.value === "id" && toLang.value === "en") {

        const dict = {
            "halo": "hello",
            "selamat pagi": "good morning",
            "selamat siang": "good afternoon",
            "selamat malam": "good evening",
            "apa kabar": "how are you",
            "terima kasih": "thank you",
            "nama saya": "my name is",
            "sampai jumpa": "see you"
        };

        return dict[lower] || "(Belum ada terjemahan)";
    }

    if (fromLang.value === "en" && toLang.value === "id") {

        const dict = {
            "hello": "halo",
            "good morning": "selamat pagi",
            "good afternoon": "selamat siang",
            "good evening": "selamat malam",
            "how are you": "apa kabar",
            "thank you": "terima kasih",
            "my name is": "nama saya",
            "see you": "sampai jumpa"
        };

        return dict[lower] || "(Belum ada terjemahan)";
    }

    return "(Terjemahan belum tersedia)";
}

micBtn.addEventListener("click", () => {

    if (!("webkitSpeechRecognition" in window)) {
        status.innerHTML = "Browser tidak mendukung Speech Recognition.";
        return;
    }

    const recognition = new webkitSpeechRecognition();

    recognition.lang = getSpeechLang(fromLang.value);
    recognition.continuous = false;
    recognition.interimResults = false;

    status.innerHTML = "🎤 Mendengarkan...";

    recognition.start();

    recognition.onresult = function (event) {

        const text = event.results[0][0].transcript;

        sourceText.value = text;

        translatedText.value = translateText(text);

        status.innerHTML = "✅ Terjemahan selesai";

    };

    recognition.onerror = function (event) {

        status.innerHTML = "❌ Error: " + event.error;

    };

});

speakBtn.addEventListener("click", () => {

    const text = translatedText.value;

    if (text === "") {
        alert("Belum ada hasil.");
        return;
    }

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = getSpeechLang(toLang.value);

    window.speechSynthesis.speak(speech);

});

copyBtn.addEventListener("click", () => {

    navigator.clipboard.writeText(translatedText.value);

    status.innerHTML = "📋 Hasil disalin.";

});

swapBtn.addEventListener("click", () => {

    const temp = fromLang.value;

    fromLang.value = toLang.value;

    toLang.value = temp;

    status.innerHTML = "🔄 Bahasa ditukar.";

});

if ("serviceWorker" in navigator) {

    navigator.serviceWorker.register("sw.js");

}
