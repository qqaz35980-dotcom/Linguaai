from flask import Flask, render_template, request, jsonify, send_from_directory
import requests

app = Flask(__name__)

GOOGLE_URL = "https://translate.googleapis.com/translate_a/single"


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/sw.js")
def service_worker():
	return send_from_directory("static", "sw.js")


@app.route("/health")
def health():
    return jsonify({
        "status": "ok",
        "app": "LinguaAI",
        "version": "1.6"
    })


@app.route("/translate", methods=["POST"])
def translate():

    try:
        data = request.get_json()

        text = data.get("text", "")
        source = data.get("source", "auto")
        target = data.get("target", "en")

        if not text.strip():
            return jsonify({
                "translated": ""
            })


        params = {
            "client": "gtx",
            "sl": source,
            "tl": target,
            "dt": "t",
            "q": text
        }


        response = requests.get(
            GOOGLE_URL,
            params=params,
            timeout=15
        )


        result = response.json()


        translated = ""

        for item in result[0]:
            translated += item[0]


        return jsonify({
            "translated": translated
        })


    except Exception as e:

        return jsonify({
            "translated": "Error: " + str(e)
        })


if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=8080,
        debug=False
    )
