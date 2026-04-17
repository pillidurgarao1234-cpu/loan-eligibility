@echo off
echo ================================================
echo   LoanWise AI - Setup Script (Windows)
echo ================================================

echo.
echo [1/4] Setting up Python backend...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
echo Backend dependencies installed!

echo.
echo [2/4] Training ML Model...
python ml\train_model.py
echo ML Model trained and saved!

echo.
echo [3/4] Starting Flask backend in background...
start "Flask Backend" cmd /k "venv\Scripts\activate && python app.py"

echo.
echo [4/4] Setting up frontend...
cd ..\frontend
npm install
echo Frontend dependencies installed!

echo.
echo ================================================
echo   Setup Complete!
echo   Backend: http://localhost:5000
echo   Starting frontend...
echo ================================================
npm run dev
