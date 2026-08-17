import axios from "axios";

const API_URL = "https://workflow-dependency-debugger.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export async function getAutomations() {
  const response = await api.get("/api/automations");
  return response.data;
}

export async function getFields() {
  const response = await api.get("/api/fields");
  return response.data;
}

export async function getImpact(fieldId) {
  const response = await api.get(`/api/impact/${fieldId}`);
  return response.data;
}

export async function getCycles() {
  const response = await api.get("/api/dependencies/cycles");
  return response.data;
}

export default api;