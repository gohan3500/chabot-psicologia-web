from flask import Blueprint, request, jsonify  # type: ignore
from chatbot.langchain import handle_conversation

chat_bp = Blueprint("chat", __name__)


@chat_bp.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        input_message = data.get("message", "")
        role = data.get("role", "Profesor de psicología")
        if not input_message:
            return jsonify({"response": "No se recibió ningún mensaje."}), 400
        output = handle_conversation(input_message, role)
        return jsonify({"response": output})
    except Exception as e:
        return jsonify({"response": f"Error: {str(e)}"}), 500
