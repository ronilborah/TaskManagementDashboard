# Task Management Dashboard

A modern, full-stack task and project management dashboard built with React (frontend) and Node.js/Express/MongoDB (backend).

---

## Features
- **Project Management**: Create, update, and delete projects with color coding.
- **Task Management**: Add, edit, delete, and drag-and-drop tasks between statuses and priorities.
- **Recurring Tasks**: Support for recurring task creation.
- **Unified Calendar View**: Visualize all tasks in a calendar (monthly/weekly views).
- **Analytics Dashboard**: Visualize project/task stats.
- **Dark Mode & Customization**: Toggle dark mode, change fonts, backgrounds, and more.
- **Keyboard Navigation**: Enhanced accessibility and productivity.
- **Persistent Data**: All project/task data is stored in the backend (MongoDB), not localStorage.
- **Responsive Design**: Works great on desktop and mobile.

---

## Tech Stack
- **Frontend**: React, React Router, React DnD, TailwindCSS, Framer Motion, React Toastify, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Deployment**: Frontend on Vercel, Backend on Render

---

## Folder Structure
```
TaskManagementDashboardNew/
  frontend/    # React frontend
  backend/     # Node.js/Express backend
```

---

## Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or Atlas)

### Complete Setup & Run
```bash
# Clone the repository
git clone https://github.com/ronilborah/TaskManagementDashboard.git
cd TaskManagementDashboard

# Install all dependencies and start the application
npm run install-all && npm run dev
```

This single command will:
1. Install all dependencies for both frontend and backend
2. Find available ports automatically (avoids conflicts)
3. Start both servers
4. Open the frontend in your default browser
5. Display the URLs for both frontend and backend

**Expected Output:**
```
🚀 Starting Task Management Dashboard...

📱 Frontend will run on: http://localhost:8765
🔧 Backend will run on: http://localhost:8000

[Backend] 🚀 Backend server running on port 8000
[Backend] Environment: development
[Backend] API URL: http://localhost:8000
[Backend] Health check: http://localhost:8000/api/health

[Frontend] Starting the development server...
[Frontend] Compiled successfully!
[Frontend] You can now view task-management-dashboard in the browser.
[Frontend] Local: http://localhost:8765
```

---

## Alternative Setup (Manual)

### Frontend Setup
```sh
cd frontend
npm install
npm start              # Starts frontend on http://localhost:8765
```

### Backend Setup
```sh
cd backend
cp .env.example .env   # Create your .env file with MongoDB URI and other secrets
npm install
npm run dev            # Starts backend on http://localhost:8000
```

---

## Environment Variables

### Backend (`backend/.env`)
```
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
PORT=8000
```

### Frontend (`frontend/.env` for production)
```
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

---

## Available Scripts

### Root Level
- `npm run install-all` - Install dependencies for both frontend and backend
- `npm run dev` - Start both frontend and backend with dynamic ports and auto-open browser
- `npm run backend` - Start only the backend server
- `npm run frontend` - Start only the frontend development server
- `npm run build` - Build the frontend for production
- `npm run test` - Run frontend tests
- `npm start` - Alias for `npm run dev`

### Frontend (`frontend/`)
- `npm start` - Start development server (auto-opens browser)
- `npm run build` - Build for production
- `npm test` - Run tests

### Backend (`backend/`)
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

---

## Port Management

The application automatically handles port conflicts:
- **Frontend**: Starts on port 8765, automatically finds next available port if busy
- **Backend**: Starts on port 8000, automatically finds next available port if busy
- **Browser**: Automatically opens when frontend is ready

---

## Deployment

### Frontend (Vercel)
- Deploy the `frontend/` folder.
- Set the environment variable `REACT_APP_API_URL` to your Render backend URL.

### Backend (Render)
- Deploy the `backend/` folder as a Node.js service.
- Set up your MongoDB URI and any other secrets in the Render dashboard.
- Make sure CORS in `server.js` allows your Vercel frontend domain.

---

## API Endpoints
- `GET    /api/projects`   - List all projects
- `POST   /api/projects`   - Create a new project
- `PUT    /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project
- `GET    /api/tasks`      - List all tasks (with filters)
- `POST   /api/tasks`      - Create a new task
- `PUT    /api/tasks/:id`  - Update a task
- `DELETE /api/tasks/:id`  - Delete a task

---

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License
[MIT](LICENSE)

---

## Author
[ronilborah](https://github.com/ronilborah) 