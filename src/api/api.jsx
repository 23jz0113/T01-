// src/api/api.jsx
import axios from "axios";

const api = axios.create({
  baseURL: "https://style.mydns.jp/T01/api", // ← 本番APIのURL
  withCredentials: true, // ← Cookie 認証もする場合、残しておく
});

// リクエストインターセプターを追加
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;
