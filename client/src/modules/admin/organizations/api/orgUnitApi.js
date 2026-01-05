import api from "@/lib/axios";

export const getAllOrgUnits = async (tenantId) => {
  const params = tenantId ? { tenantId } : {};
  const { data } = await api.get("/org-units", { params });
  return data;
};

export const createOrgUnit = async (payload) => {
  const { data } = await api.post("/org-units", payload);
  return data;
};

export const updateOrgUnit = async (id, payload) => {
  const { data } = await api.put(`/org-units/${id}`, payload);
  return data;
};
