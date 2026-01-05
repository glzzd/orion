import api from "@/lib/axios";

export const getAllRoles = async (tenantId) => {
  const params = tenantId ? { tenantId } : {};
  const { data } = await api.get("/rbac/roles", { params });
  return data;
};

export const createRole = async (roleData) => {
  const { data } = await api.post("/rbac/roles", roleData);
  return data;
};

export const getAllPermissions = async (tenantId) => {
  const params = tenantId ? { tenantId } : {};
  const { data } = await api.get("/rbac/permissions", { params });
  return data;
};

export const getAllOrganizations = async () => {
  const { data } = await api.get("/organizations");
  return data;
};
