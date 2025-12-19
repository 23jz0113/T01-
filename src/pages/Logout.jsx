import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout({ onLogout }) {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      const token = localStorage.getItem("token");

      // サーバー側でトークンを無効化
      if (token) {
        try {
          await fetch("https://style.mydns.jp/T01/api/logout", {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          });
        } catch (error) {
          // APIエラーが発生してもクライアントのログアウト処理は続行
          console.error("Logout API call failed:", error);
        }
      }

      // クライアント側のセッションをクリア
      onLogout();
      
      // 遅延後にログインページへリダイレクト
      const timer = setTimeout(() => {
        navigate("/");
      }, 1500);

      return () => clearTimeout(timer);
    };

    performLogout();

  }, [onLogout, navigate]);

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