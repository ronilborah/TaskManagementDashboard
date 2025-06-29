# Task Management Dashboard

A modern, feature-rich task management application built with React and localStorage for local development.

## Features

- **Project Management**: Create, edit, and delete projects with custom colors
- **Task Management**: Add, edit, delete, and organize tasks with drag-and-drop
- **Calendar View**: Unified calendar interface for task scheduling
- **Analytics Dashboard**: Visual insights into task completion and productivity
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Works on desktop and mobile devices
- **Local Storage**: All data is stored locally in the browser for offline use

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

The app will open in your browser at `http://localhost:3000`.

## Data Storage

This application uses **localStorage** for data persistence in local development. All projects and tasks are stored in the browser's localStorage with the following keys:

- `taskmanager_projects`: Stores all project data
- `taskmanager_tasks`: Stores all task data
- `selectedProjectId`: Currently selected project
- `theme`: Dark/light mode preference
- `backgroundType`: Background animation preference
- `fontFamily`: Selected font family
- `fontSize`: Selected font size
- `glitchOnHover`: Glitch effect preference

## API Structure

The app uses a localStorage-based API that mimics RESTful endpoints:

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

- `npm start` - Start the development server
- `npm build` - Build the app for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Project Structure

```
frontend/
├── public/          # Static assets
├── src/
│   ├── api.js       # localStorage-based API implementation
│   ├── App.js       # Main application component
│   ├── components/  # React components
│   └── styles/      # CSS files
└── package.json
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
- localStorage API
- CSS Grid and Flexbox
- Modern CSS features

## Data Persistence

All data is stored locally in the browser's localStorage. This means:
- Data persists between browser sessions
- No server required for local development
- Data is not shared between different browsers/devices
- Clearing browser data will remove all stored information

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 