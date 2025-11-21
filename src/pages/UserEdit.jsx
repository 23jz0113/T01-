import React, { useState, useEffect } from "react";

/* --- アイコン --- */
const IconEdit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
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

/* --- ユーザー編集モーダル --- */
const UserFormModal = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState({ username: "", email: "", status: 1 });

  useEffect(() => {
    if (user) setFormData({ username: user.username, email: user.email, status: user.statuses_id });
  }, [user]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = () => onSave(formData);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content p-6 rounded-2xl bg-white shadow-lg max-w-md mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-slate-800">ユーザー編集</h2>
        <div className="space-y-4">
          <div>
            <label className="input-label">ユーザー名</label>
            <input name="username" value={formData.username} onChange={handleChange} className="input-field w-full" />
          </div>
          <div>
            <label className="input-label">メール</label>
            <input name="email" value={formData.email} onChange={handleChange} className="input-field w-full" />
          </div>
          <div>
            <label className="input-label">ステータス</label>
            <select name="status" value={formData.status} onChange={handleChange} className="input-field w-full">
              <option value={1}>一般ユーザー</option>
              <option value={2}>認証ユーザー</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button onClick={onClose} className="btn btn-secondary">キャンセル</button>
            <button onClick={handleSubmit} className="btn btn-success">保存する</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- 削除確認モーダル --- */
const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="modal-overlay" onClick={onCancel}>
    <div className="modal-content p-6 rounded-2xl bg-white shadow-lg max-w-sm mx-auto" onClick={(e) => e.stopPropagation()}>
      <h2 className="text-xl font-bold text-slate-800 mb-4">確認</h2>
      <p className="text-slate-700 mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="btn btn-secondary">キャンセル</button>
        <button onClick={onConfirm} className="btn btn-rose-500">削除する</button>
      </div>
    </div>
  </div>
);

const UserPage = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({ message: "", type: "", visible: false });
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [notices, setNotices] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  /* --- API取得 --- */
  const fetchUsers = async () => {
    try {
      const res = await fetch("https://style.mydns.jp/T01/api/users");
      const data = await res.json();
      const limited = data.slice(0, 100);
      setAllUsers(limited);
      setUsers(limited);
    } catch (err) {
      console.error(err);
      showToast("ユーザー取得失敗", "error");
    }
  };

  const fetchNotices = async () => {
    try {
      const res = await fetch("https://style.mydns.jp/T01/api/notices");
      const data = await res.json();
      setNotices(data);
    } catch (err) {
      console.error(err);
      showToast("通報データ取得失敗", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchNotices();
  }, []);

  const showToast = (message, type = "success") =>
    setToast({ message, type, visible: true });

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (!value.trim()) {
      setUsers(allUsers);
      return;
    }

    const localHit = allUsers.filter((u) =>
      (u.username + u.email).toLowerCase().includes(value.toLowerCase())
    );

    if (localHit.length > 0) {
      setUsers(localHit);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      setUsers(allUsers);
      showToast("全ユーザーに戻しました");
      return;
    }

    const localHit = allUsers.filter((u) =>
      (u.username + u.email).toLowerCase().includes(search.toLowerCase())
    );

    if (localHit.length > 0) return;

    try {
      const res = await fetch("https://style.mydns.jp/T01/api/users/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: search }),
      });

      const data = await res.json();
      setUsers(data.slice(0, 100));
      setPage(1);
      showToast("検索しました");
    } catch (err) {
      console.error(err);
      showToast("検索失敗", "error");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSave = (data) => {
    console.log("保存データ", data);
    setIsModalOpen(false);
    showToast("ユーザー情報を保存しました");
    fetchUsers();
  };

  /* --- 削除処理 --- */
  const handleDeleteClick = (user) => {
    setDeletingUser(user);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await fetch(`https://style.mydns.jp/T01/api/users/destroy/${deletingUser.id}`, { method: "DELETE" });
      showToast(`${deletingUser.username} を削除しました`, "success");
      setConfirmOpen(false);
      setDeletingUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      showToast("削除失敗", "error");
    }
  };

  const handleDeleteCancel = () => {
    setConfirmOpen(false);
    setDeletingUser(null);
  };

  /* --- 通報理由 --- */
  const getReportReason = (user) => {
    if (user.statuses_id === 3) return null; // 管理者は非表示
    const notice = notices.find(n => n.user_id === user.id);
    return notice ? notice.reason : null;
  };

  /* --- フィルター --- */
  const filteredUsers = users.filter((u) => {
    if (u.statuses_id === 3) return false; // 管理者除外
    if (activeTab === "general") return u.statuses_id === 1;
    if (activeTab === "verified") return u.statuses_id === 2;
    if (activeTab === "reported") return notices.some(n => n.user_id === u.id);
    return true;
  });

  /* --- ページネーション --- */
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const getStatusBadge = (user) => {
    if (user.statuses_id === 1) {
      return <span className="px-2 py-1 rounded-full text-sm font-semibold bg-slate-200 text-slate-700">一般ユーザー</span>;
    } else if (user.statuses_id === 2) {
      return <span className="px-2 py-1 rounded-full text-sm font-semibold bg-sky-500 text-white">認証ユーザー</span>;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      {toast.visible && <Toast {...toast} onDismiss={() => setToast({ ...toast, visible: false })} />}

      <div className="mx-auto max-w-7xl bg-white rounded-2xl p-6 shadow-lg sm:p-8">
        {/* ヘッダー */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">ユーザー管理</h1>
            <p className="text-slate-500 mt-1">登録ユーザーを検索・確認できます。</p>
          </div>
        </div>

        {/* タブ */}
        <div className="my-6 flex justify-center">
          <div className="tab-group flex gap-2">
            {["all", "general", "verified", "reported"].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setPage(1); }}
                className={`tab-item ${activeTab === tab ? "tab-item-active" : "tab-item-inactive"}`}
              >
                {tab === "all" ? "全ユーザー"
                  : tab === "general" ? "一般ユーザー"
                  : tab === "verified" ? "認証ユーザー"
                  : "通報ユーザー"}
              </button>
            ))}
          </div>
        </div>

        {/* 検索バー */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-6">
          <div className="relative w-full sm:w-96">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <IconSearch />
            </span>
            <input
              type="text"
              placeholder="ユーザー名またはメールで検索..."
              value={search}
              onChange={handleSearchChange}
              className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
            />
          </div>
          <button onClick={handleSearch} className="btn btn-success">検索</button>
        </div>

        {/* 一覧 */}
        <div className="space-y-4">
          {paginatedUsers.length ? (
            paginatedUsers.map((user) => (
              <div
                key={user.id}
                className="user-card p-4 rounded-2xl bg-white border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-lg text-slate-800">{user.username}</p>
                    {getStatusBadge(user)}
                  </div>
                  <p className="text-sm text-slate-500">{user.email}</p>
                  {getReportReason(user) && (
                    <p className="text-sm text-rose-600 font-medium">⚠ {getReportReason(user)}</p>
                  )}
                </div>

                {/* 右側ボタン */}
                <div className="flex flex-shrink-0 gap-2 self-end sm:self-center">
                  {/* 編集ボタンは常に表示 */}
                  <button onClick={() => handleEdit(user)} className="btn btn-ghost flex items-center gap-1 text-gray-600 hover:text-gray-800">
                    <IconEdit />編集
                  </button>

                  {/* 削除ボタンは通報ユーザーのみ */}
                  {getReportReason(user) && (
                    <button onClick={() => handleDeleteClick(user)} className="btn btn-danger">
                      削除
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-10 border-2 border-dashed rounded-2xl text-slate-400">
              <p className="font-bold">該当ユーザーがいません</p>
            </div>
          )}
        </div>

        {/* ページネーション */}
        <div className="flex justify-center mt-8 gap-2 overflow-x-auto pb-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`px-4 py-2 rounded-lg ${page === num ? "bg-sky-500 text-white shadow" : "bg-slate-200 text-slate-700"}`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {isModalOpen && <UserFormModal user={editingUser} onSave={handleSave} onClose={() => setIsModalOpen(false)} />}
      {confirmOpen && <ConfirmModal message={`${deletingUser.username} を削除しますか？`} onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} />}
    </div>
  );
};

export default UserPage;
