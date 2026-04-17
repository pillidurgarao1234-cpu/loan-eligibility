# 🏦 LoanWise AI — Loan Eligibility Prediction

A complete full-stack web application for AI/ML-based loan eligibility prediction.

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, React Router, Axios, React Hot Toast |
| Backend | Python Flask, Flask-JWT-Extended, SQLAlchemy |
| ML/AI | Scikit-learn, Pandas, NumPy, Joblib |
| Database | SQLite (default) / MySQL (optional) |
| Auth | JWT Tokens + Bcrypt password hashing |

---

## 📁 Project Structure

```
loan-eligibility-app/
├── backend/
│   ├── app.py                  # Flask entry point
│   ├── config.py               # App configuration
│   ├── requirements.txt        # Python dependencies
│   ├── models/
│   │   └── models.py           # SQLAlchemy models
│   ├── routes/
│   │   ├── auth_routes.py      # Register/Login/Profile APIs
│   │   ├── loan_routes.py      # Loan apply/predict/history
│   │   └── upload_routes.py    # Document upload
│   ├── ml/
│   │   ├── preprocess.py       # Data preprocessing
│   │   ├── train_model.py      # ML training script
│   │   ├── test_model.py       # Model testing script
│   │   └── model.pkl           # Saved model (generated)
│   ├── dataset/
│   │   └── loan_data.csv       # Training dataset
│   └── uploads/                # Uploaded documents
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── App.jsx              # Routes
        ├── main.jsx             # Entry point
        ├── styles/
        │   └── global.css       # Global styles
        ├── components/
        │   ├── AuthContext.jsx  # Auth state management
        │   └── Layout.jsx       # Sidebar + Topbar layout
        ├── pages/
        │   ├── HomePage.jsx     # Landing page
        │   ├── LoginPage.jsx    # Login
        │   ├── RegisterPage.jsx # Register
        │   ├── DashboardPage.jsx
        │   ├── LoanCategoryPage.jsx
        │   ├── LoanFormPage.jsx # Multi-step form
        │   ├── DocumentUploadPage.jsx
        │   ├── PredictionResultPage.jsx
        │   ├── HistoryPage.jsx
        │   └── ProfilePage.jsx
        └── services/
            └── api.js           # Axios API calls
```

---

## ⚡ Quick Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

---

### 1. Backend Setup

```bash
cd loan-eligibility-app/backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Train the ML Model

```bash
# Inside backend/ directory with venv active:
cd loan-eligibility-app/backend

python ml/train_model.py
```

This will:
- Load the dataset from `dataset/loan_data.csv`
- Train 5 ML models (Logistic Regression, Decision Tree, Random Forest, Gradient Boosting, SVM)
- Print accuracy comparison
- Save the best model as `ml/model.pkl`

**Expected output:**
```
Model                     Accuracy  Precision    Recall        F1
Logistic Regression         0.8065    0.8235    0.9333    0.8750
Decision Tree               0.7742    0.7879    0.9667    0.8681
Random Forest               0.8387    0.8485    0.9333    0.8889
Gradient Boosting           0.8065    0.8000    1.0000    0.8889
SVM                         0.7742    0.8000    0.8667    0.8320

Best model: Random Forest (Accuracy: 0.8387)
```

### 3. Test the ML Model (optional)

```bash
python ml/test_model.py
```

### 4. Start the Flask Backend

```bash
python app.py
```

Backend runs at: **http://localhost:5000**

Test the API: http://localhost:5000/api/health

---

### 5. Frontend Setup

```bash
cd loan-eligibility-app/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## 🔑 API Endpoints

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get user profile | JWT |
| PUT | `/api/auth/profile` | Update profile | JWT |
| POST | `/api/loan/apply` | Submit loan application | JWT |
| POST | `/api/loan/predict` | Get AI prediction | JWT |
| GET | `/api/loan/history` | Get loan history | JWT |
| GET | `/api/loan/application/:id` | Get specific application | JWT |
| POST | `/api/upload` | Upload documents | JWT |
| GET | `/api/documents` | Get documents | JWT |

---

## 📊 Database Tables

### Users
| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| name | String | Full name |
| email | String | Unique email |
| mobile | String | 10-digit mobile |
| password_hash | String | Bcrypt hash |
| created_at | DateTime | Registration time |

### LoanApplications
| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| user_id | FK | References users |
| loan_type | String | House/Student/Personal/Gold |
| status | String | Eligible/Not Eligible/Pending |
| prediction_probability | Float | 0.0 - 1.0 |
| ... | ... | All financial fields |

### Documents
| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| user_id | FK | References users |
| application_id | FK | References applications |
| pan_file | String | File path |
| aadhaar_file | String | File path |
| salary_file | String | File path |
| bank_statement_file | String | File path |

---

## 🤖 ML Model Details

### Features Used
- Gender, Married, Dependents
- Education, Self_Employed
- ApplicantIncome, CoapplicantIncome
- LoanAmount, Loan_Amount_Term
- Credit_History, Property_Area

### Algorithms Compared
1. **Logistic Regression** — Baseline
2. **Decision Tree** — Interpretable
3. **Random Forest** — Best overall accuracy ✅
4. **Gradient Boosting** — High precision
5. **SVM** — Good for small datasets

### Preprocessing Pipeline
1. Missing value imputation (mode/median)
2. Label Encoding for categorical features
3. Standard Scaling for numerical features
4. Train/Test split (80/20)

---

## 🔒 Security Features

- Passwords hashed with **Werkzeug/bcrypt**
- Routes protected with **JWT tokens** (24hr expiry)
- File upload validation (size + type)
- PAN and Aadhaar format validation
- CORS configured for frontend origin

---

## 🗄 MySQL Setup (Optional)

Replace SQLite with MySQL:

1. Install MySQL and create a database:
```sql
CREATE DATABASE loan_db;
```

2. Install PyMySQL:
```bash
pip install PyMySQL cryptography
```

3. Update `config.py`:
```python
SQLALCHEMY_DATABASE_URI = "mysql+pymysql://username:password@localhost/loan_db"
```

---

## 🚀 Production Deployment

### Backend (gunicorn)
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Frontend (build)
```bash
npm run build
# Serve dist/ with nginx or any static server
```

### Environment Variables
```bash
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here
DATABASE_URL=your-database-url
DEBUG=False
```

---

## 🎨 Frontend Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with features |
| Login | `/login` | JWT authentication |
| Register | `/register` | New account creation |
| Dashboard | `/dashboard` | Stats + recent applications |
| Loan Category | `/loan-category` | Select loan type |
| Loan Form | `/loan-form/:type` | 3-step multi-form |
| Upload Docs | `/upload-documents/:id` | Document upload |
| Result | `/result/:id` | Prediction result + PDF |
| History | `/history` | All past applications |
| Profile | `/profile` | User account details |

---

## 📝 Sample API Request

### Register
```json
POST /api/auth/register
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "mobile": "9876543210",
  "password": "securepass123",
  "confirm_password": "securepass123"
}
```

### Predict Loan
```json
POST /api/loan/predict
Authorization: Bearer <jwt_token>
{
  "gender": "Male",
  "marital_status": "Yes",
  "dependents": "0",
  "education": "Graduate",
  "self_employed": "No",
  "applicant_income": 8000,
  "coapplicant_income": 2000,
  "loan_amount": 150,
  "loan_amount_term": 360,
  "credit_history": 1,
  "property_area": "Urban",
  "cibil_score": 750,
  "application_id": 1
}
```

### Response
```json
{
  "status": "Eligible",
  "eligible": true,
  "probability": 87.32,
  "suggestions": [
    "✦ Your profile looks strong! Ensure all documents are up to date."
  ]
}
```

---

## 🧪 Testing

```bash
# Test ML model predictions
cd backend
python ml/test_model.py

# Test API health
curl http://localhost:5000/api/health
```

---

## 📦 Dependencies

### Backend (requirements.txt)
```
Flask==3.0.0
Flask-CORS==4.0.0
Flask-JWT-Extended==4.6.0
Flask-SQLAlchemy==3.1.1
Werkzeug==3.0.1
pandas==2.1.4
numpy==1.26.2
scikit-learn==1.3.2
joblib==1.3.2
```

### Frontend (package.json)
```
react, react-dom, react-router-dom
axios, react-hot-toast
react-icons, jspdf, jspdf-autotable
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Submit a pull request

---

## ⚠️ Disclaimer

This is an AI-powered prediction tool for educational purposes. Actual loan approval depends on the bank's internal policies, documentation review, and regulatory compliance.

---

**Built with ❤️ using React + Flask + Scikit-learn**
