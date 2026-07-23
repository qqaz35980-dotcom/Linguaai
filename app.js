let translatedText = "";

function startListening() {
    const result = document.getElementById("result");

    if (!("webkitSpeechRecognition" in window)) {
        result.innerHTML =
            "Browser ini tidak mendukung Speech Recognition.";
        return;
    }

    const recognition = new webkitSpeechRecognition();

    recognition.lang = document.getElementById("fromLang").value;
    recognition.continuous = false;
    recognition.interimResults = false;

    result.innerHTML = "🎤 Mendengarkan...";

    recognition.start();

    recognition.onresult = function (event) {
        const text = event.results[0][0].transcript;

        translatedText = text;

        result.innerHTML =
            "<b>Teks Asli:</b><br>" +
            text +
            "<br><br><b>Hasil:</b><br>" +
            translatedText;
    };

    recognition.onerror = function (event) {
        result.innerHTML = "Error: " + event.error;
    };
}

function speakResult() {

    if (translatedText === "") {
        alert("Belum ada hasil.");
        return;
    }

    const speech = new SpeechSynthesisUtterance(translatedText);

    speech.lang = document.getElementById("toLang").value;

    window.speechSynthesis.speak(speech);
}
