import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'clave-secreta'
    MYSQL_HOST = 'localhost'
    MYSQL_USER = 'root'
    MYSQL_PASSWORD = ''  # Deja vacío si estás en XAMPP sin contraseña
    MYSQL_DB = 'chatbot_psicologia'
    MYSQL_CURSORCLASS = 'DictCursor'
