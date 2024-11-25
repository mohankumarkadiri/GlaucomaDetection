from dotenv import load_dotenv
from datetime import timedelta
import os
from pymongo import MongoClient

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    FLASK_ENV = os.getenv('FLASK_ENV')
    MODEL_PATH = os.getenv('MODEL_PATH')
    UPLOAD_FOLDER = "app/static/uploads"
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024
    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
    UI_BASE_URL = os.getenv('UI_BASE_URL')

    # Flask-Session MongoDB configuration
    SESSION_TYPE = 'mongodb'
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    MONGO_URI = f"mongodb+srv://{os.getenv('MONGO_USERNAME')}:{os.getenv('MONGO_PASSWORD')}@{os.getenv('MONGO_HOST')}/{os.getenv('MONGO_DB_NAME')}?retryWrites=true&w=majority"
    SESSION_MONGODB = MongoClient(MONGO_URI)
    SESSION_COOKIE_NAME= 'GlaucomaDetector'
    SESSION_MONGODB_DB = os.getenv('MONGO_DB_NAME')
    SESSION_MONGODB_COLLECT = 'sessions'

    # MongoEngine configuration for models
    MONGODB_SETTINGS = {
        'host': MONGO_URI,
        'db': os.getenv('MONGO_DB_NAME')
    }

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False