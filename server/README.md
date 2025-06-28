# Task Management System - Backend API

A robust Express.js backend API for the Task Management System with MongoDB integration.

## Features

- **Project Management**: Create, read, update, and delete projects
- **Task Management**: Full CRUD operations for tasks with filtering and sorting
- **Advanced Filtering**: Filter tasks by project, priority, status, assignee, and search
- **Drag & Drop Support**: Special endpoint for updating task status
- **Data Validation**: Comprehensive input validation and error handling
- **MongoDB Integration**: Efficient database operations with Mongoose ODM

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (ready for implementation)
- **Validation**: Built-in Mongoose validation
- **CORS**: Cross-origin resource sharing enabled

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Clone the repository** (if not already done)
2. **Navigate to the server directory**:
   ```bash
   cd server
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up environment variables**:
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=8000
   MONGODB_URI=mongodb://localhost:27017/task-management
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

5. **Start MongoDB** (if using local instance):
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # Or start manually
   mongod
   ```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:8000`

## API Endpoints

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create a new project |
| GET | `/api/projects/:id` | Get a specific project |
| PUT | `/api/projects/:id` | Update a project |
| DELETE | `/api/projects/:id` | Delete a project |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks (with filtering) |
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks/:id` | Get a specific task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
| PATCH | `/api/tasks/:id/status` | Update task status (drag & drop) |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health status |

## Query Parameters for Tasks

The `/api/tasks` endpoint supports the following query parameters:

- `projectId`: Filter by project ID
- `priority`: Filter by priority (High, Medium, Low)
- `status`: Filter by status (To Do, In Progress, Done)
- `assignee`: Filter by assignee name (case-insensitive)
- `search`: Search in title and description (case-insensitive)
- `sortBy`: Sort by (priority, dueDate, title, createdAt)

### Example Requests

```bash
# Get all tasks for a specific project
GET /api/tasks?projectId=507f1f77bcf86cd799439011

# Get high priority tasks
GET /api/tasks?priority=High

# Search for tasks containing "bug"
GET /api/tasks?search=bug

# Get tasks sorted by due date
GET /api/tasks?sortBy=dueDate

# Combine multiple filters
GET /api/tasks?projectId=507f1f77bcf86cd799439011&priority=High&status=In Progress
```

## Data Models

### Project Schema
```javascript
{
  name: String (required, max 100 chars),
  description: String (max 500 chars),
  color: String (hex color, default: #3B82F6),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Schema
```javascript
{
  title: String (required, max 200 chars),
  description: String (max 1000 chars),
  priority: String (enum: High, Medium, Low),
  status: String (enum: To Do, In Progress, Done),
  assignee: String (max 100 chars),
  dueDate: Date (optional, cannot be in past),
  projectId: ObjectId (required, ref: Project),
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

The API returns consistent error responses:

```javascript
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `500`: Internal Server Error

## Development

### Project Structure
```
server/
├── config/
│   └── db.js          # Database connection
├── controllers/
│   ├── projectController.js
│   └── taskController.js
├── models/
│   ├── Project.js
│   └── Task.js
├── routes/
│   ├── projects.js
│   └── tasks.js
├── middleware/        # For future middleware
├── server.js         # Main server file
├── package.json
└── README.md
```

### Adding New Features

1. **Models**: Add new schemas in `models/`
2. **Controllers**: Add business logic in `controllers/`
3. **Routes**: Define endpoints in `routes/`
4. **Middleware**: Add custom middleware in `middleware/`

## Deployment

### Environment Variables for Production
```env
PORT=8000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-management
JWT_SECRET=your-production-secret-key
NODE_ENV=production
```

### Recommended Platforms
- **Render**: Easy deployment with MongoDB Atlas
- **Railway**: Good for full-stack apps
- **Heroku**: Classic choice (requires MongoDB Atlas)
- **Vercel**: Serverless functions

## Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include input validation
4. Test all endpoints
5. Update documentation

## License

ISC License 