// src/api/api.jsx
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // ← 環境変数からAPIのURLを読み込む
  withCredentials: true, // ← Cookie 認証もする場合、残しておく
});

// リクエストインターセプターを追加
api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// レスポンスインターセプターを追加
api.interceptors.response.use(
  (response) => {
    // 成功したレスポンスはそのまま返す
    return response;
  },
  (error) => {
    // 認証エラー (401) を検知した場合
    if (error.response && error.response.status === 401) {
      // sessionStorageからトークンとユーザー情報を削除
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      // ログインページにリダイレクト
      // 無限ループを防ぐため、すでにログインページにいる場合はリダイレクトしない
      if (window.location.pathname !== '/admin/') {
        window.location.href = '/admin';
      }
    }
    // その他のエラーはそのままPromise.rejectでエラー処理フローに渡す
    return Promise.reject(error);
  }
);

export default api;
