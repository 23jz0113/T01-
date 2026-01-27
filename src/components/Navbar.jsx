// Navbar.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

// ログアウト確認モーダル
const LogoutModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl text-center">
        <h2 className="text-xl font-bold mb-4 text-slate-800">ログアウト確認</h2>
        <p className="mb-6 text-slate-600">本当にログアウトしますか？</p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={onCancel} 
            className="w-32 rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 transition"
          >
            キャンセル
          </button>
          <button 
            onClick={onConfirm} 
            className="w-32 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition"
          >
            ログアウト
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Navbar({ onLogout }) {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  // sessionStorage からユーザー情報を取得
  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  if (!user) return null; // ログインしていなければ表示しない

  const username = user.username;

  const navLinks = [
    { to: "/event-edit", text: "イベント管理" },
    { to: "/user-edit", text: "ユーザー管理" },
    { to: "/brands-categories", text: "ブランド・カテゴリー" },
  ];

  const handleLogoutConfirm = () => {
    sessionStorage.clear();
    if (onLogout) onLogout();
    setIsLogoutModalOpen(false);
    navigate("/logout");
  };

  return (
    <>
      <nav className="fixed top-0 z-40 w-full bg-slate-800 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          {/* 左: ロゴ + ユーザー名 */}
          <div className="flex items-center gap-4">
            <NavLink to="/event-edit" className="text-2xl font-bold tracking-wider">
              管理システム
            </NavLink>
            <div className="flex items-center gap-2 bg-slate-700 px-3 py-1 rounded-full text-sm">
              <div className="h-6 w-6 rounded-full bg-slate-400 flex items-center justify-center text-xs font-bold">
                {username[0]?.toUpperCase() || "A"}
              </div>
              <span>{username}</span>
            </div>
          </div>

          {/* デスクトップメニュー */}
          <ul className="hidden space-x-6 md:flex items-center">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className="nav-link-desktop">{link.text}</NavLink>
              </li>
            ))}
            <li>
              <button onClick={() => setIsLogoutModalOpen(true)} className="nav-link-desktop">
                ログアウト
              </button>
            </li>
          </ul>

          {/* ハンバーガーメニュー */}
          <button className="z-50 focus:outline-none md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <div className="relative h-6 w-6">
              <span className={`absolute block h-0.5 w-full bg-white transition-all duration-300 ${isOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-1'}`} />
              <span className={`absolute top-1/2 block h-0.5 w-full -translate-y-1/2 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`absolute block h-0.5 w-full bg-white transition-all duration-300 ${isOpen ? 'bottom-1/2 translate-y-1/2 -rotate-45' : 'bottom-1'}`} />
            </div>
          </button>
        </div>

        {/* スマホ用メニュー */}
        <div className={`absolute w-full transform bg-slate-700 transition-all duration-300 ease-in-out md:hidden ${isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}>
          <ul className="flex flex-col p-4">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className="nav-link-mobile" onClick={() => setIsOpen(false)}>
                  {link.text}
                </NavLink>
              </li>
            ))}
            <li>
              <button onClick={() => { setIsOpen(false); setIsLogoutModalOpen(true); }} className="nav-link-mobile w-full">
                ログアウト
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* ログアウトモーダル */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
}
