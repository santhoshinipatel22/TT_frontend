import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response error handler to extract meaningful error message
export const getErrorMessage = (error) => {
  if (error.response && error.response.data) {
    const data = error.response.data;
    if (data.errors && typeof data.errors === 'object') {
      const fieldErrors = Object.entries(data.errors)
        .map(([field, msg]) => `${field}: ${msg}`)
        .join(', ');
      return fieldErrors || data.message || 'Validation error';
    }
    return data.message || error.message || 'Server error';
  }
  return error.message || 'Network error or backend is not running';
};

// Dashboard APIs
export const fetchDashboardSummary = async () => {
  const response = await apiClient.get('/dashboard/summary');
  return response.data;
};

// Material APIs
export const fetchMaterials = async (search = '', category = '') => {
  const params = {};
  if (search) params.search = search;
  if (category && category !== 'ALL') params.category = category;
  const response = await apiClient.get('/materials', { params });
  return response.data;
};

export const fetchMaterialById = async (id) => {
  const response = await apiClient.get(`/materials/${id}`);
  return response.data;
};

export const fetchLowStockMaterials = async () => {
  const response = await apiClient.get('/materials/low-stock');
  return response.data;
};

export const createMaterial = async (materialData) => {
  const response = await apiClient.post('/materials', materialData);
  return response.data;
};

export const updateMaterial = async (id, materialData) => {
  const response = await apiClient.put(`/materials/${id}`, materialData);
  return response.data;
};

export const deleteMaterial = async (id) => {
  const response = await apiClient.delete(`/materials/${id}`);
  return response.data;
};

// Consumption APIs
export const recordConsumption = async (consumptionData) => {
  const response = await apiClient.post('/consumption', consumptionData);
  return response.data;
};

export const fetchConsumptions = async () => {
  const response = await apiClient.get('/consumption');
  return response.data;
};

export default apiClient;
