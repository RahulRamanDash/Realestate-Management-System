import api from "../../../api/axiosInstance";

export const getAdminSummary = async () => {
  const response = await api.get("/admin/summary");
  return response.data;
};

export const getAdminUsers = async (params = {}) => {
  const response = await api.get("/admin/users", { params });
  return Array.isArray(response.data) ? response.data : [];
};

export const getAdminUserById = async (userId) => {
  const response = await api.get(`/admin/users/${userId}`);
  return response.data;
};

export const updateAdminUserRole = async (userId, role) => {
  const response = await api.patch(`/admin/users/${userId}/role`, { role });
  return response.data;
};

export const getAdminProperties = async (params = {}) => {
  const response = await api.get("/admin/properties", { params });
  return Array.isArray(response.data) ? response.data : [];
};

export const getAdminPropertyById = async (propertyId) => {
  const response = await api.get(`/admin/properties/${propertyId}`);
  return response.data;
};

export const reassignAdminProperty = async (propertyId, agentId) => {
  const response = await api.patch(`/admin/properties/${propertyId}/reassign-agent`, { agentId });
  return response.data;
};
