import axios from 'axios';

// Create axes instances
export const sessionClient = axios.create({
    baseURL: 'http://localhost:8001', // FastAPI backend port
    headers: {
        'Content-Type': 'application/json',
    },
});

// Optional: Interceptor for adding Auth tokens if required
sessionClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Optional: Interceptor for handling global errors (e.g., 401 Unauthorized)
sessionClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Can trigger global error banners or logging here
            console.error(`API Error: ${error.response.status} - ${error.response.data?.detail || error.message}`);
        }
        return Promise.reject(error);
    }
);
