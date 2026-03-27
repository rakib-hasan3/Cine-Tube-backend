# 🎬 CineTube Backend PRD (Full AI-Ready | One Page)

## 📌 Overview

Build a production-ready **Movie & Series Rating + Streaming Backend API** using:

* Node.js + Express + TypeScript
* Prisma + PostgreSQL
* JWT Authentication
* Modular Architecture

System must support:

* User authentication
* Media management (movie/series)
* Review & rating system
* Like & comment system
* Watchlist
* Payment & subscription
* Admin moderation & analytics

---

## 🧱 Project Structure (STRICT - MUST FOLLOW EXACTLY)

src/
├── config/
│   └── index.ts

├── lib/
│   └── prisma.ts

├── errors/
│   ├── AppError.ts
│   ├── handlePrismaError.ts
│   ├── handlePrismaValidationError.ts
│   └── handleZodError.ts

├── interface/
│   ├── error.ts
│   └── common.ts

├── middlewares/
│   ├── auth.ts
│   ├── role.ts
│   ├── globalErrorHandler.ts
│   ├── notFound.ts
│   └── validateRequest.ts

├── modules/

│   ├── Auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.route.ts
│   │   ├── auth.service.ts
│   │   ├── auth.utils.ts
│   │   └── auth.validation.ts

│   ├── User/
│   │   ├── user.constant.ts
│   │   ├── user.controller.ts
│   │   ├── user.route.ts
│   │   ├── user.service.ts
│   │   ├── user.utils.ts
│   │   └── user.validation.ts

│   ├── Media/
│   │   ├── media.constant.ts
│   │   ├── media.controller.ts
│   │   ├── media.interface.ts
│   │   ├── media.route.ts
│   │   ├── media.service.ts
│   │   └── media.validation.ts

│   ├── Review/
│   │   ├── review.constant.ts
│   │   ├── review.controller.ts
│   │   ├── review.interface.ts
│   │   ├── review.route.ts
│   │   ├── review.service.ts
│   │   └── review.validation.ts

│   ├── Comment/
│   │   ├── comment.controller.ts
│   │   ├── comment.route.ts
│   │   ├── comment.service.ts
│   │   └── comment.validation.ts

│   ├── Like/
│   │   ├── like.controller.ts
│   │   ├── like.route.ts
│   │   └── like.service.ts

│   ├── Watchlist/
│   │   ├── watchlist.controller.ts
│   │   ├── watchlist.route.ts
│   │   └── watchlist.service.ts

│   ├── Payment/
│   │   ├── payment.controller.ts
│   │   ├── payment.route.ts
│   │   ├── payment.service.ts
│   │   └── payment.utils.ts

│   ├── Subscription/
│   │   ├── subscription.controller.ts
│   │   ├── subscription.route.ts
│   │   └── subscription.service.ts

│   ├── Analytics/
│   │   ├── analytics.controller.ts
│   │   ├── analytics.route.ts
│   │   └── analytics.service.ts

│   └── AI/
│       ├── ai.service.ts
│       ├── ai.controller.ts
│       └── ai.utils.ts

├── routes/
│   └── index.ts

├── utils/
│   ├── catchAsync.ts
│   ├── sendResponse.ts
│   ├── pagination.ts
│   └── queryBuilder.ts

├── app.ts
└── server.ts

---

## 🔐 Auth Module

### Routes

POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/auth/me

### Logic

* Hash password (bcrypt)
* Generate JWT
* Attach user via middleware

---

## 👤 User Module

### Routes

GET    /api/v1/users (ADMIN)
GET    /api/v1/users/:id
PATCH  /api/v1/users/:id
DELETE /api/v1/users/:id (ADMIN)

---

## 🎬 Media Module

### Routes

GET    /api/v1/media
GET    /api/v1/media/:id
POST   /api/v1/media (ADMIN)
PATCH  /api/v1/media/:id (ADMIN)
DELETE /api/v1/media/:id (ADMIN)

---

## ⭐ Review Module

### Routes

POST   /api/v1/reviews
GET    /api/v1/reviews/:mediaId
PATCH  /api/v1/reviews/:id
DELETE /api/v1/reviews/:id
PATCH  /api/v1/reviews/:id/status (ADMIN)

---

## ❤️ Like Module

### Routes

POST   /api/v1/reviews/:id/like
DELETE /api/v1/reviews/:id/like

---

## 💬 Comment Module

### Routes

POST   /api/v1/comments
GET    /api/v1/comments/:reviewId

---

## 📌 Watchlist Module

### Routes

POST   /api/v1/watchlist
GET    /api/v1/watchlist
DELETE /api/v1/watchlist/:id

---

## 💳 Payment Module

### Routes

POST   /api/v1/payments/create-session
POST   /api/v1/payments/webhook
GET    /api/v1/payments/history

---

## 📦 Subscription Module

### Routes

POST   /api/v1/subscriptions
GET    /api/v1/subscriptions

---

## 📊 Analytics Module

### Routes

GET /api/v1/analytics/dashboard

---

## 🤖 AI Module

### Use Cases

* Review moderation
* Auto tagging
* Recommendation

---

## 🔐 Middleware Rules

* auth → JWT verify
* role → admin check
* validateRequest → Zod

---

## 🧠 Business Rules

* Unique email
* One like per user
* Admin approval required

---

## ⚡ Response Format

{
"success": true,
"message": "string",
"data": {}
}

---

## 🤖 AI Instructions

* Follow structure strictly
* Use TypeScript
* Controller → Service → Route
* Use Prisma
* Clean code

---

## 🎯 Goal

* Scalable
* Clean
* Production-ready
* AI-friendly
