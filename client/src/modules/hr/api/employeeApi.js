import api from "@/lib/axios";

const BASE_PATH = "/hr/employees";

export const getAllEmployees = async (params) => {
  const { data } = await api.get(BASE_PATH, { params });
  return data;
};

export const getEmployeeById = async (id) => {
  const { data } = await api.get(`${BASE_PATH}/${id}`);
  return data;
};

export const getAllOrganizations = async () => {
  const { data } = await api.get("/organizations");
  return data;
};

export const getAllRoles = async (tenantId) => {
  const params = tenantId ? { tenantId } : {};
  const { data } = await api.get("/rbac/roles", { params });
  return data;
};

export const getAllOrgUnits = async (tenantId) => {
  const params = tenantId ? { tenantId } : {};
  const { data } = await api.get("/org-units", { params });
  return data;
};
