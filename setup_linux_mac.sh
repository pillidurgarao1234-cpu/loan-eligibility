#!/bin/bash
echo "================================================"
echo "  LoanWise AI - Setup Script (Linux/Mac)"
echo "================================================"

echo ""
echo "[1/4] Setting up Python backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
echo "✅ Backend dependencies installed!"

echo ""
echo "[2/4] Training ML Model..."
python ml/train_model.py
echo "✅ ML Model trained and saved!"

echo ""
echo "[3/4] Starting Flask backend..."
python app.py &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID) at http://localhost:5000"

echo ""
echo "[4/4] Setting up frontend..."
cd ../frontend
npm install
echo "✅ Frontend dependencies installed!"

echo ""
echo "================================================"
echo "  Setup Complete!"
echo "  Backend:  http://localhost:5000"
echo "  Frontend: http://localhost:3000 (starting...)"
echo "================================================"
npm run dev
