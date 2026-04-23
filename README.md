## 🔗 Live URLs ###

Frontend (User Interface):https://attendance-system-frontend-chi.vercel.app/
Backend (Server):https://attendance-system-backend-jow9.onrender.com
API Base URL:https://attendance-system-backend-jow9.onrender.com/users

##  Test Accounts

Use the following credentials to test different user roles:

| Role        | User id                                      | Password |
| ----------- | ------------------------------------------- | -------- |
| student              :kasu_reddy  : 1234  
| Trainer              : reddy_12    :@reddy
| Institution          :  dharma_    :@dharma
| Programme manager    :  eswar_     :@eswar
| Monitor              : shiva_      :@shiva

## ⚙️ Project Setup (Frontend + Backend)

Follow the steps below to set up the project locally.

---

## 🖥️ Backend Setup (Node.js + Express + PostgreSQL)

### 1. Initialize Backend

```bash
mkdir backend
cd backend
npm init -y
```

### 2. Install Dependencies

```bash
npm install express pg cors dotenv @clerk/clerk-sdk-node
```

---

### 3. Project Structure

```
backend/
│── server.js
│── db.js
│── .env
```

---

### 4. Create `.env` File

```
PORT=5000
DATABASE_URL=
CLERK_SECRET_KEY=
```

---

### 5. Run Backend

```bash
node server.js
```

Server runs on:

```
http://localhost:5000
```

---

## 🌐 Frontend Setup (React + Vite + Tailwind)

### 1. Create Frontend

```bash
npm create vite@latest frontend
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Run Frontend

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

### 4. Install Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

### 5. Configure Tailwind

#### `tailwind.config.js`

```js
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
theme: {
  extend: {},
},
plugins: [],
```

#### `index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

### 6. API Setup

Create `.env` in frontend:

```
VITE_API_URL=http:
```

---

## ✅ Final Run Order

1. Start Backend:

```bash
cd backend
node server.js
```

2. Start Frontend:

```bash
cd frontend
npm run dev
```

---

## 🎉 Done

* Frontend → http://localhost:5173
* Backend → http://localhost:5000
* API → http://localhost:5000/api

---



 🧠 Schema Design Decisions

The database is designed using a **relational structure (PostgreSQL)** to ensure data integrity, scalability, and clear relationships between entities.

---

 1. Users Table (Single Source of Truth)

* A **single `users` table** is used for all roles:

  * `student`, `trainer`, `institution`, `manager`, `monitor`
* Role is controlled using a **CHECK constraint**
* `clerk_user_id` allows integration with Clerk authentication
* `password` column added for fallback/manual authentication

Why this design?

 Avoids multiple user tables
 Simplifies authentication & authorization
 Easy to manage role-based access

---

2. Batches System (Core Structure)

* `batches` represent groups/classes inside an institution
* Linked to `institution_id`

#### Many-to-Many Relationships:

* `batch_trainers` → trainers assigned to batches
* `batch_students` → students enrolled in batches

Why this design?

* Supports multiple trainers per batch
* Supports multiple students per batch
* Flexible and scalable for real-world classroom scenarios

---

 3. Sessions Table (Class Events)

* Each session belongs to a **batch**
* Includes:

  * `title`
  * `date`
  * `start_time`, `end_time`
  * `trainer_id`

Why this design?**

* Separates schedule from attendance
* Allows tracking of individual class sessions
* Enables future features like rescheduling or session history

---

 4. Attendance Table (Normalized Tracking)

* Stores attendance per:

  * `session_id`
  * `student_id`
* `status` supports:

  * `present`, `absent`, `late`
* Enforced with:

  * `UNIQUE(session_id, student_id)`

Why this design?**

* Prevents duplicate attendance records
* Ensures one record per student per session
* Keeps attendance data normalized and query-efficient

---

5. Foreign Keys & Constraints

* All relationships enforced using **foreign keys**
* `ON DELETE CASCADE` used where appropriate:

  * Deleting a batch removes sessions & attendance
* `ON DELETE SET NULL` used for trainer in sessions

Why this design?

* Maintains referential integrity
* Prevents orphan records
* Handles deletion safely

---

### ⚡ 6. Indexing Strategy

Indexes added on:

*`users(role)`
* `batches(institution_id)`
* `sessions(batch_id)`
* `attendance(session_id)`

Why this design?**

* Improves query performance
* Speeds up filtering and joins
* Optimized for common queries (attendance, sessions, roles)





### Notes

* All accounts are pre-seeded in the database
* Roles have different access levels and dashboards
* If login fails, ensure backend server is running and database is connected















# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
