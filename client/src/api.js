import axios from 'axios';
import { toast } from 'react-toastify';

// The base URL should be a relative path to work with the proxy in development.
// In production, it will be replaced by the environment variable.
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Create an Axios instance
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

export default api; 