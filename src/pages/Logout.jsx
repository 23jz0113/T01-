import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // 仮ログアウト処理
    alert("ログアウトしました。");
    navigate("/");
  }, [navigate]);

  return null;
}
