from flask_mongoengine import MongoEngine

db = MongoEngine()


class User(db.Document):
    email = db.StringField(required=True, unique=True)
    name = db.StringField()
    role = db.StringField(default="user", choices=["user", "admin"])
    profile_image = db.StringField()
    district = db.StringField()
    state = db.StringField()

    meta = {
        "collection": "Users",
        "indexes": ["email"],
    }

    def to_json(self):
        return {
            "id": str(self.id),
            "email": self.email,
            "name": self.name,
            "role": self.role,
            "profile_image": self.profile_image,
            "district": self.district,
            "state": self.state,
        }
