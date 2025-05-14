import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'clave-secreta'
    MYSQL_HOST = os.environ.get('MYSQL_HOST') or 'localhost'
    MYSQL_USER = os.environ.get('MYSQL_USER') or 'root'
    MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD') or ''  # Deja vacío si estás en XAMPP sin contraseña
    MYSQL_DB = os.environ.get('MYSQL_DB') or 'chatbot_psicologia'
    MYSQL_CURSORCLASS = 'DictCursor'
