import React, { useState, useEffect } from "react";

/* --- アイコン --- */
const IconDelete = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconX = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconRestore = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><polyline points="9 15 12 12 15 15"></polyline></svg>;

/* --- トースト通知 --- */
const Toast = ({ message, type = "success", onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);
  const bg = type === "success" ? "bg-emerald-500" : "bg-rose-500";
  return <div className={`fixed top-5 right-5 z-[100] rounded-lg px-4 py-3 text-white shadow-lg ${bg}`}>{message}</div>;
};

/* --- 確認モーダル --- */
const ConfirmationModal = ({ message, onConfirm, onCancel }) => (
  <div className="modal-overlay">
    <div className="modal-content text-center">
      <p className="mb-6 text-lg whitespace-pre-line">{message}</p>
      <div className="flex justify-center gap-4">
        <button onClick={onCancel} className="btn btn-secondary w-28">キャンセル</button>
        <button onClick={onConfirm} className="btn btn-danger w-28">実行</button>
      </div>
    </div>
  </div>
);

const UserEdit = () => {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ message: "", type: "", visible: false });
  const [confirmation, setConfirmation] = useState({ isOpen: false, message: "", onConfirm: null });

  /* --- API取得 --- */
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost/T01/public/api/users/public");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      showToast("ユーザー取得に失敗しました", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* --- ヘルパー --- */
  const showToast = (message, type = "success") => setToast({ message, type, visible: true });
  const showConfirmation = (message, onConfirm) => setConfirmation({ isOpen: true, message, onConfirm });
  const hideConfirmation = () => setConfirmation({ isOpen: false, message: "", onConfirm: null });

  /* --- ステータス変換 --- */
  const getStatusLabel = (status_id) => {
    const map = {
      1: <span className="user-status-badge user-status-active">有効</span>,
      2: <span className="user-status-badge user-status-suspended">凍結中</span>,
      3: <span className="user-status-badge user-status-banned">BAN</span>,
      4: <span className="user-status-badge user-status-deleted">削除予定</span>,
    };
    return map[status_id] || <span className="user-status-badge user-status-general">不明</span>;
  };

  /* --- 操作例 --- */
  const handleDelete = (id) => showConfirmation("このユーザーを削除しますか？", async () => {
    try {
      const res = await fetch(`http://localhost/T01/public/api/users/delete/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("削除失敗");
      showToast("削除しました");
      fetchUsers();
      hideConfirmation();
    } catch (err) {
      console.error(err);
      showToast("削除に失敗しました", "error");
    }
  });

  /* --- 検索とフィルタリング --- */
  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      {toast.visible && <Toast {...toast} onDismiss={() => setToast({ ...toast, visible: false })} />}
      {confirmation.isOpen && <ConfirmationModal {...confirmation} onCancel={hideConfirmation} />}

      <div className="mx-auto max-w-7xl rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="text-center text-3xl font-bold mb-6">ユーザー管理</h1>

        {/* --- 検索 --- */}
        <div className="search-area mb-6 text-center">
          <input
            type="text"
            placeholder="ユーザー名・メールで検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field sm:w-1/2"
          />
        </div>

        {/* --- ユーザー一覧 --- */}
        {filteredUsers.length > 0 ? (
          <ul className="divide-y divide-slate-200">
            {filteredUsers.map((user) => (
              <li key={user.id} className="user-card user-card-default flex justify-between items-center">
                <div>
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-sm text-slate-600">{user.email}</p>
                  {getStatusLabel(user.status_id)}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleDelete(user.id)} className="btn btn-danger">
                    <IconDelete />削除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-slate-500 p-6">ユーザーが見つかりません。</p>
        )}
      </div>
    </div>
  );
};

export default UserEdit;
