// =========================
// HISTORY.JS
// =========================

const historyBox = document.getElementById("history");

function addHistory(source, translated) {

    if (!historyBox) return;

    const now = new Date();

    const jam =
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0");

    const item = document.createElement("div");

    item.className = "history-item";

    item.innerHTML = `
        <hr>
        <b>🕒 ${jam}</b><br><br>

        <b>🗣️ Anda</b><br>
        ${source}<br><br>

        <b>🌐 LinguaAI</b><br>
        ${translated}<br>
    `;

    historyBox.prepend(item);

}
