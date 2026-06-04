"""
Elephant Risk Prediction API
FastAPI app that loads the trained model and serves predictions.

Run locally:
    pip install fastapi uvicorn joblib scikit-learn numpy pandas
    uvicorn elephant_risk_api:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from typing import Literal
import numpy as np
import pandas as pd
import joblib

# ─────────────────────────────────────────────────────────────────────
# Load trained model
# ─────────────────────────────────────────────────────────────────────
try:
    artifact   = joblib.load("elephant_risk_model.pkl")
    model      = artifact["model"]
    encoders   = artifact["encoders"]
    FEATURE_COLS = artifact["features"]
except FileNotFoundError:
    raise RuntimeError("elephant_risk_model.pkl not found. Train the model first.")

# ─────────────────────────────────────────────────────────────────────
# Constants
# ─────────────────────────────────────────────────────────────────────
DECAY_LAMBDA = 0.005

CATEGORICALS = [
    "section_id", "season", "moon_phase",
    "crop_type", "crop_maturity_stage"
]

# ─────────────────────────────────────────────────────────────────────
# FastAPI App
# ─────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="🐘 Elephant Risk Prediction API",
    description="Predicts elephant intrusion risk (LOW / MEDIUM / HIGH / CRITICAL)",
    version="2.0.0",
)

# ─────────────────────────────────────────────────────────────────────
# CORS (IMPORTANT)
# ─────────────────────────────────────────────────────────────────────
# For development use "*"
# For production replace with your frontend domain
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────────────────────
# Request Schema
# ─────────────────────────────────────────────────────────────────────
class PredictRequest(BaseModel):

    # Categorical
    section_id: Literal[
        "S1","S2","S3","S4","S5","S6","S7",
        "S8","S9","S10","S11","S12","S13","S14"
    ]
    season: Literal["dry", "wet", "transition"]
    moon_phase: Literal["new", "crescent", "quarter", "gibbous", "full"]
    crop_type: Literal["sugarcane", "maize", "rice", "banana"]
    crop_maturity_stage: Literal["seedling", "growing", "mature", "post_harvest"]

    # Numeric
    hour_of_day: int = Field(..., ge=0, le=23)
    is_night: int = Field(..., ge=0, le=1)
    temperature_c: float = Field(..., ge=-10, le=60)
    rainfall_last_24h_mm: float = Field(..., ge=0)
    days_to_harvest: int = Field(..., ge=0, le=365)
    water_canal_present: int = Field(..., ge=0, le=1)
    forest_distance_m: float = Field(..., ge=0)

    # Trigger history
    triggered_last_1hr: int = Field(..., ge=0, le=1)
    triggered_last_6hrs: int = Field(..., ge=0, le=1)
    triggers_last_7days: int = Field(..., ge=0)
    same_section_triggered_yesterday: int = Field(..., ge=0, le=1)
    closest_detection_last_24h_m: float = Field(..., ge=0)
    avg_risk_score_last_week: float = Field(..., ge=0, le=1)

    # Neighbors
    neighbor_max_risk_score: float = Field(..., ge=0, le=1)
    neighbor_any_triggered_1hr: int = Field(..., ge=0, le=1)

    # Time decay
    minutes_since_last_trigger: float = Field(..., ge=0)
    time_decay_factor: float | None = Field(default=None, ge=0, le=1)

    @validator("time_decay_factor", always=True)
    def fill_time_decay(cls, v, values):
        if v is None:
            mins = values.get("minutes_since_last_trigger", 10080)
            return round(float(np.exp(-DECAY_LAMBDA * mins)), 4)
        return v

# ─────────────────────────────────────────────────────────────────────
# Response Schema
# ─────────────────────────────────────────────────────────────────────
class PredictResponse(BaseModel):
    section_id: str
    risk_level: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    probabilities: dict[str, float]
    top_risk_factor: str
    time_decay_factor_used: float

# ─────────────────────────────────────────────────────────────────────
# Health Endpoints
# ─────────────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "ok", "model": "elephant_risk_model.pkl"}

@app.get("/health")
def health():
    return {"status": "healthy"}

# ─────────────────────────────────────────────────────────────────────
# Prediction Endpoint
# ─────────────────────────────────────────────────────────────────────
@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    try:
        data = req.dict()
        sample_df = pd.DataFrame([data])

        # Encode categoricals
        for col in CATEGORICALS:
            le = encoders[col]
            try:
                sample_df[col + "_enc"] = le.transform(sample_df[col])
            except ValueError:
                raise HTTPException(
                    status_code=422,
                    detail=f"Unknown value for '{col}'. Allowed: {list(le.classes_)}"
                )

        # Predict
        X = sample_df[FEATURE_COLS]
        risk_level = model.predict(X)[0]
        proba = model.predict_proba(X)[0]
        proba_dict = {
            cls: round(float(p), 4)
            for cls, p in zip(model.classes_, proba)
        }

        # Feature importance
        importances = dict(zip(FEATURE_COLS, model.feature_importances_))
        top_feature = max(
            (f for f in FEATURE_COLS if not f.endswith("_enc")),
            key=lambda f: importances.get(f, 0)
        )

        return PredictResponse(
            section_id=req.section_id,
            risk_level=risk_level,
            probabilities=proba_dict,
            top_risk_factor=top_feature,
            time_decay_factor_used=req.time_decay_factor,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ─────────────────────────────────────────────────────────────────────
# Run locally
# ─────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("elephant_risk_api:app", host="0.0.0.0", port=8000, reload=True)