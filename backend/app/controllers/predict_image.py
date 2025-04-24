from keras.models import load_model # type: ignore
from app.utils.preprocess import preprocess_image
import numpy as np

# Load the pre-trained model
model = load_model("app/weights/combine_cnn.h5")


def predict_image(img_bytes):

    try:
        # preprocess the image
        img_array, error = preprocess_image(img_bytes=img_bytes)

        if error:
            return None, None, error

        # Make prediction
        prediction = model.predict(img_array)
        class_idx = np.argmax(prediction[0])
        confidence = prediction[0][class_idx]

        class_names = ["Glaucoma", "Normal"]
        predicted_class = class_names[class_idx]

        return predicted_class, float(confidence), None
    except Exception as e:
        return None, None, e
