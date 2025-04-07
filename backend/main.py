from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot.ask_gemini import ask_gemini

app = Flask(__name__)
CORS(app)


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"response": "No se recibió ningún mensaje."}), 400

    bot_response = ask_gemini(user_message)
    return jsonify({"response": bot_response})


if __name__ == "__main__":
    app.run(debug=True)
