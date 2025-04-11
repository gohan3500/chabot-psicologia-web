from flask import Blueprint, request, jsonify # type: ignore
from chatbot.ask_gemini import ask_gemini

chat_bp = Blueprint("chat", __name__)

@chat_bp.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")
    role = data.get("role", "maestra de primaria")
    log = data.get("log", "")

    if not user_message:
        return jsonify({"response": "No se recibió ningún mensaje."}), 400

    bot_response = ask_gemini(user_message, role, log)
    return jsonify({"response": bot_response})
