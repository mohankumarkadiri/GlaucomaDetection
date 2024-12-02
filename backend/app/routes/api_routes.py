from flask import Blueprint, request, jsonify, session, redirect
from app.controllers.predict_image import predict_image
from app.models.user import User
from app.models.prediction import Prediction
from app.models.user_requests import UserRequest
from app.middleware.auth import login_required, admin_required
import cloudinary.uploader
from io import BytesIO

api_bp = Blueprint("api", __name__)


# root endpoint
@api_bp.route("/", methods=["GET"])
@login_required
def get_user():
    try:
        user_id = session.get("user").get("id")
        if not user_id:
            return jsonify({"message": "Session User Not Exists"}), 404
        user = User.objects(id=user_id).first()
        return jsonify(user), 200
    except Exception as e:
        return jsonify({"message": e}), 500


# predict glaucoma from image
@api_bp.route("/predict", methods=["POST"])
@login_required
def predict():
    try:
        # Check if an image is provided
        if "image" not in request.files:
            return jsonify({"message": "No image provided"}), 400

        file = request.files["image"]
        img_bytes = file.read()

        # Get the prediction and confidence
        predicted_class, confidence, error = predict_image(img_bytes)
        confidence = round(confidence * 100, 2)
        if error:
            return jsonify({"message": str(error)}), 500

        # Upload image to Cloudinary after successful prediction
        try:
            img_stream = BytesIO(img_bytes)

            upload_result = cloudinary.uploader.upload(
                img_stream, folder="glaucoma_predictions", resource_type="image"
            )
            print(upload_result)
            image_url = upload_result.get("secure_url")
            if not image_url:
                return (
                    jsonify(
                        {
                            "message": f"Cloudinary upload failed",
                            "label": predicted_class,
                            "confidence": confidence,
                        }
                    ),
                    200,
                )
        except Exception as cloudinary_error:
            print(cloudinary_error)
            return (
                jsonify(
                    {
                        "message": f"Cloudinary upload failed: {str(cloudinary_error)}",
                        "label": predicted_class,
                        "confidence": confidence,
                    }
                ),
                200,
            )

        # Save prediction to database
        user_email = session.get("user", {}).get("email")
        prediction = Prediction(
            image_url=image_url,
            label=predicted_class,
            confidence=confidence,
            user_email=user_email,
        )
        prediction.save()

        result = {"label": predicted_class, "confidence": confidence}
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500


@api_bp.route("/predictions", methods=["GET"])
@login_required
def get_predictions():
    try:
        user = session.get("user", {})
        user_role = user.get("role")
        user_email = user.get("email")

        if not user_email:
            return jsonify({"message": "User not found in session"}), 404

        if user_role == "admin":
            predictions = Prediction.objects()
        else:
            predictions = Prediction.objects(user_email=user_email)

        return jsonify([prediction.to_json() for prediction in predictions]), 200

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
            return jsonify({"message": "User Already Exists"}), 409

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
@admin_required
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
        email = data.get("email")

        if not email:
            return jsonify({"error": "Email is required"}), 400

        is_user_exists = User.objects(email=email).first()
        if is_user_exists:
            return jsonify({"message": "Email Already Exists"}), 400

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
            return jsonify({"message": "User not found"}), 404

        data = request.json

        user.modify(**{key: value for key, value in data.items()})

        return jsonify(user.to_json()), 200
    except Exception as e:
        return jsonify({"message": e}), 500


@api_bp.route("/user/profile", methods=["PUT"])
@login_required
def update_profile():
    try:

        user_id = session.get("user", {}).get("id")
        if not user_id:
            return jsonify({"message": "User not found in session"}), 404

        user = User.objects(id=user_id).first()
        if not user:
            return jsonify({"message": "User not found"}), 404

        data = request.json
        if not data:
            return jsonify({"message": "No data provided"}), 400

        district = data.get("district")
        state = data.get("state")
        name = data.get("name")
        
        if not name:
            name = user.to_json().get('name')

        if not district or not state:
            return jsonify({"message": "Both 'district' and 'state' are required"}), 400

        user.modify(set__district=district, set__state=state, set__name=name)

        return jsonify(user.to_json()), 200

    except Exception as e:
        print(e)
        return jsonify({"message": str(e)}), 500


# Delete a user
@api_bp.route("/user/<user_id>", methods=["DELETE"])
@admin_required
def delete_user(user_id):
    try:
        user = User.objects(id=user_id).first()
        if not user:
            return jsonify({"message": "User not found"}), 404
        user.delete()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        return jsonify({"message": e}), 500
