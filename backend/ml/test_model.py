"""
Test the saved Loan Eligibility Prediction model with sample inputs.
Run: python test_model.py
"""
import os
import sys
import joblib
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ml.preprocess import preprocess_single_input

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')

SAMPLE_INPUTS = [
    {
        "description": "Graduate, high income, good credit",
        "data": {
            "gender": "Male", "married": "Yes", "dependents": "0",
            "education": "Graduate", "self_employed": "No",
            "applicant_income": 8000, "coapplicant_income": 3000,
            "loan_amount": 150, "loan_amount_term": 360,
            "credit_history": 1, "property_area": "Urban"
        }
    },
    {
        "description": "Not graduate, low income, bad credit",
        "data": {
            "gender": "Male", "married": "No", "dependents": "3",
            "education": "Not Graduate", "self_employed": "Yes",
            "applicant_income": 1500, "coapplicant_income": 0,
            "loan_amount": 200, "loan_amount_term": 360,
            "credit_history": 0, "property_area": "Rural"
        }
    },
    {
        "description": "Female, graduate, moderate income",
        "data": {
            "gender": "Female", "married": "No", "dependents": "1",
            "education": "Graduate", "self_employed": "No",
            "applicant_income": 5000, "coapplicant_income": 1500,
            "loan_amount": 120, "loan_amount_term": 360,
            "credit_history": 1, "property_area": "Semiurban"
        }
    }
]


def test_model():
    print("=" * 55)
    print("  LOAN ELIGIBILITY MODEL - TEST PREDICTIONS")
    print("=" * 55)

    if not os.path.exists(MODEL_PATH):
        print("ERROR: Model not found. Run train_model.py first.")
        return

    model = joblib.load(MODEL_PATH)
    print(f"Model loaded: {type(model).__name__}\n")

    for i, sample in enumerate(SAMPLE_INPUTS, 1):
        print(f"Test {i}: {sample['description']}")
        print(f"  Input: {sample['data']}")
        try:
            X = preprocess_single_input(sample['data'])
            pred = model.predict(X)[0]
            prob = model.predict_proba(X)[0]
            status = "✅ ELIGIBLE" if pred == 1 else "❌ NOT ELIGIBLE"
            print(f"  Result: {status}")
            print(f"  Probability: Eligible={prob[1]:.2%} | Not Eligible={prob[0]:.2%}")
        except Exception as e:
            print(f"  Error: {e}")
        print()

    print("=" * 55)


if __name__ == '__main__':
    test_model()
