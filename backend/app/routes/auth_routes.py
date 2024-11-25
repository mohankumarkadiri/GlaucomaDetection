from flask import (
    Blueprint,
    redirect,
    url_for,
    session,
    current_app,
    jsonify,
)
from app import oauth
from app.models.user import User

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/google")
def login():
    try:
        google = oauth.create_client("google")
        if not google:
            return (
                jsonify(
                    {"message": "⛔ Google OAuth client is not configured correctly."}
                ),
                500,
            )
        redirect_uri = url_for("auth.authorize", _external=True)
        return google.authorize_redirect(redirect_uri)
    except Exception as e:
        return (
            jsonify(
                {
                    "message": "⛔ Failed to initialize Google login. Please try again later."
                }
            ),
            500,
        )


@auth_bp.route("/google/callback")
def authorize():
    try:
        google = oauth.create_client("google")
        if not google:
            return (
                jsonify(
                    {"message": "Google OAuth client is not configured correctly"}
                ),
                500,
            )

        token = google.authorize_access_token()
        resp = google.get("https://www.googleapis.com/oauth2/v3/userinfo")
        user_info = resp.json()

        # Check if user exists and is allowed
        user = User.objects(email=user_info["email"]).first()

        if not user:
            return jsonify({"message": "User Not Exists"}), 403

        # Update user login info
        user.modify(
            set__name=user_info.get("name"),
            set__profileImage=user_info.get("picture"),
        )

        # Store user info in session
        session["user"] = user.to_json()
        session.permanent = True

        return redirect(current_app.config["UI_BASE_URL"])

    except Exception as e:
        return (
            jsonify({"message": f"{e}"}),
            500,
        )


@auth_bp.route("/logout", methods=["DELETE"])
def logout():
    try:
        session.pop("user", None)
        return jsonify("Logged Out successfully!"), 200
    except Exception as e:
        print(f"❌ Logout error: {str(e)}")
        return jsonify({"message": str(e)}), 500
