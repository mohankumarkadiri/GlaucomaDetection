from flask import Flask
from flask_cors import CORS
from authlib.integrations.flask_client import OAuth
from app.config.settings import DevelopmentConfig, ProductionConfig
from flask_session import Session
from app.models.user import db
from werkzeug.middleware.proxy_fix import ProxyFix
import os
import cloudinary

oauth = OAuth()


def create_app():
    app = Flask(__name__)

    env = os.getenv("FLASK_ENV", "development")
    if env == "production":
        app.config.from_object(ProductionConfig)
    else:
        app.config.from_object(DevelopmentConfig)

    # Enable proxy support for production environments
    if env == "production":
        app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1)

    # Initialize MongoDB connection with error handling
    try:
        db.init_app(app)
        print("✅ Connected to MongoDB")
    except Exception as e:
        print(f"⛔ Failed to initialize MongoDB: {str(e)}")
        raise

    # Initialize Session with MongoDB
    try:
        Session(app)
        print("✅ Sessions Initialized")
    except Exception as e:
        print(f"⛔ Failed to initialize Session: {str(e)}")
        raise

    # Initialize OAuth
    oauth.init_app(app)

    # Configure Google OAuth
    try:
        if not app.config.get("GOOGLE_CLIENT_ID") or not app.config.get(
            "GOOGLE_CLIENT_SECRET"
        ):
            raise ValueError("⛔ Google OAuth credentials not configured")

        oauth.register(
            name="google",
            client_id=app.config["GOOGLE_CLIENT_ID"],
            client_secret=app.config["GOOGLE_CLIENT_SECRET"],
            server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
            client_kwargs={"scope": "openid email profile", "prompt": "select_account"},
        )
    except Exception as e:
        print(f"⛔ Failed to configure Google OAuth: {str(e)}")
        raise

    # Configure Cloudinary
    try:
        cloudinary.config(
            cloud_name=app.config["CLOUDINARY_CLOUD_NAME"],
            api_key=app.config["CLOUDINARY_API_KEY"],
            api_secret=app.config["CLOUDINARY_API_SECRET"],
        )
        print("✅ Cloudinary configured successfully.")
    except Exception as e:
        raise RuntimeError(f"❌ Cloudinary configuration failed: {str(e)}")

    # Configure CORS
    CORS(
        app,
        origins=["http://localhost:17293"],
        methods=["GET", "POST", "PUT", "DELETE"],
        allow_headers=["Content-Type", "Authorization"],
        supports_credentials=True,
        max_age=3600,
    )

    # Register blueprints
    with app.app_context():
        try:
            from app.routes.api_routes import api_bp
            from app.routes.auth_routes import auth_bp

            app.register_blueprint(api_bp, url_prefix="/api")
            app.register_blueprint(auth_bp, url_prefix="/auth")
        except Exception as e:
            print(f"⛔ Failed to register blueprints: {str(e)}")
            raise

    return app
