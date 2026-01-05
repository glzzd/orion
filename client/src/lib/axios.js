import axios from "axios";
import { API_BASE_URL, ENDPOINTS } from "@/consts/apiEndpoints";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error || {};
    if (!response || !config) return Promise.reject(error);
    if (response.status !== 401) return Promise.reject(error);
    if (config._retry) return Promise.reject(error);
    const url = config.url || "";
    if (url.includes(ENDPOINTS.AUTH.LOGIN) || url.includes(ENDPOINTS.AUTH.REFRESH)) {
      return Promise.reject(error);
    }
    const hasLocal = !!localStorage.getItem("refreshToken");
    const storage = hasLocal ? localStorage : sessionStorage;
    const rToken = storage.getItem("refreshToken");
    if (!rToken) {
      localStorage.removeItem("authUser");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      sessionStorage.removeItem("authUser");
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
      window.location.href = "/auth/login";
      return Promise.reject(error);
    }
    try {
      const refreshRes = await axios.post(`${API_BASE_URL}${ENDPOINTS.AUTH.REFRESH}`, { refreshToken: rToken }, { headers: { "Content-Type": "application/json" } });
      const { token, refreshToken } = refreshRes.data || {};
      if (!token || !refreshToken) {
        throw new Error("Refresh failed");
      }
      storage.setItem("accessToken", token);
      storage.setItem("refreshToken", refreshToken);
      config.headers.Authorization = `Bearer ${token}`;
      config._retry = true;
      return api.request(config);
    } catch (err) {
      localStorage.removeItem("authUser");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      sessionStorage.removeItem("authUser");
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
      window.location.href = "/auth/login";
      return Promise.reject(err);
    }
  }
);

export default api;
