const micBtn = document.getElementById("micBtn");
const speakBtn = document.getElementById("speakBtn");
const translateBtn = document.getElementById("translateBtn");
const swapBtn = document.getElementById("swapBtn");
const conversationBtn = document.getElementById("conversationBtn");

const sourceText = document.getElementById("sourceText");
const translatedText = document.getElementById("translatedText");

const fromLang = document.getElementById("fromLang");
const toLang = document.getElementById("toLang");

const status = document.getElementById("status");

const installBtn = document.getElementById("installBtn");

let deferredPrompt = null;


let conversationMode = false;
let recognition = null;
let isSpeaking = false;


// =========================
// MODE PERCAKAPAN
// =========================

if(conversationBtn){

conversationBtn.onclick = function(){

conversationMode = !conversationMode;


if(conversationMode){

conversationBtn.innerHTML =
"🛑 Matikan Percakapan";

conversationBtn.classList.add(
"conversation-active"
);


status.innerHTML =
"🎤 Menyiapkan mikrofon...";


setTimeout(function(){

startListening();

},1000);



}else{


conversationBtn.innerHTML =
"🗣️ Mode Percakapan";

conversationBtn.classList.remove(
"conversation-active"
);


status.innerHTML =
"Siap digunakan";


}


};


}




// =========================
// SPEECH RECOGNITION
// =========================

if("webkitSpeechRecognition" in window){


recognition =
new webkitSpeechRecognition();


recognition.continuous = false;

recognition.interimResults = false;



recognition.onstart = function(){

status.innerHTML =
"🎤 Mendengarkan...";

};



recognition.onresult = function(event){


let hasil =
event.results[0][0].transcript;


sourceText.value = hasil;


translateText(hasil);


};




recognition.onerror = function(event){


console.log(event.error);


status.innerHTML =
"Mikrofon berhenti";


if(conversationMode){

setTimeout(function(){

startListening();

},3000);

}


};





recognition.onend = function(){


if(conversationMode && !isSpeaking){


status.innerHTML =
"⏳ Menunggu percakapan berikutnya...";


setTimeout(function(){

startListening();

},1000);



}


};



}





// =========================
// MULAI MENDENGAR
// =========================

function startListening(){


if(!recognition){

status.innerHTML =
"Browser tidak mendukung suara";

return;

}



try{


if(fromLang.value=="id"){

recognition.lang =
"id-ID";


}else if(fromLang.value=="zh"){


recognition.lang =
"zh-CN";


}else{


recognition.lang =
"en-US";


}



recognition.start();



}catch(error){


console.log(error);


}


}





// =========================
// TOMBOL MULAI BICARA
// =========================

micBtn.onclick=function(){

startListening();

};





// =========================
// TRANSLATE
// =========================

async function translateText(text){


try{


status.innerHTML =
"🧠 Menerjemahkan...";



let response =
await fetch("/translate",{


method:"POST",


headers:{

"Content-Type":"application/json"

},


body:JSON.stringify({

text:text,

source:fromLang.value,

target:toLang.value

})


});



let data =
await response.json();



translatedText.value =
data.translated;


// Simpan ke riwayat
if(typeof addHistory === "function"){

	addHistory(text, data.translated);

}


speakText(
	data.translated
);



}catch(error){


translatedText.value =
"Gagal menerjemahkan";


}


}





// =========================
// TEXT TO SPEECH
// =========================

function speakText(text){

if(!text)return;


status.innerHTML =
"🔊 Berbicara...";


let suara =
new SpeechSynthesisUtterance(text);



if(toLang.value=="id"){

suara.lang =
"id-ID";


}else if(toLang.value=="zh"){

suara.lang =
"zh-CN";


}else{

suara.lang =
"en-US";

}


suara.rate = 1;
suara.pitch = 1;


isSpeaking = true;



suara.onend=function(){

isSpeaking = false;


status.innerHTML =
"⏳ Menunggu percakapan berikutnya...";


if(conversationMode){


let temp =
fromLang.value;


fromLang.value =
toLang.value;


toLang.value =
temp;


setTimeout(function(){

startListening();

},1000);


}

};



suara.onerror=function(){

isSpeaking = false;

status.innerHTML =
"⚠️ Suara gagal";

};



function jalankanSuara(){

let voices =
window.speechSynthesis.getVoices();


let voice =
voices.find(function(v){

return v.lang === suara.lang;

});


if(voice){

suara.voice = voice;

}


window.speechSynthesis.speak(suara);

}



if(window.speechSynthesis.getVoices().length === 0){

window.speechSynthesis.onvoiceschanged =
jalankanSuara;


}else{

jalankanSuara();

}


}




// =========================
// TUKAR BAHASA
// =========================

swapBtn.onclick=function(){


let temp =
fromLang.value;


fromLang.value =
toLang.value;


toLang.value =
temp;


};

// =========================
// TOMBOL TERJEMAHKAN MANUAL
// =========================

if(translateBtn){

translateBtn.onclick = function(){

let text = sourceText.value;

if(text.trim() !== ""){

translateText(text);

}

};

}

// =========================
// INSTALL PWA
// =========================

window.addEventListener("beforeinstallprompt", (e) => {

    e.preventDefault();

    deferredPrompt = e;

    installBtn.style.display = "block";

});

installBtn.onclick = async function(){

    if(!deferredPrompt) return;

    deferredPrompt.prompt();

    await deferredPrompt.userChoice;

    deferredPrompt = null;

    installBtn.style.display = "none";

};

// =========================
// REGISTER SERVICE WORKER
// =========================

if ("serviceWorker" in navigator) {

    window.addEventListener("load", function(){

        navigator.serviceWorker.register("/sw.js")
        .then(function(){

            console.log("Service Worker berhasil didaftarkan");

        })
        .catch(function(error){

            console.log(error);

        });

    });

}
