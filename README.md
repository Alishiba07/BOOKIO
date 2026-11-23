# BOOKIO - MERN Stack Bookstore Application

A complete, full-stack **MERN (MongoDB, Express, React, Node.js)** bookstore application converted from the original static HTML/CSS website. This project retains the exact design, typography, color palette, images, and brand essence while introducing a dynamic database, user authentication, interactive cart, orders, and responsive layout.

---

## Table of Contents
- [Project Architecture & Folder Structure](#project-architecture--folder-structure)
- [Prerequisites](#prerequisites)
- [Step-by-Step Setup & Running Guide](#step-by-step-setup--running-guide)
- [API Endpoints Reference](#api-endpoints-reference)
- [Environment Variables](#environment-variables)
- [Features & Implementation Details](#features--implementation-details)
- [Viva / Presentation Guide](#viva--presentation-guide)

---

## Project Architecture & Folder Structure

```
BOOKIO/
├── backend/
│   ├── src/
│   │   ├── controller/
│   │   │   ├── bookController.js      # CRUD operations for books
│   │   │   ├── userController.js      # Register, login, user profile
│   │   │   └── orderController.js     # Create and fetch customer orders
│   │   ├── route/
│   │   │   ├── bookRoute.js           # Book endpoints routing
│   │   │   ├── userRoute.js           # User auth & profile routing
│   │   │   └── orderRoute.js          # Order placement & history routing
│   │   ├── schema/
│   │   │   ├── bookSchema.js          # Mongoose schema for Book collection
│   │   │   ├── userSchema.js          # Mongoose schema for User collection
│   │   │   └── orderSchema.js         # Mongoose schema for Order collection
│   │   ├── middleware/
│   │   │   └── isAuthenticated.js     # JWT Bearer token authentication guard
│   │   ├── addBooks.js                # Database seeder script (loads books.json)
│   │   ├── connectToDb.js             # Mongoose database connection setup
│   │   ├── constant.js                # Configuration (PORT, MONGO_URL, JWT_SECRET)
│   │   └── index.js                   # Express server entry point
│   ├── books.json                     # Seed data: all 50+ books with original images
│   ├── package.json                   # Backend scripts and dependencies
│   └── .gitignore                     # Ignores node_modules
│
├── frontend/
│   ├── public/
│   │   └── images/                    # Copied original book covers, logo, and artwork
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx             # Sticky navigation with cart badge & auth status
│   │   │   ├── Footer.jsx             # Original footer with categories & quick links
│   │   │   └── BookCard.jsx           # Reusable book card with details & quick add
│   │   ├── pages/
│   │   │   ├── Home.jsx               # Hero, New Arrivals, Classics, Gift Card, Top Picks
│   │   │   ├── Fiction.jsx            # Dynamic Fiction catalog from MongoDB
│   │   │   ├── NonFiction.jsx         # Dynamic Non-Fiction catalog from MongoDB
│   │   │   ├── About.jsx              # Brand story, manifesto, and customer promise
│   │   │   ├── Contact.jsx            # Contact details and controlled message form
│   │   │   ├── ThankYou.jsx           # Order/message confirmation page
│   │   │   ├── BookDetails.jsx        # Individual book page with stock & synopsis
│   │   │   ├── Cart.jsx               # Shopping cart with quantity stepper & totals
│   │   │   ├── Checkout.jsx           # Delivery details form & order placement
│   │   │   ├── Login.jsx              # User login form with JWT persistence
│   │   │   ├── Register.jsx           # User registration form with bcrypt hashing
│   │   │   ├── MyOrders.jsx           # Order tracking & past purchase history
│   │   │   └── CreateBook.jsx         # Protected page to add new titles to database
│   │   ├── App.jsx                    # Root component managing Cart & Auth state
│   │   ├── BookioRoute.jsx            # Central React Router route definitions
│   │   ├── config.js                  # Centralized API_URL (http://localhost:8000)
│   │   ├── index.css                  # Consolidated original styles + responsive design
│   │   └── main.jsx                   # React entry point mounting to DOM
│   ├── index.html                     # HTML shell loading Google Fonts & FontAwesome
│   ├── vite.config.js                 # Vite bundler configuration
│   ├── vercel.json                    # Single-page app routing rewrite rule for deployment
│   ├── package.json                   # Frontend dependencies (React, react-router-dom)
│   └── .gitignore                     # Ignores node_modules, dist
│
├── Alishiba_Adhikari_26140442/        # Original static website files (UNTOUCHED)
└── README.md                          # Documentation and viva preparation
```

---

## Prerequisites

Before starting, ensure you have the following installed on your machine:
1. **Node.js** (v18.0.0 or higher) - [Download Node.js](https://nodejs.org/)
2. **MongoDB Community Server** or **MongoDB Compass** running locally on port `27017`
   *(Alternatively, you can provide a cloud MongoDB Atlas connection URI in environment variables).*

---

## Step-by-Step Setup & Running Guide

Open **two separate Windows PowerShell windows** (one for the backend and one for the frontend).

### Terminal 1: Backend Setup & Execution

```powershell
# 1. Navigate to the backend directory
cd C:\Users\user\Downloads\BOOKIO\backend

# 2. Install backend dependencies
npm install

# 3. Seed MongoDB database with all original books
npm run addbooks

# 4. Start the backend development server
npm run dev
```

*The backend server will start on `http://localhost:8000` with the message:*
```
Server is running on port 8000
Connected to MongoDB successfully
```

---

### Terminal 2: Frontend Setup & Execution

```powershell
# 1. Navigate to the frontend directory
cd C:\Users\user\Downloads\BOOKIO\frontend

# 2. Install frontend dependencies
npm install

# 3. Start the Vite React development server
npm run dev
```

*Open your browser and navigate to:*
```
http://localhost:5173
```

---

### Building for Production (Frontend)

```powershell
cd C:\Users\user\Downloads\BOOKIO\frontend
npm run build
```

---

## API Endpoints Reference

All API requests return standardized JSON responses:
- **Success:** `{ success: true, message: "...", result: ... }`
- **Error:** `{ success: false, message: "..." }`

### 1. User Endpoints (`/api/users`)

| Method | Endpoint | Protection | Description |
|---|---|---|---|
| `POST` | `/api/users/register` | Public | Register new user (hashes password with bcrypt) |
| `POST` | `/api/users/login` | Public | Verify credentials and return 365-day JWT token |
| `GET` | `/api/users/:id` | Public | Read profile information for a specific user |
| `PATCH` | `/api/users/:id` | Protected | Update profile or password (Bearer token required) |

### 2. Book Endpoints (`/api/books`)

| Method | Endpoint | Protection | Description |
|---|---|---|---|
| `GET` | `/api/books` | Public | Fetch all books. Supports filters: `?category=new`, `classic`, etc. and `?search=keyword` |
| `GET` | `/api/books/:id` | Public | Fetch full details for a single book |
| `POST` | `/api/books` | Protected | Create a new book title in the catalog |
| `PATCH` | `/api/books/:id` | Protected | Update book details (price, stock, description) |
| `DELETE` | `/api/books/:id` | Protected | Remove a book from the catalog |

### 3. Order Endpoints (`/api/orders`)

| Method | Endpoint | Protection | Description |
|---|---|---|---|
| `POST` | `/api/orders` | Protected | Place a new order with shipping details & cart items |
| `GET` | `/api/orders/my` | Protected | View all previous orders placed by authenticated user |

---

## Environment Variables

The backend reads configuration directly from `process.env` with fallback defaults (no `dotenv` required):

| Variable | Description | Default Fallback |
|---|---|---|
| `PORT` | Port number for Express server | `8000` |
| `MONGO_URL` | MongoDB connection string | `mongodb://127.0.0.1:27017/bookio` |
| `JWT_SECRET` | Secret key used to sign and verify JWT tokens | `bookio` |
| `VITE_API_URL` | Frontend API base URL | `http://localhost:8000` |

---

## Features & Implementation Details

1. **Original Visual Identity**:
   - Exact fonts loaded: *Frank Ruhl Libre* (hero heading), *Flamenco* (tagline/buttons), *Afacad* (body/cards), and *Inter* (navigation/titles).
   - Brand color palette preserved: crisp white background with bold black accents and signature red highlights (`rgb(255, 42, 5)`).
   - Original static sections retained: Hero with overlay gradient, New Arrivals, Classics, Digital Gift Card promo, Top Picks, About Us story, Manifesto, and Contact page.

2. **Full Dynamic MERN Architecture**:
   - Hardcoded books in HTML replaced by dynamic MongoDB queries via `useEffect` and `fetch()`.
   - Category filtering (`?category=...`) powers sections on the homepage and dedicated pages (`/fiction`, `/nonfiction`).
   - Single book details route (`/book/:id`) shows full synopsis, stock counter, and quantity picker.

3. **Cart & LocalStorage**:
   - Persistent cart stored in `localStorage` as `[{ bookId, title, price, image, quantity }]`.
   - Real-time quantity badge on the shopping bag icon in the navbar.
   - Stepper controls (`+` / `-`) and remove item button in `/cart`.

4. **Security & Authentication**:
   - Passwords hashed using `bcrypt` (10 salt rounds).
   - Session authenticated via JSON Web Tokens (`Bearer <token>`) with 365-day validity.
   - Protected routes (`/checkout`, `/create-book`, `/my-orders`) guard against unauthenticated access.

5. **Beginner-Friendly Code**:
   - Every file features clean, explanatory comments explaining what each function and component does.
   - Strictly conforms to approved semester project guidelines without forbidden libraries (no Redux, no Tailwind, no Axios, no UI frameworks).

---

## Viva / Presentation Guide

When presenting this project in your viva, use these talking points:

1. **How is the project structured?**
   - *"The backend follows an MVC-inspired structure: `schema/` defines Mongoose data models, `controller/` houses business logic with try/catch blocks, `route/` wires endpoints using Express Router, and `middleware/` verifies JWT tokens."*

2. **How does authentication work?**
   - *"During registration, passwords are salted and hashed with `bcrypt`. On login, `bcrypt.compare` verifies the credentials and `jwt.sign` issues a token containing the user's ID. In protected requests, the frontend sends this token in the `Authorization: Bearer <token>` header, which `isAuthenticated.js` decodes."*

3. **How is state managed on the frontend without external libraries?**
   - *"We use standard React hooks (`useState` and `useEffect`). Global cart and user states are held in `App.jsx`, synchronized with the browser's `localStorage`, and passed down as props to components."*

4. **How are images handled?**
   - *"Rather than complex file upload libraries, book records in MongoDB store static image URL paths (e.g. `/images/stoner.webp`). All 57 original images were copied into `frontend/public/images/`, allowing Vite to serve them directly."*
