import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("https://style.mydns.jp/T01/api/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "メールまたはパスワードが違います");
        setLoading(false);
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      onLogin();
      navigate("/event-edit");

    } catch (err) {
      setErrorMsg("サーバーに接続できませんでした");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg p-8 rounded-2xl w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-6">管理者ログイン</h2>

        {errorMsg && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
            {errorMsg}
          </div>
        )}

        <label className="block mb-2 font-semibold text-sm">メールアドレス</label>
        <input
          type="email"
          className="w-full p-3 border rounded-lg mb-4 focus:outline-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block mb-2 font-semibold text-sm">パスワード</label>
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-3 pr-12 border rounded-lg focus:outline-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            onMouseDown={() => setShowPassword(true)}
            onMouseUp={() => setShowPassword(false)}
            onMouseLeave={() => setShowPassword(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl shadow"
        >
          {loading ? "ログイン中..." : "ログイン"}
        </button>
      </form>
    </div>
  );
}
