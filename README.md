# Task Management Dashboard

## Features
- **Project Management**: Create, update, delete, and color-code multiple projects. Each project can have its own set of tasks and visual identity.
- **Task Management**: Add, edit, delete, and drag-and-drop tasks between different statuses (e.g., To Do, In Progress, Done) and priorities (High, Medium, Low). Assign tasks to projects and manage their lifecycle easily.
- **Recurring Tasks**: Set up tasks to repeat on a daily, weekly, or custom schedule, so you never miss a routine activity.
- **Unified Calendar View**: Visualize all tasks across projects in a single calendar (monthly/weekly views). Quickly see deadlines, upcoming tasks, and overdue items.
- **Analytics Dashboard**: Get insights into your productivity with charts and stats, such as completed tasks, overdue items, and project progress.
- **Dark Mode & Customization**: Toggle dark mode for comfortable viewing. Customize fonts, backgrounds (including animated/space themes), and UI elements to suit your style.
- **Keyboard Navigation & Accessibility**: Navigate the app efficiently using keyboard shortcuts. Enhanced accessibility for users with different needs.
- **Persistent Data**: 
  - **Local Development:** All project and task data is stored in your browser's localStorage for fast, offline-friendly prototyping.
  - **Production:** Data is stored securely in a MongoDB backend for real-time, multi-device access.
- **Responsive Design**: Fully responsive layout works seamlessly on desktops, tablets, and mobile devices.
- **Notifications & Toasts**: Get instant feedback on your actions (e.g., task created, error messages) with non-intrusive toast notifications.
- **Calendar Integration**: Drag and drop tasks directly on the calendar to change due dates (if enabled).
- **Customizable Views**: Filter and sort tasks by project, priority, status, assignee, due date, and more. Search for tasks by keyword.
- **Modern UI/UX**: Clean, animated, and visually appealing interface with a space/astronaut theme.
- **No Backend Required for Local Use**: Start the app locally and use all features without setting up a backend or database.

---

## Getting Started (Local Development)

### Prerequisites
- Node.js (v18+ recommended)

### Quick Start
```sh
git clone https://github.com/ronilborah/TaskManagementDashboard.git
cd TaskManagementDashboard
cd client
npm install
npm start
```
- Open [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal) in your browser.
- All data will be stored in your browser's localStorage.


---

## Tech Stack
- **Frontend**: React, React Router, React DnD, TailwindCSS, Framer Motion, React Toastify, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Deployment**: Frontend on Vercel, Backend on Render

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
