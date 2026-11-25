from fastapi import FastAPI
from pydantic import BaseModel, Field
import joblib
from typing import Literal
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Stroke Prediction API",
    description="Stroke Prediction using Random Forest",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://stroke-prediction-model-frontend.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Load model
model_load = joblib.load("best_rf_model.pkl")

model = model_load["model"]
threshold = model_load["threshold"]


# Input validation
class StrokeInput(BaseModel):

    gender: Literal["Male", "Female"]

    age: float = Field(ge=0, le=90)

    hypertension: Literal["Yes", "No"]

    heart_disease: Literal["Yes", "No"]

    ever_married: Literal["Yes", "No"]

    work_type: Literal[
        "Private",
        "Self-employed",
        "Government Job",
        "Children",
        "Never Worked"
    ]

    Residence_type: Literal["Rural", "Urban"]

    avg_glucose_level: float = Field(gt=0,le=300)

    bmi: float = Field(gt=0,le=100)

    smoking_status: Literal[
        "Formerly Smoked",
        "Never Smoked",
        "Smokes",
        "Unknown"
    ]


# Work type mapping
work_type_mapping = {
    "Private": "Private",
    "Self-employed": "Self-employed",
    "Government Job": "Govt_job",
    "Children": "children",
    "Never Worked": "Never_worked"
}


# Smoking status mapping
smoking_mapping = {
    "Formerly Smoked": "formerly smoked",
    "Never Smoked": "never smoked",
    "Smokes": "smokes",
    "Unknown": "Unknown"
}


# Convert Yes/No into 1/0
def convert_yes_no(value):
    return 1 if value == "Yes" else 0


# Generate age group
def get_age_group(age):

    bins = [0, 2, 12, 19, 35, 50, 65, 90]

    labels = [
        "Infant",
        "Child",
        "Teen",
        "Young Adult",
        "Adult",
        "Middle Aged",
        "Senior"
    ]

    return pd.cut(
        [age],
        bins=bins,
        labels=labels,
        include_lowest=True
    )[0]


# Home route
@app.get("/")
def greet():

    return {
        "message": "Stroke Prediction API is running"
    }


# Prediction route
@app.post("/predict")
def predict_stroke(data: StrokeInput):

    # Convert input into dictionary
    input_data = data.model_dump()

    # Convert Yes/No values
    input_data["hypertension"] = convert_yes_no(
        input_data["hypertension"]
    )

    input_data["heart_disease"] = convert_yes_no(
        input_data["heart_disease"]
    )

    # Map work type
    input_data["work_type"] = work_type_mapping[
        input_data["work_type"]
    ]

    # Map smoking status
    input_data["smoking_status"] = smoking_mapping[
        input_data["smoking_status"]
    ]

    # Generate age group
    input_data["age_group"] = get_age_group(
        input_data["age"]
    )

    # Create DataFrame
    input_df = pd.DataFrame([input_data])

    # Ensure correct feature order
    input_df = input_df[
        [
            "gender",
            "age",
            "hypertension",
            "heart_disease",
            "ever_married",
            "work_type",
            "Residence_type",
            "avg_glucose_level",
            "bmi",
            "smoking_status",
            "age_group"
        ]
    ]

    # Predict probability
    probability = model.predict_proba(input_df)[0][1]

    # Apply saved threshold
    prediction = 1 if probability >= threshold else 0

    # Prediction response
    if prediction == 1:
        result = "High Risk of Stroke"
    else:
        result = "Low Risk of Stroke"

    return {
    "result": result
}