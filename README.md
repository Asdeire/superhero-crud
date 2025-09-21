# 🦹‍♂️ Superhero CRUD

A full-stack application for managing superheroes.
Built with **Node.js + Express + PostgreSQL** on the backend and **Vue 3 + Vite + Tailwind** on the frontend.
Supports **CRUD operations**, **image uploads**, and a modern responsive UI.

---

## 🚀 Features

* **Backend (Express + PostgreSQL)**

  * RESTful API with pagination.
  * Create, read, update, delete superheroes.
  * Upload and manage multiple images per superhero.
  * Input validation & error handling.
  * Jest + Supertest test suite.

* **Frontend (Vue 3 + Vite + Tailwind)**

  * SPA with Vue Router & Pinia store.
  * Pages: List, Detail, Create, Edit.
  * Image preview, upload & deletion.
  * Clean UI components with Tailwind.

---

## 📂 Project Structure

```
├── backend/                   # Node.js + Express API
│   ├── src/
│   │   ├── config/            # Database & Multer configs
│   │   ├── controllers/       # Request handlers (SuperheroController)
│   │   ├── middleware/        # Error handling & validation
│   │   ├── models/            # Database models (Superhero, Images)
│   │   ├── routes/            # Express routes
│   │   ├── services/          # Business logic
│   │   └── utils/             # Helpers (file handling, etc.)
│   ├── tests/                 # Jest + Supertest test suite
│   ├── package.json
│   └── server.js              # App entry point
│
├── frontend/                  # Vite + Vue 3 SPA
│   ├── src/
│   │   ├── components/        # UI components
│   │   │   └── ui/            # Reusable UI elements (Button, Input, etc.)
│   │   ├── composables/       # Reusable API hooks
│   │   ├── pages/             # Page views (List, Detail, Form)
│   │   ├── router/            # Vue Router setup
│   │   ├── stores/            # Pinia stores
│   │   ├── utils/             # Helpers (image URL builder, etc.)
│   │   ├── App.vue            # Root component
│   │   └── main.js            # App bootstrap
│   ├── index.html             # SPA entry
│   ├── vite.config.js         # Vite
│   └── package.json
│
├── LICENSE
└── README.md
```

---

## ⚙️ Backend Setup

### Prerequisites

* Node.js ≥ 18
* PostgreSQL ≥ 14

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Create `.env` in `backend/`:

```env
PORT=3000
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
DB_NAME=superhero_db
```

### Run

```bash
# Development
npm run dev

# Production
npm start

# Tests
npm test
```

API will be available at:
👉 `http://localhost:3000/api/superheroes`
Health check: `http://localhost:3000/health`

---

## 🎨 Frontend Setup

### Installation

```bash
cd frontend
npm install
```

### Environment Variables

Create `.env` in `frontend/`:

```env
VITE_API_BASE=http://localhost:3000/api
```

### Run

```bash
# Development
npm run dev

# Production build
npm run build
npm run preview
```

App will be available at:
👉 `http://localhost:5173`

---

## 📌 API Endpoints

* `GET /api/superheroes?page=1&limit=5` → List superheroes (paginated)
* `GET /api/superheroes/:id` → Get details by ID
* `POST /api/superheroes` → Create new superhero (multipart/form-data)
* `PUT /api/superheroes/:id` → Update superhero + add new images
* `DELETE /api/superheroes/:id` → Delete superhero
* `DELETE /api/superheroes/:id/images/:imageId` → Delete specific image

---

## 🧪 Testing

Backend tests use **Jest + Supertest**:

```bash
cd backend
npm test
```

---

## 📜 License

[MIT](./LICENSE) © 2025 Asdeire
