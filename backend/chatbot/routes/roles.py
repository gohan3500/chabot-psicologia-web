from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from chatbot.db import mysql

roles_bp = Blueprint("roles", __name__)

@roles_bp.route("/create-role", methods=["POST"])
@cross_origin(origin="http://localhost:3000", headers=["Content-Type"])
def create_role():
    data = request.get_json()
    nombre_rol = data.get("nombre_rol")

    if not nombre_rol:
        return jsonify({"mensaje": "El nombre del rol es obligatorio"}), 400

    try:
        cursor = mysql.connection.cursor()
        cursor.execute("INSERT INTO roles (nombre_rol) VALUES (%s)", (nombre_rol,))
        mysql.connection.commit()
        cursor.close()
        return jsonify({"mensaje": "Rol creado exitosamente"}), 201
    except Exception as e:
        print("Error al crear el rol:", e)
        return jsonify({"mensaje": "Error al crear el rol"}), 500

@roles_bp.route("/list-roles", methods=["GET"])
@cross_origin(origin="http://localhost:3000", headers=["Content-Type"])
def list_roles():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT id, nombre_rol FROM roles")
        rows = cursor.fetchall()
        cursor.close()

        roles = [{"id": row["id"], "nombre_rol": row["nombre_rol"]} for row in rows]
        return jsonify(roles), 200
    except Exception as e:
        print("Error al listar los roles:", e)
        return jsonify({"mensaje": "Error al listar los roles"}), 500