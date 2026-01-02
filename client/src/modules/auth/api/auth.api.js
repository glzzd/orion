import api from "@/lib/axios";
import { ENDPOINTS } from "@/consts/apiEndpoints";

export const loginUser = async (identifier, password) => {
  const response = await api.post(ENDPOINTS.AUTH.LOGIN, { identifier, password });
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post(ENDPOINTS.AUTH.REGISTER, userData);
  return response.data;
};

export const refreshToken = async (refreshToken) => {
  const response = await api.post(ENDPOINTS.AUTH.REFRESH, { refreshToken });
  return response.data;
};
