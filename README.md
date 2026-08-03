# ShopEasy - Full-Stack E-commerce Website

Full-stack e-commerce site built with **React** (frontend) + **Node.js/Express** (backend) + **MongoDB** (database).

## Features
- Product listing, search, and detail pages
- User registration & login (JWT authentication)
- Shopping cart (persisted in browser localStorage)
- Checkout & order placement (Cash on Delivery by default)
- Order history for users
- Admin dashboard: add/edit/delete products, view orders, mark as delivered
- Sample data seeder script

## Project Structure
```
ecommerce-app/
├── backend/          <- Express API + MongoDB
│   ├── models/        (User, Product, Order schemas)
│   ├── routes/        (auth, products, orders endpoints)
│   ├── middleware/     (JWT auth + admin check)
│   ├── config/db.js    (MongoDB connection)
│   ├── seeder.js       (sample data script)
│   └── server.js       (entry point)
└── frontend/         <- React app
    ├── src/pages/       (Home, Cart, Login, Checkout, Admin, etc.)
    ├── src/components/  (Navbar, ProductCard, PrivateRoute)
    ├── src/context/     (Auth + Cart global state)
    └── src/utils/api.js (axios instance - THE connection point to backend)
```

## How Frontend & Backend Connect

1. **Backend** runs an Express server on `http://localhost:5000` and exposes REST API endpoints under `/api/...` (e.g. `/api/products`, `/api/auth/login`, `/api/orders`).
2. **Frontend** uses `axios` (see `frontend/src/utils/api.js`) configured with `baseURL: http://localhost:5000/api`. Every page (Home, ProductDetail, Cart, Admin, etc.) calls this `api` object instead of calling fetch/axios directly.
3. **CORS** is enabled on the backend (`app.use(cors())`) so the React app (running on a different port, usually 3000) is allowed to make requests to the API on port 5000.
4. **Authentication**: when a user logs in, the backend returns a JWT `token`. The frontend saves the whole user object (including token) to `localStorage` under `userInfo`. The axios instance automatically attaches this token as an `Authorization: Bearer <token>` header on every subsequent request, so protected routes (checkout, my orders, admin actions) work without extra code in each page.
5. **Environment variable** `REACT_APP_API_URL` in the frontend's `.env` lets you point to a different backend URL when you deploy (e.g. a live Render/Railway URL) instead of localhost.

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+) installed
- MongoDB installed locally OR a free MongoDB Atlas cluster (https://www.mongodb.com/cloud/atlas)

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and set your MONGO_URI and a JWT_SECRET
npm run dev
```
Backend will start on **http://localhost:5000**

Optional - load sample products + an admin account:
```bash
node seeder.js
# Creates admin login: admin@example.com / admin123
```

### 3. Frontend Setup
Open a **new terminal**:
```bash
cd frontend
npm install
cp .env.example .env
npm start
```
Frontend will open on **http://localhost:3000** and will automatically talk to the backend on port 5000.

### 4. Try it out
- Visit http://localhost:3000
- Register a new account, or login as admin (admin@example.com / admin123 after running the seeder)
- Browse products → add to cart → checkout → view order
- Login as admin → go to `/admin` → add/edit/delete products, mark orders delivered

## Notes / Next Steps
- **Payment**: Currently orders are placed as "Cash on Delivery". To add real payments, integrate Stripe: create a Stripe account, add `stripe` npm package on the backend, create a `/api/orders/:id/pay` route that creates a Stripe PaymentIntent, and add Stripe Elements/Checkout on the frontend Checkout page.
- **Image uploads**: currently products just take an image URL. You can add real file uploads using `multer` on the backend.
- **Deployment**: Backend can be deployed to Render/Railway/Heroku; Frontend can be deployed to Vercel/Netlify. Just update `REACT_APP_API_URL` in frontend's `.env` to point to your live backend URL, and update CORS origin on the backend if needed.
