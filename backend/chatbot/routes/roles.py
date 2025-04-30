from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from chatbot.db import mysql

roles_bp = Blueprint("roles", __name__)


@roles_bp.route("/create-role", methods=["POST"])
def create_role():
    data = request.get_json()
    nombre_rol = data.get("nombre_rol")
    descripcion = data.get("descripcion")

    if not nombre_rol:
        return jsonify({"mensaje": "El nombre del rol es obligatorio"}), 400

    try:
        cursor = mysql.connection.cursor()
        cursor.execute(
            "INSERT INTO roles (nombre_rol, descripcion) VALUES (%s, %s)",
            (nombre_rol, descripcion),
        )
        mysql.connection.commit()
        cursor.close()
        return jsonify({"mensaje": "Rol creado exitosamente"}), 200
    except Exception as e:
        print("Error al crear el rol:", e)
        return jsonify({"mensaje": "Error al crear el rol"}), 500


@roles_bp.route("/update-role/<int:role_id>", methods=["PUT"])
def update_role(role_id):
    data = request.get_json()
    nombre_rol = data.get("nombre_rol")
    descripcion = data.get("descripcion")

    if not nombre_rol or not descripcion:
        return jsonify({"mensaje": "Nombre y descripción requeridos"}), 400

    try:
        cursor = mysql.connection.cursor()
        cursor.execute(
            "UPDATE roles SET nombre_rol = %s, descripcion = %s WHERE id = %s",
            (nombre_rol, descripcion, role_id),
        )
        mysql.connection.commit()
        cursor.close()
        return jsonify({"mensaje": "Rol actualizado correctamente"}), 200
    except Exception as e:
        print("Error al actualizar el rol:", e)
        return jsonify({"mensaje": "Error al actualizar el rol"}), 500


@roles_bp.route("/delete-role/<int:role_id>", methods=["DELETE"])
def delete_role(role_id):
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("DELETE FROM roles WHERE id = %s", (role_id,))
        mysql.connection.commit()
        cursor.close()
        return jsonify({"mensaje": "Rol eliminado"}), 200
    except Exception as e:
        print("Error al eliminar el rol:", e)
        return jsonify({"mensaje": "Error al eliminar el rol"}), 500


@roles_bp.route("/list-roles", methods=["GET"])
def list_roles():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT id, nombre_rol, descripcion FROM roles")
        rows = cursor.fetchall()
        cursor.close()

        roles = [
            {
                "id": row["id"],
                "nombre_rol": row["nombre_rol"],
                "descripcion": row["descripcion"],
            }
            for row in rows
        ]
        return jsonify(roles), 200
    except Exception as e:
        print("Error al listar los roles:", e)
        return jsonify({"mensaje": "Error al listar los roles"}), 500
