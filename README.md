# Task Management Dashboard

A modern, feature-rich task management application built with React that supports both local development (localStorage) and production deployment (MongoDB).

## Features

- **Project Management**: Create, edit, and delete projects with custom colors
- **Task Management**: Add, edit, delete, and organize tasks with drag-and-drop
- **Calendar View**: Unified calendar interface for task scheduling
- **Analytics Dashboard**: Visual insights into task completion and productivity
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Works on desktop and mobile devices
- **Dual Data Storage**: localStorage for local development, MongoDB for production

## Dual-Mode Architecture

This application automatically switches between two data storage modes:

### 🔧 Local Development Mode (localhost)
- **Data Storage**: Browser localStorage
- **Backend**: None required
- **Data Persistence**: Local to your browser
- **Collaboration**: No (single user only)
- **Offline**: Fully supported

### 🚀 Production Deployment Mode (deployed)
- **Data Storage**: MongoDB database
- **Backend**: Node.js/Express API
- **Data Persistence**: Cloud-based, shared
- **Collaboration**: Yes (multi-user)
- **Offline**: Limited (requires internet for data sync)

## Local Development Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd TaskManagementDashboardNew
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open in your browser at `http://localhost:3000` and automatically use localStorage for data storage.

## Production Deployment Setup

### Frontend Deployment

1. Set up your backend API (see Backend Setup below)

2. Configure the backend URL:
   - Copy `env.example` to `.env` in the frontend directory
   - Update `REACT_APP_API_URL` with your backend URL

3. Deploy the frontend:
```bash
cd frontend
npm run build
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and other settings
```

3. Deploy your backend to a hosting service (Render, Heroku, Railway, etc.)

4. Update the frontend's `REACT_APP_API_URL` to point to your deployed backend

## Environment Configuration

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# Backend API URL for production deployment
REACT_APP_API_URL=https://your-backend-url.com/api
```

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=production
PORT=8000
```

## Data Storage Details

### Local Development (localStorage)
- **Keys**: `taskmanager_projects`, `taskmanager_tasks`
- **User Preferences**: `selectedProjectId`, `theme`, `backgroundType`, `fontFamily`, `fontSize`, `glitchOnHover`
- **Data Scope**: Browser-specific, not shared

### Production Deployment (MongoDB)
- **Collections**: `projects`, `tasks`
- **User Preferences**: Stored per user in database
- **Data Scope**: Shared across devices and browsers for authenticated users

## API Structure

The app uses a unified API interface that works with both storage modes:

### Projects
- `GET /projects` - Get all projects
- `POST /projects` - Create a new project
- `PUT /projects/:id` - Update a project
- `DELETE /projects/:id` - Delete a project

### Tasks
- `GET /tasks` - Get all tasks (with optional filters)
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

## Available Scripts

### Frontend
- `npm start` - Start development server (localStorage mode)
- `npm run build` - Build for production (MongoDB mode)
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## Project Structure

```
TaskManagementDashboardNew/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── api.js     # Dual-mode API (localStorage/MongoDB)
│   │   ├── App.js     # Main application component
│   │   └── components/ # React components
│   ├── env.example    # Environment configuration example
│   └── package.json
└── backend/           # Node.js/Express backend (for production)
    ├── config/        # Database configuration
    ├── controllers/   # API controllers
    ├── models/        # MongoDB models
    ├── routes/        # API routes
    └── server.js      # Express server
```

## Features in Detail

### Task Management
- Create tasks with title, description, priority, and due date
- Drag and drop tasks between different status columns
- Filter tasks by priority, status, assignee, and due date
- Search tasks by title and description
- Recurring task support

### Project Organization
- Create multiple projects with custom colors
- Switch between projects easily
- Delete projects (with confirmation)

### Calendar Integration
- View all tasks in a calendar interface
- Drag and drop tasks to reschedule them
- Month and week view modes

### Analytics
- Task completion statistics
- Project progress tracking
- Productivity insights

### Customization
- Multiple background animations
- Font family and size options
- Dark/light theme toggle
- Glitch effects on hover

## Browser Compatibility

This application works in all modern browsers that support:
- ES6+ JavaScript features
- localStorage API (for local development)
- CSS Grid and Flexbox
- Modern CSS features

## Deployment Platforms

### Frontend Deployment
- **Vercel**: Deploy the `frontend` directory
- **Netlify**: Deploy the `frontend` directory
- **GitHub Pages**: Deploy the `frontend` directory
- **Firebase Hosting**: Deploy the `frontend` directory

### Backend Deployment
- **Render**: Deploy the `backend` directory as a Node.js service
- **Heroku**: Deploy the `backend` directory
- **Railway**: Deploy the `backend` directory
- **Vercel**: Deploy the `backend` directory as a serverless function

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly in both local and production modes
5. Submit a pull request

## License

This project is licensed under the MIT License. 