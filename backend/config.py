import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') 
    MYSQL_HOST = '34.67.120.18'
    MYSQL_USER = 'root'
    MYSQL_PASSWORD = 'chatbotucabpsico'
    MYSQL_DB = 'chatbot_psicologia'
    MYSQL_CURSORCLASS = 'DictCursor'
