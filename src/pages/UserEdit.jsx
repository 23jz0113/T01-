import React, { useState, useEffect } from "react";

/* --- アイコン --- */
const IconEdit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IconSearch = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

/* --- トースト通知 --- */
const Toast = ({ message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);
  const bgColor = type === "success" ? "bg-sky-500" : "bg-rose-500";
  return <div className={`fixed top-5 right-5 z-[100] rounded-lg px-4 py-3 text-white shadow-lg ${bgColor}`}>{message}</div>;
};

/* --- メイン --- */
const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({ message: "", type: "", visible: false });

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost/T01/public/api/users/public");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      showToast("取得失敗", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (message, type = "success") => setToast({ message, type, visible: true });

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (activeTab === "all") return true;
    if (activeTab === "general") return u.statuses_id === 1;
    if (activeTab === "verified") return u.statuses_id !== 1;
    return true;
  });

  const getStatusBadge = (user) => (
    <span
      className={`px-2 py-1 rounded-full text-sm font-semibold ${
        user.statuses_id === 1 ? "bg-slate-200 text-slate-700" : "bg-sky-500 text-white"
      }`}
    >
      {user.statuses_id === 1 ? "一般ユーザー" : "認証ユーザー"}
    </span>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      {toast.visible && <Toast {...toast} onDismiss={() => setToast({ ...toast, visible: false })} />}

      <div className="mx-auto max-w-7xl bg-white rounded-2xl p-6 shadow-lg sm:p-8">
        {/* ヘッダー */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">ユーザー管理</h1>
            <p className="text-slate-500 mt-1">登録ユーザーを検索・確認・編集できます。</p>
          </div>
        </div>

        {/* タブ */}
        <div className="my-6 flex justify-center">
          <div className="tab-group flex gap-2">
            {["all", "general", "verified"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-item ${activeTab === tab ? "tab-item-active" : "tab-item-inactive"}`}
              >
                {tab === "all" ? "全ユーザー" : tab === "general" ? "一般ユーザー" : "認証ユーザー"}
              </button>
            ))}
          </div>
        </div>

        {/* 検索バー */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-full sm:w-96">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <IconSearch />
            </span>
            <input
              type="text"
              placeholder="ユーザー名またはメールで検索..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
            />
          </div>
        </div>

        {/* 一覧 */}
        <div className="space-y-4">
          {filteredUsers.length ? (
            filteredUsers.map((user) => (
              <div key={user.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white rounded-2xl shadow-lg border border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div>
                    <p className="font-bold text-lg text-slate-800">{user.username}</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                  {getStatusBadge(user)}
                </div>
                <div className="flex gap-2 mt-3 sm:mt-0">
                  <button className="btn btn-ghost flex items-center gap-1 text-sky-600 hover:text-sky-800">
                    <IconEdit /> 編集
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-10 border-2 border-dashed rounded-2xl text-slate-400">
              <p className="font-bold">該当ユーザーがいません</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
