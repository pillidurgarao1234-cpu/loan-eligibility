"""
Preprocessing module for Loan Eligibility Prediction
Handles data cleaning, encoding, and feature engineering
"""
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
import joblib
import os

ENCODERS_PATH = os.path.join(os.path.dirname(__file__), 'encoders.pkl')
SCALER_PATH = os.path.join(os.path.dirname(__file__), 'scaler.pkl')

CATEGORICAL_COLS = ['Gender', 'Married', 'Dependents', 'Education',
                    'Self_Employed', 'Property_Area']
NUMERICAL_COLS = ['ApplicantIncome', 'CoapplicantIncome', 'LoanAmount',
                  'Loan_Amount_Term', 'Credit_History']


def load_and_clean_data(filepath):
    """Load CSV and perform initial cleaning."""
    df = pd.read_csv(filepath)
    # Drop Loan_ID if present
    if 'Loan_ID' in df.columns:
        df = df.drop('Loan_ID', axis=1)
    # Fill missing values
    df['Gender'].fillna(df['Gender'].mode()[0], inplace=True)
    df['Married'].fillna(df['Married'].mode()[0], inplace=True)
    df['Dependents'].fillna(df['Dependents'].mode()[0], inplace=True)
    df['Self_Employed'].fillna(df['Self_Employed'].mode()[0], inplace=True)
    df['Credit_History'].fillna(df['Credit_History'].mode()[0], inplace=True)
    df['Loan_Amount_Term'].fillna(df['Loan_Amount_Term'].mode()[0], inplace=True)
    df['LoanAmount'].fillna(df['LoanAmount'].median(), inplace=True)
    # Normalize Dependents
    df['Dependents'] = df['Dependents'].replace('3+', '3')
    return df


def encode_features(df, fit=True, encoders=None):
    """Label encode categorical columns."""
    if fit:
        encoders = {}
        for col in CATEGORICAL_COLS:
            if col in df.columns:
                le = LabelEncoder()
                df[col] = le.fit_transform(df[col].astype(str))
                encoders[col] = le
        joblib.dump(encoders, ENCODERS_PATH)
    else:
        if encoders is None:
            encoders = joblib.load(ENCODERS_PATH)
        for col in CATEGORICAL_COLS:
            if col in df.columns and col in encoders:
                le = encoders[col]
                df[col] = df[col].astype(str)
                # Handle unseen labels
                df[col] = df[col].map(lambda x: x if x in le.classes_ else le.classes_[0])
                df[col] = le.transform(df[col])
    return df, encoders


def scale_features(X, fit=True, scaler=None):
    """Scale numerical features using StandardScaler."""
    if fit:
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        joblib.dump(scaler, SCALER_PATH)
    else:
        if scaler is None:
            scaler = joblib.load(SCALER_PATH)
        X_scaled = scaler.transform(X)
    return X_scaled, scaler


def preprocess_for_training(filepath):
    """Full preprocessing pipeline for training."""
    df = load_and_clean_data(filepath)
    # Encode target
    df['Loan_Status'] = df['Loan_Status'].map({'Y': 1, 'N': 0})
    df, encoders = encode_features(df, fit=True)
    X = df.drop('Loan_Status', axis=1)
    y = df['Loan_Status']
    X_scaled, scaler = scale_features(X.values, fit=True)
    return X_scaled, y.values, X.columns.tolist(), encoders, scaler


def preprocess_single_input(input_dict):
    """Preprocess a single user input for prediction."""
    df = pd.DataFrame([input_dict])
    # Map field names from API to model fields
    field_map = {
        'gender': 'Gender',
        'married': 'Married',
        'dependents': 'Dependents',
        'education': 'Education',
        'self_employed': 'Self_Employed',
        'applicant_income': 'ApplicantIncome',
        'coapplicant_income': 'CoapplicantIncome',
        'loan_amount': 'LoanAmount',
        'loan_amount_term': 'Loan_Amount_Term',
        'credit_history': 'Credit_History',
        'property_area': 'Property_Area'
    }
    df = df.rename(columns=field_map)
    # Ensure all needed columns exist
    needed = CATEGORICAL_COLS + NUMERICAL_COLS
    for col in needed:
        if col not in df.columns:
            df[col] = 0
    df = df[needed]
    # Normalize dependents
    df['Dependents'] = df['Dependents'].replace('3+', '3').astype(str)
    # Encode
    df, _ = encode_features(df, fit=False)
    # Scale
    X_scaled, _ = scale_features(df.values, fit=False)
    return X_scaled
