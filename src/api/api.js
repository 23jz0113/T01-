// src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // ← Laravel の URL
  withCredentials: true,            // ← Cookie 認証必須
});

export default api;
