# TaskFlow - Task Manager App

A full stack task management app built with the MERN stack. Users can sign up, log in, and manage their daily tasks with features like priority levels, due dates, drag & drop reordering, and dark/light mode.

## Live Demo

- Frontend: `https://your-app.vercel.app` ← replace after deployment
- Backend: `https://your-api.onrender.com` ← replace after deployment

## Screenshots

> Add screenshots here after deployment

## Features

- User signup and login with JWT authentication
- Add, edit, delete tasks
- Set priority (Low, Medium, High) and due date
- Mark tasks as completed
- Filter tasks by status — All, Pending, Completed, Overdue
- Search tasks by title
- Drag and drop to reorder tasks
- Progress bar showing overall completion
- Dark and light mode toggle

## Tech Stack

**Frontend**
- React.js
- Tailwind CSS
- Axios
- React Router DOM
- dnd-kit (drag and drop)

**Backend**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Folder Structure

```
task-manager/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
└── frontend/
    └── src/
        ├── api/
        ├── components/
        └── pages/
```

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend folder:

```
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev
```

App will run at `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register a new user |
| POST | /api/auth/login | Login and get token |
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Create a task |
| PUT | /api/tasks/:id | Update a task |
| DELETE | /api/tasks/:id | Delete a task |

## Author

Made by [Your Name] — [Your GitHub Profile Link]
