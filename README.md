# 🍃 AyuMeet

AyuMeet is a modern web platform that connects users with certified Ayurvedic practitioners. Browse doctors by specialization and consultation mode, view availability, and book appointments online, either virtually or in-person.

---

## 🌟 Features

- Browse and search Ayurvedic doctors
- Filter by specialization and consultation mode (Online, Offline, Home Visit, In-person)
- View detailed doctor profiles including experience, rating, patients, and consultation fee
- Book appointments with available time slots
- OTP verification for demo bookings
- Responsive design built with React

---

## 🛠 Tech Stack

- **Frontend:** React, React Router, Tailwind CSS/CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **HTTP Client:** Axios
- **Other:** dotenv for environment variables

--- 

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ayumeet.git
cd ayumeet
````

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```
MONGO_URI=mongodb://localhost:27017/ayumeet
PORT=5000
```

### 3. Seed the Database

Before running the backend, populate the database with demo doctors and time slots:

```bash
node seedData.js
```

> ⚠️ Ensure MongoDB is running locally or provide a valid cloud MongoDB URI.

### 4. Start Backend Server

```bash
npm run dev
```

### 5. Setup Frontend

```bash
cd ../client
npm install
npm run dev
```

Open your browser at `http://localhost:5173` to see the app.

---

## 📂 Folder Structure

```
ayumeet/
├── backend/
│   ├── models/
│   │   ├── Doctor.js
│   │   └── TimeSlot.js....
│   ├── routes/....
│   ├── seedData.js
│   ├── server.js
│   └── .env
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── main.jsx
│   └── package.json
└── README.md
```

---

## 🎨 Screenshots

<img width="1920" height="1020" alt="Screenshot 2025-08-17 212422" src="https://github.com/user-attachments/assets/9df86809-e81b-408a-881e-ad6e79eebaa6" />


<img width="1920" height="1020" alt="Screenshot 2025-08-17 212428" src="https://github.com/user-attachments/assets/8a2b7b10-4798-4014-b13b-ff4c374be9a9" />

<img width="1920" height="1020" alt="Screenshot 2025-08-17 212438" src="https://github.com/user-attachments/assets/c7d35f50-1058-4326-91ca-a5e9210cadb7" />


<img width="1920" height="1020" alt="Screenshot 2025-08-17 212443" src="https://github.com/user-attachments/assets/e93f6941-9d9e-4af9-920a-c32a7ab3149e" />



<img width="1920" height="1020" alt="Screenshot 2025-08-17 212602" src="https://github.com/user-attachments/assets/4e61810e-3a84-43b5-b2ae-3d1dde3d657a" />


<img width="1920" height="1020" alt="Screenshot 2025-08-17 212608" src="https://github.com/user-attachments/assets/7e3e0523-3c4f-498d-9bdc-26c5a98df1bd" />


<img width="1920" height="1020" alt="Screenshot 2025-08-17 212616" src="https://github.com/user-attachments/assets/9a51b842-5cd8-4e87-a3e1-1f33ba67981c" />

---

## 💡 How It Works

1. **Find Your Doctor** – Browse and filter doctors by specialization or mode.
2. **Book a Slot** – View available time slots and select a convenient appointment.
3. **Get Consultation** – Connect online or in-person and receive personalized guidance.

---

## 👩‍⚕️ Meet the Team

* **Dr. Alisha Sharma** – Founder & Chief Ayurvedic Officer
* **Rohan Mehta** – Chief Executive Officer
* **Priya Singh** – Head of Community

---

## 📜 License

This project is licensed under the MIT License.

---

> 🌿 AyuMeet – Bringing authentic Ayurvedic care online.
