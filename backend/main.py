from flask import Flask
from flask_cors import CORS
from config import Config
from chatbot.extensions import mysql
from chatbot.routes.auth import auth_bp
from chatbot.routes.chat import chat_bp
from chatbot.routes.roles import roles_bp


def create_app():
    app = Flask(__name__)

    # Load settings
    app.config.from_object(Config)

    CORS(
        app,
        resources={r"/*": {"origins": "http://localhost:3000"}},
        supports_credentials=True,
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
    )

    # Initialize MySQL
    mysql.init_app(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(chat_bp, url_prefix="/api")
    app.register_blueprint(roles_bp, url_prefix="/roles")

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
