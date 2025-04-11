from flask import Flask  # type: ignore
from flask_cors import CORS  # type: ignore
from config import Config
from chatbot.extensions import mysql
from chatbot.routes.auth import auth_bp
from chatbot.routes.chat import chat_bp

def create_app():
    app = Flask(__name__)
    
    # Cargar configuración desde config.py
    app.config.from_object(Config)

    # CORS: permitir React (puerto 3000) con métodos y headers
    CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

    # Inicializar MySQL
    mysql.init_app(app)

    # Registrar Blueprints
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(chat_bp, url_prefix="/api")

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
