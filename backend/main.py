from flask import Flask
from flask_cors import CORS
from config import Config
from chatbot.extensions import mysql
from chatbot.routes.auth import auth_bp
from chatbot.routes.chat import chat_bp
from chatbot.routes.roles import roles_bp
from dotenv import load_dotenv

load_dotenv()
import os

print("🔍 MYSQL_HOST:", os.environ.get("MYSQL_HOST"))
print("🔍 MYSQL_USER:", os.environ.get("MYSQL_USER"))
print("🔍 MYSQL_PASSWORD:", os.environ.get("MYSQL_PASSWORD"))



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

    print("🔍 MySQL config in app:")
    print("HOST:", app.config['MYSQL_HOST'])
    print("USER:", app.config['MYSQL_USER'])
    print("PASS:", app.config['MYSQL_PASSWORD'])
    print("DB:", app.config['MYSQL_DB'])

    # Initialize MySQL
    mysql.init_app(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(chat_bp, url_prefix="/api")
    app.register_blueprint(roles_bp, url_prefix="/roles")

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000)
