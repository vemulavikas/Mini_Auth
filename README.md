# 🔐 Mini Auth — Secure MERN Authentication System

A full-stack **MERN authentication project** built with modern best practices — featuring **JWT-based access & refresh tokens**, **form validation**, **password strength indicator**, and **rate limiting** for enhanced security.

## 🚀 Live Demo

**Frontend:** [https://mini-auth-pi.vercel.app](https://mini-auth-pi.vercel.app)  
**Backend:** [https://mini-auth-z53w.onrender.com](https://mini-auth-z53w.onrender.com)

---

## 🧩 Features

✅ **User Registration & Login** — Fully functional auth system  
✅ **JWT Authentication** — Uses Access & Refresh tokens  
✅ **Automatic Token Refresh** — Keeps users logged in securely  
✅ **Form Validation** — Both client & server-side  
✅ **Password Strength Indicator** — Encourages stronger passwords  
✅ **Rate Limiting** — Prevents brute-force & spam requests  
✅ **CORS Protection** — Allows only trusted origins  
✅ **Secure Logout** — Revokes refresh tokens and clears client storage  

---

## 🏗️ Tech Stack

**Frontend:**  
- React.js (with Hooks & React Router)  
- CSS3 (Custom responsive styling)  

**Backend:**  
- Node.js + Express.js  
- MongoDB + Mongoose  
- JWT (Access & Refresh tokens)  
- dotenv, bcryptjs, cors, express-rate-limit  

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/Mini_Auth.git
cd Mini_Auth
2️⃣ Setup the backend
bash
Copy code
cd backend
npm install
Create a .env file in backend/ with:

env
Copy code
PORT=5000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
Then run:

bash
Copy code
npm start
Backend will run on: http://localhost:5000

3️⃣ Setup the frontend
bash
Copy code
cd frontend
npm install
npm start
Frontend will run on: http://localhost:3000

🧠 How It Works
User signs up or logs in → server issues Access & Refresh tokens.

Access token → used for authenticated API requests (short-lived).

Refresh token → stored securely in DB, used to issue new access tokens.

Logout → refresh token removed from DB + tokens cleared on client side.

🛡️ Security Practices
Passwords hashed using bcrypt

CORS restricted to allowed origins (Vercel + localhost)

Express-rate-limit for brute force prevention

Tokens handled securely (never stored in plain cookies)

💡 Future Enhancements
Add OTP-based email verification

Forgot password & reset flow

Role-based access control (Admin/User)

Dark/light theme for UI

👨‍💻 Author
Vemula Vikas
📍 B.Tech CSE — Kakatiya Institute of Technology & Science, Warangal
🔗 LinkedIn Profile
🌐 MERN Stack Developer | Salesforce Learner | Passionate about Secure Web Apps

⭐ If you like this project, don’t forget to give it a star on GitHub!

---

Would you like me to make this **README automatically reference your actual deployed URLs and GitHub username (`vemulavikas`)** and format it with emojis + badges (like “Made with ❤️ using MERN”)?  
I can generate a final polished version ready to copy-paste into your repo.
