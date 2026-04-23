# 🏋️‍♂️ SmartFitTrack - Complete Fitness & Workout Tracker

A comprehensive **MERN stack** application designed for fitness enthusiasts. **SmartFitTrack** allows users to log workouts, track their fitness progress, explore a vast library of exercises, and visualize their achievements through an intuitive and modern neon-themed dashboard.

---

## 🚀 Features

- **🔐 Advanced Authentication:**
  - Secure JWT-based auth with HTTP-only cookies.
  - Registration with robust validation and Email Verification via OTP.
  - Forgot/Reset Password flow using OTPs.
  - Google OAuth integration for seamless sign-ins.
- **🏋️‍♀️ Comprehensive Exercise Library:**
  - Explore a detailed database of exercises complete with instructions, target muscles, and visual media.
  - Includes a specialized public demo library for visitors.
- **📝 Workout Logging & History:**
  - Easily log workouts, specifying exercises, sets, reps, duration, and intensity.
  - View past routines and detailed workout history.
- **📊 Interactive Dashboard & Analytics:**
  - Visual charts showing workout trends and history using Chart.js.
  - Track metrics like total workouts, calories burned, and activity streaks.
- **🏆 Gamification:**
  - Unlock achievements based on consistent activity and milestones.
- **👤 Profile Management:**
  - Manage personal metrics like weight, height, and age for accurate tracking.
- **🛡️ Robust Security:**
  - Password hashing using `bcryptjs`.
  - Rate limiting to protect endpoints against brute-force attacks.
- **🎨 Modern & Responsive UI:**
  - Visually striking dark/neon themed design crafted with Tailwind CSS.
  - Fully responsive across desktop, tablet, and mobile devices.

---

## 🛠️ Tech Stack

### Frontend

- **React.js** (via Vite)
- **React Router DOM** (Routing)
- **Tailwind CSS** (Styling)
- **Chart.js & React-Chartjs-2** (Data Visualization)
- **React Hook Form** (Form Handling & Validation)
- **Axios** (API Requests)
- **Google OAuth** (`@react-oauth/google`)
- **Lucide React** (Icons)

### Backend

- **Node.js & Express.js**
- **MongoDB & Mongoose** (Database & ODM)
- **JWT (JSON Web Tokens)** (Authentication)
- **bcryptjs** (Password Hashing)
- **Nodemailer** (Email/OTP delivery)
- **Cloudinary & Multer** (Image uploads/Profile management)
- **Zod** (Schema Validation)
- **Express Rate Limit** (Security)

---

## 📁 Project Structure

```bash
SmartFitTrack/
│
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # App views (Dashboard, History, Login, Profile, etc.)
│   │   ├── App.jsx         # Main React application entry
│   │   └── main.jsx
│   ├── public/             # Static assets (data.json for visitor exercises)
│   └── package.json
│
└── server/                 # Backend Node.js/Express application
    ├── controllers/        # Request handlers (Auth, Workout, Exercise)
    ├── middlewares/        # Custom middleware (Auth guard, Error handler)
    ├── models/             # Mongoose schemas (User, Workout, Exercise, etc.)
    ├── routes/             # API route definitions
    ├── seeders/            # Database seeding scripts
    ├── utils/              # Helper functions (DB connection, Emails)
    ├── server.js           # Server entry point
    └── package.json
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone <your-repository-url>
cd SmartFitTrack
```

### 2️⃣ Install Dependencies

#### Client

```bash
cd client
npm install
```

#### Server

```bash
cd ../server
npm install
```

---

### 3️⃣ Setup Environment Variables

Create a `.env` file inside the `server/` directory and configure the following:

```env
# Server Config
PORT=5000
CLIENT_URL=http://localhost:3000

# Database
MONGO_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# Email (Nodemailer for OTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# External Integrations (If applicable)
# GOOGLE_CLIENT_ID=your_google_oauth_id
# CLOUDINARY_CLOUD_NAME=your_cloudinary_name
# CLOUDINARY_API_KEY=your_cloudinary_api_key
# CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

*Note: For the frontend Google OAuth to work, ensure you have the `VITE_GOOGLE_CLIENT_ID` defined in your `client/.env` file.*

---

### 4️⃣ Run the Project

#### Start Backend

```bash
cd server
npm start
```
*(The database will automatically seed default exercises if it is empty upon starting)*

#### Start Frontend

```bash
cd client
npm run dev
```

The application should now be running at `http://localhost:3000` (or whichever port Vite assigned).

---

## 🔗 Core API Endpoints

### Auth Routes (`/api/auth`)
- `POST /register` - Register a new user
- `POST /verify-email` - Verify account via OTP
- `POST /login` - Authenticate user & receive cookie
- `GET /user` - Get authenticated user details
- `POST /logout` - Clear auth cookie
- `POST /forgot-password` - Request password reset OTP
- `POST /reset-password` - Reset password

### Workout & Progress Routes (`/api/workouts`, `/api/progress`)
- `GET /workouts` - Fetch user's workout history
- `POST /workouts` - Log a new workout
- `GET /progress/dashboard` - Get user stats and achievements

### Exercise Routes (`/api/exercises`)
- `GET /exercises` - Fetch available exercises

---

## 👩‍💻 Author

**Vaishnavi Mali**

Built with ❤️ using the MERN Stack.
