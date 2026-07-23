const micBtn = document.getElementById("micBtn");
const speakBtn = document.getElementById("speakBtn");
const copyBtn = document.getElementById("copyBtn");
const swapBtn = document.getElementById("swapBtn");

const fromLang = document.getElementById("fromLang");
const toLang = document.getElementById("toLang");

const sourceText = document.getElementById("sourceText");
const translatedText = document.getElementById("translatedText");
const status = document.getElementById("status");


function getSpeechLang(lang){

    if(lang==="id"){
        return "id-ID";
    }

    if(lang==="en"){
        return "en-US";
    }

    if(lang==="zh"){
        return "zh-CN";
    }

}


micBtn.onclick = function(){

    if(!("webkitSpeechRecognition" in window)){

        status.innerHTML =
        "Browser tidak mendukung mikrofon";

        return;
    }


    const recognition =
    new webkitSpeechRecognition();


    recognition.lang =
    getSpeechLang(fromLang.value);


    recognition.continuous = false;

    recognition.interimResults = false;


    status.innerHTML =
    "🎤 Mendengarkan...";


    recognition.start();


    recognition.onresult =
    function(event){

        let text =
        event.results[0][0].transcript;


        sourceText.value = text;


        translatedText.value =
        "Menunggu penerjemahan...";


        status.innerHTML =
        "Suara berhasil diterima";

    };


    recognition.onerror =
    function(){

        status.innerHTML =
        "Mikrofon gagal digunakan";

    };

};



speakBtn.onclick=function(){

    let text =
    translatedText.value ||
    sourceText.value;


    if(text===""){
        return;
    }


    let speech =
    new SpeechSynthesisUtterance(text);


    speech.lang =
    getSpeechLang(toLang.value);


    window.speechSynthesis.speak(speech);

};



copyBtn.onclick=function(){

    navigator.clipboard.writeText(
        translatedText.value
    );

    status.innerHTML =
    "Teks disalin";

};



swapBtn.onclick=function(){

    let temp =
    fromLang.value;


    fromLang.value =
    toLang.value;


    toLang.value =
    temp;

    status.innerHTML =
    "Bahasa ditukar";

};



if("serviceWorker" in navigator){

    navigator.serviceWorker.register("sw.js");

}
