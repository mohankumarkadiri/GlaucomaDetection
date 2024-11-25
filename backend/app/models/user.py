from flask_mongoengine import MongoEngine

db = MongoEngine()


class User(db.Document):
    email = db.StringField(required=True, unique=True)
    name = db.StringField()
    role = db.StringField(default="user", choices=["user", "admin"])
    profileImage = db.StringField()

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
        }
