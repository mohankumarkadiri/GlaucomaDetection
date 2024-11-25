from flask_mongoengine import MongoEngine

db = MongoEngine()


class UserRequest(db.Document):
    email = db.StringField(required=True, unique=True)
    status = db.StringField(
        default="pending", choices=["pending", "approved", "rejected"]
    )
    profileImage = db.StringField()

    meta = {
        "collection": "User_Requests",
        "indexes": ["email"],
    }

    def to_json(self):
        return {
            "id": str(self.id),
            "email": self.email,
            "status": self.status,
        }
