# 🏋️‍♂️ SmartFitTrack

SmartFitTrack is a full-stack fitness tracker built with React, Node.js, Express, and MongoDB. It helps users track workouts, body metrics, progress streaks, achievements, and exercise information in a polished, responsive dashboard.

---

## 🚀 What this project includes

- Secure user authentication with JWT cookies, email verification, password reset, and Google OAuth.
- Profile management with avatar uploads and body metric tracking.
- Workout and weight logging, plus progress dashboard statistics.
- Exercise library backed by an external API with search and detail views.
- Achievement badges, workout history, and streak tracking.
- Admin panel support for site management and user oversight.

---

## 🧩 Technologies

### Frontend

- React
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hot Toast
- React Chart.js 2 / Chart.js
- React Hook Form
- Lucide React
- Google OAuth (`@react-oauth/google`)

### Backend

- Node.js
- Express
- MongoDB / Mongoose
- JSON Web Tokens
- bcryptjs
- Nodemailer
- Cloudinary + Multer
- Zod
- Express Rate Limit
- Validator

---

## 📁 Project structure

```bash
SmartFitTrack/
├── client/                     # React frontend
│   ├── public/                 # Static assets
│   ├── src/                    # React source files
│   │   ├── admin/              # Admin dashboard pages and layout
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # App pages and routes
│   │   ├── store/              # State and auth hooks
│   │   └── App.jsx
│   └── package.json
└── server/                     # Express backend
    ├── controllers/            # Route handlers
    ├── middlewares/            # Auth, validation, error handling
    ├── models/                 # Mongoose schemas
    ├── routes/                 # API route definitions
    ├── seeders/                # Database seed scripts
    ├── utils/                  # Helper functions
    ├── server.js               # Server entry point
    └── package.json
```

---

## ⚙️ Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd SmartFitTrack
```

### 2. Install dependencies

```bash
cd client
npm install

cd ../server
npm install
```

---

## 🔧 Environment variables

Create `.env` in `server/`:

```env
PORT=5000
CLIENT_URL=http://localhost:3000
MONGO_URL=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_app_password
GOOGLE_CLIENT_ID=your_google_oauth_client_id
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
ADMIN_NAME=Admin
```

Create `.env` in `client/`:

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_RAPIDAPI_KEY=your_rapidapi_key
```

> `VITE_RAPIDAPI_KEY` is required for the exercise library external API. `GOOGLE_CLIENT_ID` is required for Google sign-in.

---

## ▶️ Running the app

### Start the backend

```bash
cd server
npm start
```

The backend runs via `nodemon` and will seed exercises and achievements automatically if the database is empty.

### Start the frontend

```bash
cd client
npm run dev
```

Then open the app at `http://localhost:3000`.

---

## 🏃 Useful scripts

### Client

- `npm run dev` — Start the development server
- `npm run build` — Build frontend for production
- `npm run preview` — Preview the built app
- `npm run lint` — Run ESLint

### Server

- `npm start` — Start backend with nodemon
- `npm run seed` — Seed the database if empty
- `npm run seed:force` — Force reseed exercises and achievements

---

## 📌 Notes

- The backend protects JWT-secured routes and uses cookies for authentication.
- The exercise library combines local seeded data with an external RapidAPI dataset.
- The admin section is available in the frontend under the admin route and is supported by server-side admin utilities.
- Image upload support is handled by Cloudinary and Multer.

---

## 💡 Recommended workflow

1. Start the backend (`npm start` in `server/`).
2. Start the frontend (`npm run dev` in `client/`).
3. Register or log in.
4. Update your profile and start logging workouts.
5. Use the exercise library search to explore workouts.

---

## 📝 License

No license is included by default. Add one if you plan to publish or share this repository.
