import axios from 'axios';
import { toast } from 'react-toastify';

// Determine if we're running locally or deployed
const isLocalDevelopment = window.location.hostname === 'localhost';

// The base URL should be a relative path to work with the proxy in development.
// In production, it will be replaced by the environment variable.
const API_BASE_URL = isLocalDevelopment
    ? '/api'
    : (process.env.REACT_APP_API_URL || 'https://taskmanagementdashboard.onrender.com/api');

// Create an Axios instance for backend API calls
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => {
        // If the response is successful, just return it
        return response;
    },
    (error) => {
        // Check if the error is from a request that was made
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const message = error.response.data.message || 'An unexpected error occurred';
            toast.error(message);
            console.error('API Error:', error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            toast.error('Network Error: Could not connect to the server.');
            console.error('Network Error:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            toast.error('An error occurred while setting up the request.');
            console.error('Request Setup Error:', error.message);
        }

        // Reject the promise to propagate the error
        return Promise.reject(error);
    }
);

// localStorage keys
const STORAGE_KEYS = {
    PROJECTS: 'taskmanager_projects',
    TASKS: 'taskmanager_tasks',
    SELECTED_PROJECT: 'selectedProjectId',
    THEME: 'theme',
    BACKGROUND_TYPE: 'backgroundType',
    FONT_FAMILY: 'fontFamily',
    FONT_SIZE: 'fontSize',
    GLITCH_ON_HOVER: 'glitchOnHover'
};

// localStorage utility functions
const localStorageAPI = {
    // Projects
    getProjects: () => {
        try {
            const projects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
            const parsedProjects = projects ? JSON.parse(projects) : [];
            return parsedProjects;
        } catch (error) {
            console.error('Error reading projects from localStorage:', error);
            return [];
        }
    },

    saveProjects: (projects) => {
        try {
            localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
        } catch (error) {
            console.error('Error saving projects to localStorage:', error);
        }
    },

    // Tasks
    getTasks: () => {
        try {
            const tasks = localStorage.getItem(STORAGE_KEYS.TASKS);
            const parsedTasks = tasks ? JSON.parse(tasks) : [];
            return parsedTasks;
        } catch (error) {
            console.error('Error reading tasks from localStorage:', error);
            return [];
        }
    },

    saveTasks: (tasks) => {
        try {
            localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
        } catch (error) {
            console.error('Error saving tasks to localStorage:', error);
        }
    },

    // Filter tasks based on parameters
    filterTasks: (tasks, filters = {}) => {
        let filteredTasks = [...tasks];

        if (filters.projectId) {
            filteredTasks = filteredTasks.filter(task => task.projectId === filters.projectId);
        }

        if (filters.priority) {
            filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
        }

        if (filters.status) {
            filteredTasks = filteredTasks.filter(task => task.status === filters.status);
        }

        if (filters.assignee) {
            filteredTasks = filteredTasks.filter(task =>
                task.assignee && task.assignee.toLowerCase().includes(filters.assignee.toLowerCase())
            );
        }

        if (filters.dueDate) {
            filteredTasks = filteredTasks.filter(task => task.dueDate === filters.dueDate);
        }

        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredTasks = filteredTasks.filter(task =>
                task.title.toLowerCase().includes(searchTerm) ||
                (task.description && task.description.toLowerCase().includes(searchTerm))
            );
        }

        // Sort tasks
        if (filters.sortBy) {
            filteredTasks.sort((a, b) => {
                switch (filters.sortBy) {
                    case 'priority':
                        const priorityOrder = { high: 3, medium: 2, low: 1 };
                        return priorityOrder[b.priority] - priorityOrder[a.priority];
                    case 'dueDate':
                        return new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31');
                    case 'title':
                        return a.title.localeCompare(b.title);
                    default:
                        return 0;
                }
            });
        }

        return filteredTasks;
    }
};

// Dual-mode API wrapper
const dualModeAPI = {
    // Projects
    getProjects: async () => {
        if (isLocalDevelopment) {
            const projects = localStorageAPI.getProjects();
            return { data: { data: projects } };
        } else {
            return await api.get('/projects');
        }
    },

    postProject: async (projectData) => {
        if (isLocalDevelopment) {
            const projects = localStorageAPI.getProjects();
            const newProject = {
                _id: Date.now().toString(),
                ...projectData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            projects.push(newProject);
            localStorageAPI.saveProjects(projects);
            return { data: { data: newProject } };
        } else {
            return await api.post('/projects', projectData);
        }
    },

    putProject: async (projectId, projectData) => {
        if (isLocalDevelopment) {
            const projects = localStorageAPI.getProjects();
            const projectIndex = projects.findIndex(p => p._id === projectId);
            if (projectIndex !== -1) {
                projects[projectIndex] = {
                    ...projects[projectIndex],
                    ...projectData,
                    updatedAt: new Date().toISOString()
                };
                localStorageAPI.saveProjects(projects);
                return { data: { data: projects[projectIndex] } };
            }
            throw new Error('Project not found');
        } else {
            return await api.put(`/projects/${projectId}`, projectData);
        }
    },

    deleteProject: async (projectId) => {
        if (isLocalDevelopment) {
            const projects = localStorageAPI.getProjects();
            const filteredProjects = projects.filter(p => p._id !== projectId);
            localStorageAPI.saveProjects(filteredProjects);

            // Also delete all tasks for this project
            const tasks = localStorageAPI.getTasks();
            const filteredTasks = tasks.filter(t => t.projectId !== projectId);
            localStorageAPI.saveTasks(filteredTasks);

            return { data: { success: true } };
        } else {
            return await api.delete(`/projects/${projectId}`);
        }
    },

    // Tasks
    getTasks: async (params = {}) => {
        if (isLocalDevelopment) {
            const tasks = localStorageAPI.getTasks();
            const filteredTasks = localStorageAPI.filterTasks(tasks, params);
            return { data: { data: filteredTasks } };
        } else {
            const queryString = new URLSearchParams(params).toString();
            return await api.get(`/tasks?${queryString}`);
        }
    },

    postTask: async (taskData) => {
        if (isLocalDevelopment) {
            const tasks = localStorageAPI.getTasks();
            const newTask = {
                _id: Date.now().toString(),
                ...taskData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            tasks.push(newTask);
            localStorageAPI.saveTasks(tasks);
            return { data: { data: newTask } };
        } else {
            return await api.post('/tasks', taskData);
        }
    },

    putTask: async (taskId, taskData) => {
        if (isLocalDevelopment) {
            const tasks = localStorageAPI.getTasks();
            const taskIndex = tasks.findIndex(t => t._id === taskId);
            if (taskIndex !== -1) {
                tasks[taskIndex] = {
                    ...tasks[taskIndex],
                    ...taskData,
                    updatedAt: new Date().toISOString()
                };
                localStorageAPI.saveTasks(tasks);
                return { data: { data: tasks[taskIndex] } };
            }
            throw new Error('Task not found');
        } else {
            return await api.put(`/tasks/${taskId}`, taskData);
        }
    },

    deleteTask: async (taskId) => {
        if (isLocalDevelopment) {
            const tasks = localStorageAPI.getTasks();
            const filteredTasks = tasks.filter(t => t._id !== taskId);
            localStorageAPI.saveTasks(filteredTasks);
            return { data: { success: true } };
        } else {
            return await api.delete(`/tasks/${taskId}`);
        }
    },

    // Health check
    health: async () => {
        if (isLocalDevelopment) {
            return { data: { success: true, message: 'Local development mode - using localStorage' } };
        } else {
            return await api.get('/health');
        }
    }
};

// Export the dual-mode API
export default dualModeAPI; 