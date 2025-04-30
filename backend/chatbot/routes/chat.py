from flask import Blueprint, request, jsonify, session
from chatbot.db import mysql
from chatbot.langchain import handle_conversation
from uuid import uuid4
from datetime import datetime
import traceback

chat_bp = Blueprint("chat", __name__)


@chat_bp.route("/chats", methods=["POST"])
def create_chat():
    """Create new chat with selected role and first message"""
    try:
        data = request.get_json()
        message = data.get("message")
        user_id = int(data.get("user_id"))
        role_id = int(data.get("role_id"))

        cursor = mysql.connection.cursor()
        cursor.execute(
            "SELECT nombre_rol, descripcion FROM roles WHERE id = %s", (role_id,)
        )
        row = cursor.fetchone()

        if not message or not row:
            return jsonify({"error": "Missing message or role"}), 400

        role_name = row["nombre_rol"]
        descripcion = row["descripcion"]
        role_context = f"{role_name}, {descripcion}"
        chat_id = str(uuid4())
        now = datetime.now()

        cursor.execute(
            "INSERT INTO chats (id, user_id, role_id, title, created_at, updated_at) VALUES (%s, %s, %s, %s, %s, %s)",
            (chat_id, user_id, role_id, f"Entrevista con {role_name}", now, now),
        )

        # Get bot's response
        bot_response = handle_conversation(message, role_context, session_id=chat_id)

        # Insert first user message
        cursor.execute(
            "INSERT INTO messages (chat_id, sender, content, timestamp) VALUES (%s, %s, %s, %s)",
            (chat_id, "user", message, now),
        )

        # Insert bot response
        cursor.execute(
            "INSERT INTO messages (chat_id, sender, content, timestamp) VALUES (%s, %s, %s, %s)",
            (chat_id, "bot", bot_response, now),
        )

        mysql.connection.commit()
        cursor.close()

        return jsonify({"chat_id": chat_id})
    except Exception as e:
        print("Error in create_chat:\n", traceback.format_exc())
        return jsonify({"error": "Internal server error"}), 500


@chat_bp.route("/chats/<chat_id>", methods=["GET"])
def get_chat(chat_id):
    """Return chat data if user owns it"""
    try:
        user_id = request.args.get("user_id", type=int)
        if not user_id:
            return jsonify({"error": "Missing user_id"}), 400

        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM chats WHERE id = %s", (chat_id,))
        chat = cursor.fetchone()

        if not chat or chat["user_id"] != user_id:
            return jsonify({"error": "Unauthorized"}), 403

        cursor.execute(
            "SELECT nombre_rol, descripcion FROM roles WHERE id = %s",
            (chat["role_id"],),
        )
        role_row = cursor.fetchone()
        if not role_row:
            return jsonify({"error": "Rol no encontrado"}), 404

        role_context = f"{role_row['nombre_rol']}: {role_row['descripcion']}"

        cursor.execute(
            "SELECT sender, content FROM messages WHERE chat_id = %s ORDER BY timestamp ASC",
            (chat_id,),
        )
        messages = cursor.fetchall()
        cursor.close()

        return jsonify({"role_context": role_context, "messages": messages})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@chat_bp.route("/delete_chats/<chat_id>", methods=["DELETE"])
def delete_chat(chat_id):
    try:
        user_id = request.args.get("user_id", type=int)
        if not user_id:
            return jsonify({"error": "Missing user_id"}), 400
        print(chat_id)

        cursor = mysql.connection.cursor()
        cursor.execute(
            "SELECT * FROM chats WHERE id = %s AND user_id = %s", (chat_id, user_id)
        )
        if cursor.fetchone() is None:
            return jsonify({"error": "Unauthorized"}), 403

        cursor.execute("DELETE FROM chats WHERE id = %s", (chat_id,))
        mysql.connection.commit()
        cursor.close()

        return jsonify({"message": "Chat deleted"}), 200
    except Exception:
        print("Error deleting chat:\n", traceback.format_exc())
        return jsonify({"error": "Internal server error"}), 500


@chat_bp.route("/chats/<chat_id>/messages", methods=["POST"])
def send_message(chat_id):
    """User sends a message, get bot reply and save both"""
    try:
        data = request.get_json()
        user_id = int(data.get("user_id"))
        message = data.get("message")
        role_context = data.get("role_context")

        if not message or not role_context:
            return jsonify({"error": "Missing message or role context"}), 400

        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM chats WHERE id = %s", (chat_id,))
        chat = cursor.fetchone()

        if not chat or chat["user_id"] != user_id:
            return jsonify({"error": "Unauthorized"}), 403

        now = datetime.now()

        # Save user message
        cursor.execute(
            "INSERT INTO messages (chat_id, sender, content, timestamp) VALUES (%s, %s, %s, %s)",
            (chat_id, "user", message, now),
        )

        response = handle_conversation(message, role_context, session_id=chat_id)

        # Save bot message
        cursor.execute(
            "INSERT INTO messages (chat_id, sender, content, timestamp) VALUES (%s, %s, %s, %s)",
            (chat_id, "bot", response, now),
        )

        cursor.execute("UPDATE chats SET updated_at = %s WHERE id = %s", (now, chat_id))

        mysql.connection.commit()
        cursor.close()

        return jsonify({"response": response})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@chat_bp.route("/chats/user/<int:user_id>", methods=["GET"])
def list_user_chats(user_id):
    try:
        cursor = mysql.connection.cursor()
        cursor.execute(
            """
            SELECT c.id, c.title, (
                SELECT m2.content
                FROM messages m2
                WHERE m2.chat_id = c.id
                ORDER BY m2.timestamp DESC
                LIMIT 1
            ) AS last_message
            FROM chats c
            WHERE c.user_id = %s
            ORDER BY c.updated_at DESC
            """,
            (user_id,),
        )
        chats = []
        for row in cursor.fetchall():
            chats.append(
                {
                    "id": row["id"],
                    "title": row["title"],
                    "lastMessage": row["last_message"] or "",
                }
            )
        cursor.close()
        return jsonify(chats)
    except Exception:
        print("Error in list_user_chats:\n", traceback.format_exc())
        return jsonify({"error": "Failed to load chats"}), 500
