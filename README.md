# Task Management Dashboard

## Features
- **Project Management**: Create, update, delete, and color-code multiple projects. Each project can have its own set of tasks and visual identity.
- **Task Management**: Add, edit, delete, and drag-and-drop tasks between different statuses (e.g., To Do, In Progress, Done) and priorities (High, Medium, Low). Assign tasks to projects and manage their lifecycle easily.
- **Recurring Tasks**: Set up tasks to repeat on a daily, weekly, or custom schedule, so you never miss a routine activity.
- **Calendar View**: Visualize tasks in a single calendar (monthly/weekly views). Quickly see deadlines, upcoming tasks, and overdue items.
- **Dark Mode & Customization**: Toggle dark mode for comfortable viewing. Customize backgrounds including animated ones to suit your style.
- **Keyboard Navigation & Accessibility**: Navigate the app efficiently using keyboard shortcuts. Enhanced accessibility for users with different needs.
- **Persistent Data**: 
  - **Local Development:** All project and task data is stored in your browser's localStorage for fast, offline-friendly prototyping.
  - **Production:** Data is stored securely in a MongoDB backend for real-time, multi-device access.
- **Responsive Design**: Intuitive responsive design for desktop.
- **Customizable Views**: Filter and sort tasks by project, priority, status, assignee, due date, and more. Search for tasks by keyword.
- **Modern UI/UX**: Clean, animated, and visually appealing interface.
- **Grid View**: Grid view for viewing all tasks at a single glance.
- **No Backend Required for Local Use**: Start the app locally and use all features without setting up a backend or database.

---

## Getting Started (Local Development)

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
- **Frontend**: React, React Router, React DnD, TailwindCSS, Framer Motion, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Deployment**: Frontend on Vercel, Backend on Render

## AI Tools used
During the development of this project, several AI tools were utilized to enhance productivity and streamline the development process:
- v0.dev – Used to generate and prototype UI components quickly, which served as a base for several front-end elements.
- Claude – Assisted in drafting and refining parts of the backend logic, helping to structure API routes and handle server-side functionality.
- Cursor – Used as an AI-powered coding assistant to integrate and refactor various code components into a cohesive, functional project.

These tools significantly accelerated the development timeline and supported a smoother transition from ideation to implementation.

