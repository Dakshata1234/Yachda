from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from PIL import Image
import os
import numpy as np

app = Flask(__name__)

# Configure SQLite Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///plant_disease.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Model for storing predictions
class Prediction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image_path = db.Column(db.String(150), nullable=False)
    prediction = db.Column(db.String(50), nullable=False)

# Create the database
db.create_all()

# Ensure upload folder exists
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Simple color-based classification
def classify_image(image_path):
    # Open the image and convert it to RGB
    img = Image.open(image_path).convert('RGB')
    img = img.resize((150, 150))  # Resize for standardization
    img_array = np.array(img)
    
    # Compute the mean color
    mean_color = np.mean(img_array, axis=(0, 1))

    # Rule-based classification based on color
    if mean_color[1] > mean_color[0] and mean_color[1] > mean_color[2]:  # Green dominant
        return 'Healthy'
    elif mean_color[0] > mean_color[1] and mean_color[0] > mean_color[2]:  # Red dominant
        return 'Rust'
    else:
        return 'Uncertain'

# API route for predictions
@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Save the uploaded image
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    # Classify the image
    predicted_class = classify_image(file_path)

    # Save the prediction to the database
    new_prediction = Prediction(image_path=file_path, prediction=predicted_class)
    db.session.add(new_prediction)
    db.session.commit()

    return jsonify({'class': predicted_class})

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
