import axios from "axios";
import { normalizeRole } from "../utils/auth";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// Attach Access Token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 (token expired) by refreshing token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await axios.post("http://localhost:8080/api/auth/refresh", {
          refreshToken,
        });

        const data = res.data;
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        const storedUser = localStorage.getItem("loggedUser");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          localStorage.setItem(
            "loggedUser",
            JSON.stringify({
              ...parsedUser,
              role: normalizeRole(parsedUser.role),
            })
          );
        }

        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/userAuth";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
