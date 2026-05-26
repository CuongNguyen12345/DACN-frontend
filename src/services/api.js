import axios from "axios";
import { API_BASE_URL } from "./apiConfig";
import { getAuthToken } from "./authToken";

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
