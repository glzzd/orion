import api from "@/lib/axios";

const BASE_PATH = "/admin/users";

export const getAllUsers = async (params) => {
  const { data } = await api.get(BASE_PATH, { params });
  return data;
};

export const getUserById = async (id) => {
  const { data } = await api.get(`${BASE_PATH}/${id}`);
  return data;
};

export const createUser = async (userData) => {
  const { data } = await api.post(BASE_PATH, userData);
  return data;
};

export const updateUser = async (id, userData) => {
  const { data } = await api.put(`${BASE_PATH}/${id}`, userData);
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await api.delete(`${BASE_PATH}/${id}`);
  return data;
};

export const getAllRoles = async () => {
  const { data } = await api.get("/rbac/roles");
  return data;
};

export const getAllOrgUnits = async () => {
  const { data } = await api.get("/org-units");
  return data;
};
