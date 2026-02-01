# 🚀 How to Run STAMPD Rewards

This project consists of two parts: the **Frontend** (Mobile App) and the **Backend** (API). You need to run them in separate terminal windows.

## 1️⃣ Start the Backend (API)
The backend handles the business logic and connects to Solana.

```bash
cd backend
npm install  # Only needed the first time
npm run dev
```
> You should see: `🚀 STAMPD Backend running on port 3000`

---

## 2️⃣ Start the Frontend (Mobile App)
This runs the Expo development server for the mobile app.

```bash
cd spartahack-app
npm install  # Only needed the first time
npm start
```
> You will see a QR code. Scan it with the **Expo Go** app on your phone to run the app!

---

## 🧪 Testing the Flow
Since we are in Demo Mode (no real database setup yet), use the generated test QR codes:

1. Open the file `test_qrs/earn_spartan_coffee.png` on your computer.
2. Open the app on your phone.
3. Tap **"Scan & Earn"**.
4. Scan the QR code on your screen.
