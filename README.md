# 🎬 Cine-Tube Backend API

Welcome to the backend repository of **Cine-Tube**, a modern, highly scalable, and feature-rich video streaming platform (similar to Netflix or YouTube). This repository contains the robust server-side architecture built with Node.js, Express.js, TypeScript, and PostgreSQL.

---

## 🔗 Important Links

- **🌍 Live Server:** [Cine-Tube Live API](https://cine-tube-gamma.vercel.app)
- **💻 Frontend Repository:** [Cine-Tube Frontend](https://github.com/rakib-hasan3/Cine-Tube-Frontend)
- **👨‍💻 Developer Portfolio:** [Rakib Hasan](https://rakibhasan-dev.vercel.app)

---

## 🚀 Key Features

* **Advanced Authentication & Authorization:** Secure JWT-based authentication with role-based access control (Admin, User) and encrypted password hashing using bcrypt.
* **Media Management:** Complete management system for Movies and Series, including metadata, genres, platforms, and pricing types (Free, Rent, Buy, Subscription).
* **Interactive User Engagement:** Dynamic system for user reviews, ratings, comments, likes on reviews, and personal watchlists.
* **Smart Progress Tracking:** "Continue Watching" feature to track user playback progress across multiple devices seamlessly.
* **Monetization & Payments:** Integrated with **Stripe** for handling secure payments, managing subscriptions (Free, Premium, Family), and one-time purchases (Buy/Rent).
* **AI Integration:** Powered by **Google Generative AI (Gemini)** for smart content interactions and AI-driven features.
* **Robust Admin Dashboard:** Advanced tools for administrators to manage users, media content, reviews, payments, and global system settings.
* **Secure Data Validation:** End-to-end data validation using **Zod** schemas.
* **Email Services:** Integrated with **Nodemailer** for automated communication and newsletters.

---

## 🛠️ Technology Stack

* **Core Framework:** Node.js, Express.js
* **Language:** TypeScript
* **Database & ORM:** PostgreSQL, Prisma ORM
* **Authentication:** JSON Web Tokens (JWT), Bcrypt
* **Payment Gateway:** Stripe
* **Validation:** Zod
* **AI Services:** Google Generative AI SDK
* **Email Service:** Nodemailer

---

## 📂 Project Architecture

The application follows a modular and scalable directory structure:

```
src/
├── config/           # Environment variables & configurations
├── errors/           # Global error handling logic
├── interface/        # Shared TypeScript interfaces & types
├── lib/              # Utility libraries and integrations
├── middlewares/      # Authentication, Validation, and Global middlewares
├── modules/          # Core Business Logic (Modular approach)
│   ├── Admin         # Admin dashboard and settings
│   ├── Ai            # Gemini AI integrations
│   ├── Auth          # Login, Registration, JWT handling
│   ├── Comment       # Review commenting system
│   ├── ContinueWatching # Video progress tracking
│   ├── Media         # Movie & Series management
│   ├── Payment       # Stripe processing webhooks
│   ├── Purchase      # Subscriptions & Purchase tracking
│   ├── Review        # Media reviews & ratings
│   └── User          # User profile management
├── routes/           # Centralized API routing
└── utils/            # Helper functions
```

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### Prerequisites

* Node.js (v18+ recommended)
* PostgreSQL database

### 1. Clone the Repository

```bash
git clone <this-repository-url>
cd cine-tube-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory and configure the necessary environment variables:

```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/cine_tube_db"
JWT_SECRET="your_jwt_secret"
STRIPE_SECRET_KEY="your_stripe_secret_key"
GEMINI_API_KEY="your_gemini_api_key"
# Add other required variables from .env.example if available
```

### 4. Database Setup (Prisma)

Run Prisma migrations to generate the database schema:

```bash
npx prisma generate
npx prisma db push
```
*(Optional)* If you have seed data:
```bash
npm run prisma:seed
```

### 5. Start the Server

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm run build
npm start
```

---

## 🛡️ License & Copyright

Designed and developed by [Rakib Hasan](https://rakibhasan-dev.vercel.app). All rights reserved.
