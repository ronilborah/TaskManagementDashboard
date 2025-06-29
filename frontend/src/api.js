import { toast } from 'react-toastify';

// Determine if we're in development (localhost) or production (deployed)
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = process.env.REACT_APP_API_URL || (isDevelopment ? '/api' : 'https://your-backend-url.com/api');

// localStorage-based API for local development
class LocalStorageAPI {
    constructor() {
        this.projectsKey = 'taskmanager_projects';
        this.tasksKey = 'taskmanager_tasks';
        this.initializeStorage();
    }

    initializeStorage() {
        // Initialize projects if they don't exist
        if (!localStorage.getItem(this.projectsKey)) {
            localStorage.setItem(this.projectsKey, JSON.stringify([]));
        }
        // Initialize tasks if they don't exist
        if (!localStorage.getItem(this.tasksKey)) {
            localStorage.setItem(this.tasksKey, JSON.stringify([]));
        }
    }

    // Generate a unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Projects API
    async getProjects() {
        try {
            const projects = JSON.parse(localStorage.getItem(this.projectsKey) || '[]');
            return { data: { data: projects } };
        } catch (error) {
            throw new Error('Failed to fetch projects');
        }
    }

    async createProject(projectData) {
        try {
            const projects = JSON.parse(localStorage.getItem(this.projectsKey) || '[]');
            const newProject = {
                _id: this.generateId(),
                ...projectData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            projects.push(newProject);
            localStorage.setItem(this.projectsKey, JSON.stringify(projects));
            return { data: { data: newProject } };
        } catch (error) {
            throw new Error('Failed to create project');
        }
    }

    async updateProject(projectId, projectData) {
        try {
            const projects = JSON.parse(localStorage.getItem(this.projectsKey) || '[]');
            const projectIndex = projects.findIndex(p => p._id === projectId);
            if (projectIndex === -1) {
                throw new Error('Project not found');
            }
            projects[projectIndex] = {
                ...projects[projectIndex],
                ...projectData,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem(this.projectsKey, JSON.stringify(projects));
            return { data: { data: projects[projectIndex] } };
        } catch (error) {
            throw new Error('Failed to update project');
        }
    }

    async deleteProject(projectId) {
        try {
            const projects = JSON.parse(localStorage.getItem(this.projectsKey) || '[]');
            const filteredProjects = projects.filter(p => p._id !== projectId);
            localStorage.setItem(this.projectsKey, JSON.stringify(filteredProjects));

            // Also delete all tasks associated with this project
            const tasks = JSON.parse(localStorage.getItem(this.tasksKey) || '[]');
            const filteredTasks = tasks.filter(t => t.projectId !== projectId);
            localStorage.setItem(this.tasksKey, JSON.stringify(filteredTasks));

            return { data: { message: 'Project deleted successfully' } };
        } catch (error) {
            throw new Error('Failed to delete project');
        }
    }

    // Tasks API
    async getTasks(params = {}) {
        try {
            let tasks = JSON.parse(localStorage.getItem(this.tasksKey) || '[]');

            // Strictly require projectId for local mode
            if (!params.projectId) {
                return { data: { data: [] } };
            }

            // Filter by projectId
            tasks = tasks.filter(t => t.projectId === params.projectId);

            if (params.priority) {
                tasks = tasks.filter(t => t.priority === params.priority);
            }
            if (params.status) {
                tasks = tasks.filter(t => t.status === params.status);
            }
            if (params.assignee) {
                tasks = tasks.filter(t => t.assignee && t.assignee.toLowerCase().includes(params.assignee.toLowerCase()));
            }
            if (params.dueDate) {
                tasks = tasks.filter(t => t.dueDate === params.dueDate);
            }
            if (params.search) {
                const searchTerm = params.search.toLowerCase();
                tasks = tasks.filter(t =>
                    t.title.toLowerCase().includes(searchTerm) ||
                    (t.description && t.description.toLowerCase().includes(searchTerm))
                );
            }

            // Apply sorting
            if (params.sortBy) {
                tasks.sort((a, b) => {
                    switch (params.sortBy) {
                        case 'priority':
                            return (b.priority || 0) - (a.priority || 0);
                        case 'dueDate':
                            return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
                        case 'title':
                            return a.title.localeCompare(b.title);
                        case 'status':
                            return a.status.localeCompare(b.status);
                        default:
                            return 0;
                    }
                });
            }

            return { data: { data: tasks } };
        } catch (error) {
            throw new Error('Failed to fetch tasks');
        }
    }

    async createTask(taskData) {
        try {
            const tasks = JSON.parse(localStorage.getItem(this.tasksKey) || '[]');
            const newTask = {
                _id: this.generateId(),
                ...taskData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            tasks.push(newTask);
            localStorage.setItem(this.tasksKey, JSON.stringify(tasks));
            return { data: { data: newTask } };
        } catch (error) {
            throw new Error('Failed to create task');
        }
    }

    async updateTask(taskId, taskData) {
        try {
            const tasks = JSON.parse(localStorage.getItem(this.tasksKey) || '[]');
            const taskIndex = tasks.findIndex(t => t._id === taskId);
            if (taskIndex === -1) {
                throw new Error('Task not found');
            }
            tasks[taskIndex] = {
                ...tasks[taskIndex],
                ...taskData,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem(this.tasksKey, JSON.stringify(tasks));
            return { data: { data: tasks[taskIndex] } };
        } catch (error) {
            throw new Error('Failed to update task');
        }
    }

    async deleteTask(taskId) {
        try {
            const tasks = JSON.parse(localStorage.getItem(this.tasksKey) || '[]');
            const filteredTasks = tasks.filter(t => t._id !== taskId);
            localStorage.setItem(this.tasksKey, JSON.stringify(filteredTasks));
            return { data: { message: 'Task deleted successfully' } };
        } catch (error) {
            throw new Error('Failed to delete task');
        }
    }

    // Generic request method to simulate axios interface
    async request(config) {
        const { method, url, data, params } = config;

        try {
            switch (method.toLowerCase()) {
                case 'get':
                    if (url === '/projects') {
                        return await this.getProjects();
                    } else if (url.startsWith('/tasks')) {
                        return await this.getTasks(params);
                    }
                    break;
                case 'post':
                    if (url === '/projects') {
                        return await this.createProject(data);
                    } else if (url === '/tasks') {
                        return await this.createTask(data);
                    }
                    break;
                case 'put':
                    if (url.startsWith('/projects/')) {
                        const projectId = url.split('/')[2];
                        return await this.updateProject(projectId, data);
                    } else if (url.startsWith('/tasks/')) {
                        const taskId = url.split('/')[2];
                        return await this.updateTask(taskId, data);
                    }
                    break;
                case 'delete':
                    if (url.startsWith('/projects/')) {
                        const projectId = url.split('/')[2];
                        return await this.deleteProject(projectId);
                    } else if (url.startsWith('/tasks/')) {
                        const taskId = url.split('/')[2];
                        return await this.deleteTask(taskId);
                    }
                    break;
                default:
                    throw new Error(`Unsupported method: ${method}`);
            }
        } catch (error) {
            // Simulate axios error response
            const axiosError = {
                response: {
                    data: { message: error.message },
                    status: 400
                },
                request: null,
                message: error.message
            };
            throw axiosError;
        }
    }

    // Simulate axios methods
    async get(url, config = {}) {
        return this.request({ method: 'get', url, ...config });
    }

    async post(url, data, config = {}) {
        return this.request({ method: 'post', url, data, ...config });
    }

    async put(url, data, config = {}) {
        return this.request({ method: 'put', url, data, ...config });
    }

    async delete(url, config = {}) {
        return this.request({ method: 'delete', url, ...config });
    }
}

// MongoDB-based API for production (deployed version)
class MongoDBAPI {
    constructor() {
        this.api = null;
        this.axiosLoaded = false;
    }

    async loadAxios() {
        if (this.axiosLoaded) return;

        try {
            const axios = await import('axios');
            this.api = axios.default.create({
                baseURL: API_BASE_URL,
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            this.axiosLoaded = true;
        } catch (error) {
            console.error('Failed to load axios:', error);
            throw new Error('Failed to initialize API client');
        }
    }

    async request(config) {
        await this.loadAxios();
        return this.api.request(config);
    }

    async get(url, config = {}) {
        return this.request({ method: 'get', url, ...config });
    }

    async post(url, data, config = {}) {
        return this.request({ method: 'post', url, data, ...config });
    }

    async put(url, data, config = {}) {
        return this.request({ method: 'put', url, data, ...config });
    }

    async delete(url, config = {}) {
        return this.request({ method: 'delete', url, ...config });
    }
}

// Choose API based on environment
let api;

if (isDevelopment) {
    console.log('🔧 Using localStorage API for local development');
    api = new LocalStorageAPI();
} else {
    console.log('🚀 Using MongoDB API for production deployment');
    api = new MongoDBAPI();
}

export default api; 