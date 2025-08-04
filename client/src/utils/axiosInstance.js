import axios from 'axios';
import { BASE_URL } from './apiPaths';

// Create an Axios instance for making API requests
// This instance can be used throughout the application to ensure consistent configuration
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Add request interceptor to the Axios instance
// This allows to modify requests before they are sent, such as adding authentication tokens
axiosInstance.interceptors.request.use(
    (config) => {
        // Can add any request interceptors here, such as adding authentication tokens
        const accessToken = localStorage.getItem('token'); // Example: get token from local storage
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);


axiosInstance.interceptors.response.use(
    (response) => {
        // Handle successful responses
        return response;
    },
    (error) => {
        // Handle common errors globally
        if (error.response) {
            if (error.response.status === 401) {
                // Handle unauthorized access, e.g., redirect to login page
                window.location.href = '/login'; // Example redirect
            } else if (error.response.status === 500) {
                console.error('Internal server error. Please try again later');
            }
        } else if (error.code === 'ECONNABORTED') {
            console.error('Request timed out. Please check your network connection');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
