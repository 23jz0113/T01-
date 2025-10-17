// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "admin@example.com" && password === "admin123") {
      onLogin();
      // ★★★ 変更点: 移動先を /dashboard から /event-edit へ変更 ★★★
      navigate("/event-edit"); 
    } else {
      alert("メールアドレスまたはパスワードが間違っています");
    }
  };

  // ... (return文は変更なし)
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-slate-800 mb-6">管理画面ログイン</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="input-label">メールアドレス</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required />
          </div>
          <div>
            <label htmlFor="password" className="input-label">パスワード</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" required />
          </div>
          <button type="submit" className="w-full btn btn-primary py-3 font-bold">ログイン</button>
        </form>
      </div>
    </div>
  );
}