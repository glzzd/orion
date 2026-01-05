import api from "@/lib/axios";

export const getAllOrganizations = async () => {
  const { data } = await api.get("/organizations");
  return data;
};

export const createOrganization = async (orgData) => {
  const { data } = await api.post("/organizations", orgData);
  return data;
};

export const getOrganizationById = async (id) => {
  const { data } = await api.get(`/organizations/${id}`);
  return data;
};

export const updateOrganization = async (id, orgData) => {
  const { data } = await api.put(`/organizations/${id}`, orgData);
  return data;
};
