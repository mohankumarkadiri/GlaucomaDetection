from flask_mongoengine import MongoEngine
from datetime import datetime

db = MongoEngine()


class Prediction(db.Document):
    image_url = db.StringField(required=True)
    label = db.StringField(required=True, choices=["Glaucoma", "Normal"])
    confidence = db.FloatField(required=True)
    user_email = db.StringField(required=True)
    timestamp = db.DateTimeField(default=datetime.utcnow)

    meta = {
        "collection": "Predictions",
        "indexes": ["user_email", "timestamp"],
    }

    def to_json(self):
        return {
            "id": str(self.id),
            "image_url": self.image_url,
            "label": self.label,
            "confidence": self.confidence,
            "user_email": self.user_email,
            "timestamp": self.timestamp,
        }
