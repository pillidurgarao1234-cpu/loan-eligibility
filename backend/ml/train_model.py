"""
Train Loan Eligibility Prediction Model
Trains multiple ML algorithms, compares accuracy, saves the best model.
Run: python train_model.py
"""
import os
import sys
import numpy as np
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.metrics import (accuracy_score, confusion_matrix,
                              classification_report, precision_score, recall_score, f1_score)

# Ensure imports work from this directory
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ml.preprocess import preprocess_for_training

DATASET_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'dataset', 'loan_data.csv')
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')
FEATURE_NAMES_PATH = os.path.join(os.path.dirname(__file__), 'feature_names.pkl')


def train_and_evaluate():
    print("=" * 60)
    print("  LOAN ELIGIBILITY PREDICTION - MODEL TRAINING")
    print("=" * 60)

    # 1. Load and preprocess
    print("\n[1] Loading dataset...")
    X, y, feature_names, encoders, scaler = preprocess_for_training(DATASET_PATH)
    print(f"    Dataset shape: {X.shape}, Target distribution: {np.bincount(y)}")

    # 2. Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y)
    print(f"    Train: {X_train.shape[0]} samples | Test: {X_test.shape[0]} samples")

    # 3. Define models
    models = {
        'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42),
        'Decision Tree': DecisionTreeClassifier(max_depth=5, random_state=42),
        'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
        'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, random_state=42),
        'SVM': SVC(probability=True, random_state=42)
    }

    results = {}
    print("\n[2] Training and evaluating models...\n")
    print(f"{'Model':<25} {'Accuracy':>10} {'Precision':>10} {'Recall':>10} {'F1':>10}")
    print("-" * 65)

    for name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, zero_division=0)
        rec = recall_score(y_test, y_pred, zero_division=0)
        f1 = f1_score(y_test, y_pred, zero_division=0)
        results[name] = {'model': model, 'accuracy': acc, 'precision': prec, 'recall': rec, 'f1': f1}
        print(f"{name:<25} {acc:>10.4f} {prec:>10.4f} {rec:>10.4f} {f1:>10.4f}")

    # 4. Pick best model by accuracy
    best_name = max(results, key=lambda k: results[k]['accuracy'])
    best_model = results[best_name]['model']
    print(f"\n[3] Best model: {best_name} (Accuracy: {results[best_name]['accuracy']:.4f})")

    # 5. Detailed report for best model
    y_pred_best = best_model.predict(X_test)
    print("\n[4] Classification Report:")
    print(classification_report(y_test, y_pred_best, target_names=['Not Eligible', 'Eligible']))
    print("[5] Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred_best))

    # 6. Cross-validation
    cv_scores = cross_val_score(best_model, X, y, cv=5, scoring='accuracy')
    print(f"\n[6] Cross-Validation (5-fold): {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

    # 7. Feature importance (if available)
    if hasattr(best_model, 'feature_importances_'):
        print("\n[7] Feature Importances:")
        importances = dict(zip(feature_names, best_model.feature_importances_))
        for feat, imp in sorted(importances.items(), key=lambda x: -x[1]):
            bar = '█' * int(imp * 50)
            print(f"    {feat:<25} {imp:.4f}  {bar}")

    # 8. Save model and feature names
    joblib.dump(best_model, MODEL_PATH)
    joblib.dump(feature_names, FEATURE_NAMES_PATH)
    print(f"\n[8] Model saved to: {MODEL_PATH}")
    print("=" * 60)
    print("  TRAINING COMPLETE!")
    print("=" * 60)
    return best_model, feature_names


if __name__ == '__main__':
    train_and_evaluate()
