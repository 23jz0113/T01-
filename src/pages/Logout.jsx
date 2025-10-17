import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// App.jsxからonLogout関数を受け取る
export default function Logout({ onLogout }) {
  const navigate = useNavigate();

  useEffect(() => {
    onLogout(); // ★App.jsxのisLoggedInをfalseにする
    
    const timer = setTimeout(() => {
      navigate("/"); // ログインページへリダイレクト
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate, onLogout]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-700">
          ログアウトしました
        </h1>
        <p className="mt-2 text-slate-500">
          ログインページへ移動します。
        </p>
      </div>
    </div>
  );
}