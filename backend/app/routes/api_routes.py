from flask import Blueprint, request, jsonify, session, redirect
from app.controllers.predict_image import predict_image
from app.models.user import User
from app.models.user_requests import UserRequest
from app.middleware.auth import login_required, admin_required

api_bp = Blueprint("api", __name__)


# root endpoint
@api_bp.route("/", methods=["GET"])
@login_required
def get_user():
    try:
        user = session.get("user")
        if not user:
            return jsonify({"message": "Session User Not Exists"}), 404
        return jsonify(user), 200
    except Exception as e:
        return jsonify({"message": e}), 500


# predict glaucoma from image
@api_bp.route("/predict", methods=["POST"])
@login_required
def predict():
    try:
        if "image" not in request.files:
            return jsonify({"message": "No image provided"}), 400

        file = request.files["image"]
        img_bytes = file.read()

        # Get the prediction and confidence
        predicted_class, confidence, error = predict_image(img_bytes)

        if error:
            return jsonify({"message": str(error)}), 500
        
        result = {"label": predicted_class, "confidence": round(confidence * 100, 2)}
        print(result)

        return jsonify(result)
    except Exception as e:
        return jsonify({"message": str(e)}), 500


# New User Request
@api_bp.route("/user/request", methods=["POST"])
def create_user_request():
    try:
        data = request.json

        if not data.get("email"):
            return jsonify({"error": "Email is required"}), 400

        email = data["email"]

        existing_user = User.objects(email=email).first()
        if existing_user:
            return jsonify({"error": "User Already Exists"}), 409

        pending_request = UserRequest.objects(email=email, status="pending").first()
        if pending_request:
            return (
                jsonify(
                    {"message": "Request Already Exists, Wait until Admin Approves"}
                ),
                200,
            )

        UserRequest(email=email, status="pending").save()
        return jsonify({"message": "Request has been sent to Admin!"}), 200
    except Exception as e:
        print(f"Error while adding New User Request: {str(e)}")
        return jsonify({"message": str(e)}), 500


# Fetch User Requests
@api_bp.route("user/requests", methods=["GET"])
@admin_required
def get_requests():
    try:
        requests = UserRequest.objects()
        return jsonify([request.to_json() for request in requests]), 200
    except Exception as e:
        print(f"Error while fetching user requests: {str(e)}")
        return jsonify({"message": str(e)}), 500


# Approve the User Request
@api_bp.route("user/approve/<request_id>", methods=["GET"])
def approve_request(request_id):
    try:
        request = UserRequest.objects(id=request_id).modify(
            set__status="approved", new=True
        )

        if not request:
            return jsonify({"message": "Request not found"}), 404

        existing_user = User.objects(email=request.email).first()

        if existing_user:
            return jsonify({"message": "User Already Exists"}), 200

        User(email=request.email).save()

        return jsonify({"message": "Approved"}), 200
    except Exception as e:
        print(f"Error while approving user request: {str(e)}")
        return jsonify({"message": str(e)}), 500


# Reject User Access
@api_bp.route("user/reject/<request_id>", methods=["GET"])
@admin_required
def reject_request(request_id):
    try:
        request = UserRequest.objects(id=request_id).modify(
            set__status="rejected", new=False
        )

        if not request:
            return jsonify({"message": "Request not found"}), 404

        return jsonify({"message": "Rejected"}), 200
    except Exception as e:
        print(f"Error while rejecting user request: {str(e)}")
        return jsonify({"message": str(e)}), 500


# Get all users
@api_bp.route("/users", methods=["GET"])
@admin_required
def get_users():
    try:
        users = User.objects.all()
        return jsonify([user.to_json() for user in users]), 200
    except Exception as e:
        return jsonify({"message": e}), 500


# Create a new user
@api_bp.route("/user", methods=["POST"])
@admin_required
def create_user():
    try:
        data = request.json

        if not data.get("email"):
            return jsonify({"error": "Email is required"}), 400

        user = User(**data).save()

        return jsonify(user.to_json()), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500


# Update a user
@api_bp.route("/user/<user_id>", methods=["PUT"])
@admin_required
def update_user(user_id):
    try:
        user = User.objects(id=user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.json

        user.modify(**{key: value for key, value in data.items()})

        return jsonify(user.to_json()), 200
    except Exception as e:
        return jsonify({"message": e}), 500


# Delete a user
@api_bp.route("/user/<user_id>", methods=["DELETE"])
@admin_required
def delete_user(user_id):
    try:
        user = User.objects(id=user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        user.delete()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        return jsonify({"message": e}), 500
