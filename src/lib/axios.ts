import { useAuthStore } from "@/store/authStore";
import axios, { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";

const axiosInstance = axios.create({
    baseURL: "/api",
});

// Request interceptor
axiosInstance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;

    if (token) {
        // Cek apakah token sudah kedaluwarsa
        try {
            const decodedToken = jwtDecode(token) as { exp: number };
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp < currentTime) {
                // Token sudah kedaluwarsa, logout user
                useAuthStore.getState().logout();
                return config;
            }
        } catch (error) {
            // Token tidak valid, logout user
            console.log(error);
            useAuthStore.getState().logout();
            return config;
        }

        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        // Jika error 401 (Unauthorized), logout user
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
