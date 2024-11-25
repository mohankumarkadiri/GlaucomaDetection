from functools import wraps
from flask import session, jsonify


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get("user"):
            return jsonify({"message": "Unauthorized"}), 401
        return f(*args, **kwargs)

    return decorated_function


def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_data = session.get("user")
        if not user_data:
            return jsonify({"message": "Unauthorized"}), 401

        if user_data.get("role") != "admin":
            return jsonify({"message": "Admin access required"}), 403

        return f(*args, **kwargs)

    return decorated_function
