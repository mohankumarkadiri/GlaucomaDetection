from PIL import Image
import io
import numpy as np

def preprocess_image(img_bytes):
    try:
        img = Image.open(io.BytesIO(img_bytes))
        img = img.resize((256, 256))
        img_array = np.array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array / 255.0
        return img_array, None
    except Exception as e:
        return None, e