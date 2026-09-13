# Homyz - Premium Real Estate Platform 🏡

![Homyz Banner](https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop)

Homyz is a full-stack, enterprise-level real estate platform that seamlessly connects property buyers, renters, and agents. Built with the powerful **MERN stack**, it features secure role-based dashboards, real-time messaging, automated notifications, and an integrated Stripe payment gateway for seamless property bookings.

---

## ✨ Key Features

- **🔒 Role-Based Access Control:** Dedicated, secure dashboards for **Customers**, **Agents**, and **Admins**.
- **💬 Real-Time Chat & Notifications:** Powered by **Socket.io** for instant communication between buyers and agents.
- **💳 Secure Payments:** Integrated **Stripe Checkout** and automated webhooks for secure property token bookings.
- **📊 Analytics Dashboard:** Interactive data visualization using **Recharts** to track property views and agent performance.
- **🗺️ Interactive Maps:** Integrated **Leaflet** maps for precise property location viewing.
- **⭐ Review System:** Customers can leave ratings and reviews for properties they have visited.
- **📱 Responsive & Beautiful UI:** Styled with **Tailwind CSS**, featuring smooth micro-interactions and scroll animations using **Framer Motion**.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19, TypeScript, Vite
- **State Management:** Redux Toolkit (RTK)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion, GSAP
- **Routing:** React Router DOM v7
- **Forms & Validation:** React Hook Form, Zod

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose
- **Real-Time Communication:** Socket.io
- **Authentication:** JSON Web Tokens (JWT) & bcrypt.js
- **File Uploads:** Multer & Cloudinary
- **Payments:** Stripe SDK

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/homyz-react.git
cd homyz-react
```

### 2. Install Dependencies
You need to install dependencies for both the frontend (root) and the backend (`/server`).

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Environment Variables
You will need to create two `.env` files. 

**Frontend (`/.env`)**
```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
```

**Backend (`/server/.env`)**
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/homyz
JWT_SECRET=your_jwt_secret
NODE_ENV=development

# Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SMTP (Emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
FROM_NAME=Homyz
FROM_EMAIL=your_email@gmail.com

# Stripe (Payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### 4. Seed the Database (Optional but Recommended)
Populate your local database with dummy users, properties, and bookings for testing.
```bash
cd server
npm run seed
```

### 5. Run the Application
Start both the backend server and the Vite frontend server.

**Terminal 1: Backend**
```bash
cd server
npm run dev
```

**Terminal 2: Frontend**
```bash
npm run dev
```

The frontend will be running at `http://localhost:5173` and the backend API at `http://localhost:5000`.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/homyz-react/issues).

## 📝 License
This project is licensed under the MIT License.
