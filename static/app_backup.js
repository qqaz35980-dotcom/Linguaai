const micBtn = document.getElementById("micBtn");
const speakBtn = document.getElementById("speakBtn");
const swapBtn = document.getElementById("swapBtn");
const conversationBtn = document.getElementById("conversationBtn");

const sourceText = document.getElementById("sourceText");
const translatedText = document.getElementById("translatedText");

const fromLang = document.getElementById("fromLang");
const toLang = document.getElementById("toLang");

const status = document.getElementById("status");


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


status.innerHTML =
"🎤 Menyiapkan mikrofon...";


setTimeout(function(){

startListening();

},1000);



}else{


conversationBtn.innerHTML =
"🗣️ Mode Percakapan";


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

},3000);



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



if(conversationMode){


speakText(
data.translated
);


}



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



isSpeaking = true;



suara.onend=function(){


isSpeaking = false;


status.innerHTML =
"⏳ Menunggu percakapan berikutnya...";



if(conversationMode){


setTimeout(function(){

startListening();

},2000);



}



};



window.speechSynthesis.speak(suara);



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
