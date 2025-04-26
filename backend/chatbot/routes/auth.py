from flask import Blueprint, request, jsonify  # type: ignore
from flask_cors import cross_origin  # type: ignore
from werkzeug.security import generate_password_hash  # type: ignore
from werkzeug.security import check_password_hash  # type: ignore
from chatbot.db import mysql
import traceback

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST", "OPTIONS"])
@cross_origin(
    origin="http://localhost:3000",
    methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)
def register():
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200

    data = request.get_json()
    nombre = data.get("nombre")
    correo = data.get("correo")
    contrasena = data.get("contrasena")

    if not nombre or not correo or not contrasena:
        return jsonify({"mensaje": "Faltan datos"}), 400

    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM usuarios WHERE correo = %s", (correo,))
        existente = cursor.fetchone()

        if existente:
            return jsonify({"mensaje": "El correo ya está registrado"}), 400

        hash_contrasena = generate_password_hash(contrasena)
        cursor.execute(
            "INSERT INTO usuarios (nombre, correo, contrasena_hash) VALUES (%s, %s, %s)",
            (nombre, correo, hash_contrasena),
        )
        mysql.connection.commit()
        cursor.close()
        return jsonify({"mensaje": "Usuario registrado exitosamente"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth_bp.route("/login", methods=["POST", "OPTIONS"])
@cross_origin(origin="http://localhost:3000", headers=["Content-Type"])
def login():
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200

    data = request.get_json()
    correo = data.get("correo")
    contrasena = data.get("contrasena")

    if not correo or not contrasena:
        return jsonify({"mensaje": "Faltan datos"}), 400

    try:
        cursor = mysql.connection.cursor()
        cursor.execute(
            "SELECT id, nombre, contrasena_hash FROM usuarios WHERE correo = %s",
            (correo,),
        )
        row = cursor.fetchone()
        cursor.close()

        if row:
            usuario = {
                "id": row["id"],
                "nombre": row["nombre"],
            }
            return jsonify(
                {
                    "mensaje": f"Bienvenido {usuario['nombre']}",
                    "usuario_id": usuario["id"],  # Incluye el usuario_id
                    "nombre": usuario["nombre"],
                }
            )
        else:
            return jsonify({"mensaje": "Correo no encontrado"}), 404

    except Exception as e:
        print("Error en login:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500