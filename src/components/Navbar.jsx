import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

// LogoutModalは変更なし
const LogoutModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content text-center">
        <h2 className="text-xl font-bold mb-4 text-slate-800">ログアウト確認</h2>
        <p className="mb-6 text-slate-600">本当にログアウトしますか？</p>
        <div className="flex justify-center gap-4">
          <button onClick={onCancel} className="btn btn-secondary w-32">キャンセル</button>
          <button onClick={onConfirm} className="btn btn-danger w-32">ログアウト</button>
        </div>
      </div>
    </div>
  );
};


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  // ★★★ 変更点: セキュリティを削除 ★★★
  const navLinks = [
    { to: "/event-edit", text: "イベント管理" },
    { to: "/user-edit", text: "ユーザー管理" },
    { to: "/announcements", text: "お知らせ管理" },
  ];

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    navigate("/logout");
  };

  return (
    <>
      <nav className="fixed top-0 z-40 w-full bg-slate-800 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <NavLink to="/event-edit" className="text-2xl font-bold tracking-wider">
            管理システム
          </NavLink>
          <ul className="hidden space-x-6 md:flex">
            {navLinks.map((link) => (
              <li key={link.to}><NavLink to={link.to} className="nav-link-desktop">{link.text}</NavLink></li>
            ))}
            <li><button onClick={() => setIsLogoutModalOpen(true)} className="nav-link-desktop">ログアウト</button></li>
          </ul>
          {/* ... (ハンバーガーボタンとスマホメニューは変更なし) ... */}
          <button className="z-50 focus:outline-none md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <div className="relative h-6 w-6">
              <span className={`absolute block h-0.5 w-full bg-white transition-all duration-300 ${isOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-1'}`} />
              <span className={`absolute top-1/2 block h-0.5 w-full -translate-y-1/2 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`absolute block h-0.5 w-full bg-white transition-all duration-300 ${isOpen ? 'bottom-1/2 translate-y-1/2 -rotate-45' : 'bottom-1'}`} />
            </div>
          </button>
        </div>
        <div className={`absolute w-full transform bg-slate-700 transition-all duration-300 ease-in-out md:hidden ${isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}>
          <ul className="flex flex-col p-4">
            {navLinks.map((link) => (
              <li key={link.to}><NavLink to={link.to} className="nav-link-mobile" onClick={() => setIsOpen(false)}>{link.text}</NavLink></li>
            ))}
            <li><button onClick={() => { setIsOpen(false); setIsLogoutModalOpen(true); }} className="nav-link-mobile w-full">ログアウト</button></li>
          </ul>
        </div>
      </nav>
      <LogoutModal isOpen={isLogoutModalOpen} onConfirm={handleLogoutConfirm} onCancel={() => setIsLogoutModalOpen(false)} />
    </>
  );
}