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
  client/      # React frontend
  server/      # Node.js/Express backend
```

---

## Getting Started (Local Development)

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or Atlas)

### 1. Clone the repository
```sh
git clone https://github.com/ronilborah/TaskManagementDashboard.git
cd TaskManagementDashboard
```

### 2. Backend Setup
```sh
cd server
cp .env.example .env   # Create your .env file with MongoDB URI and other secrets
npm install
npm start              # Starts backend on http://localhost:8000
```

### 3. Frontend Setup
```sh
cd ../client
npm install
npm start              # Starts frontend on http://localhost:3000 (proxy to backend)
```

---

## Environment Variables

### Backend (`server/.env`)
```
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
PORT=8000
```

### Frontend (`client/.env` for production)
```
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

---

## Deployment

### Frontend (Vercel)
- Deploy the `client/` folder.
- Set the environment variable `REACT_APP_API_URL` to your Render backend URL.

### Backend (Render)
- Deploy the `server/` folder as a Node.js service.
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