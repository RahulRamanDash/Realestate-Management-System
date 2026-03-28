import axios from "axios";
import { clearSession, getAccessToken, getRefreshToken, setSession } from "../utils/auth";

const resolveApiBaseUrl = () => {
  const envBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  if (envBaseUrl) {
    return envBaseUrl.replace(/\/+$/, "");
  }

  if (import.meta.env.DEV) {
    return "http://localhost:8080";
  }

  return window.location.origin;
};

export const API_BASE_URL = resolveApiBaseUrl();

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 15000,
});

const authApi = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 15000,
});

let refreshPromise = null;

// Attach Access Token to every request
api.interceptors.request.use((config) => {
  const token = getAccessToken();
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
    const status = error?.response?.status;
    const requestUrl = originalRequest?.url || "";

    if (!originalRequest || requestUrl.includes("/auth/refresh") || requestUrl.includes("/auth/login")) {
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error("Missing refresh token");
        }

        if (!refreshPromise) {
          refreshPromise = authApi
            .post("/auth/refresh", { refreshToken })
            .then((res) => {
              setSession(res.data);
              return res.data.accessToken;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const nextAccessToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
        return api(originalRequest);
      } catch {
        clearSession();
        if (window.location.pathname !== "/userAuth") {
          window.location.href = "/userAuth";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
