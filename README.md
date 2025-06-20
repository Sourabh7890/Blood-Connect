# 🩸 Blood-Connect

**Blood-Connect** is a full-stack blood donation and request management web application.  
It helps connect blood donors and recipients through a simple, secure platform with role-based access.

---

## 🚀 Features

- 👤 Donor & Recipient Registration and Login
- 🔍 Blood Search Functionality
- 📢 Emergency Alert Banner
- 🧑‍⚕️ Admin Dashboard for managing users and requests
- 🔐 Protected Routes with Role-based Access
- 📱 Responsive UI using Tailwind CSS

---

## 🛠️ Tech Stack

**Frontend:**
- React.js (with TypeScript)
- Tailwind CSS
- Vite

**Backend:**
- Node.js
- Express.js
- MongoDB (with Mongoose)

---

## ⚙️ Installation and Running Locally

Follow the steps below to run the project on your local machine.

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Sourabh7890/Blood-Connect.git
cd Blood-Connect

2️⃣ Start the Frontend
npm install
npm run dev

3️⃣ Start the Backend
cd backend
npm install
node server.js

.env file
MONGO_URL=your_mongodb_connection_string
PORT=5000

Folder Structure
Blood-Connect/
├── backend/              # Node.js Backend
│   └── example.env       # Sample .env file for setup
├── src/                  # React Frontend
├── public/
├── README.md
├── package.json
├── vite.config.ts
