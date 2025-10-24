// src/pages/UserEdit.jsx
import React, { useState, useEffect } from "react";

// ★★★ 変更点: IconEditを削除 ★★★
const IconDelete = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconX = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconRestore = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><polyline points="9 15 12 12 15 15"></polyline></svg>;

// ... (Toast, ConfirmationModalは変更なし) ...
const Toast = ({ message, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);
  return <div className="fixed top-5 right-5 z-[100] rounded-lg bg-emerald-500 px-4 py-3 text-white shadow-lg">{message}</div>;
};
const ConfirmationModal = ({ message, onConfirm, onCancel }) => (
  <div className="modal-overlay">
    <div className="modal-content text-center">
      <p className="mb-6 text-lg whitespace-pre-line">{message}</p> {/* ★★★ 変更点: \n を改行として表示するため whitespace-pre-line を追加 ★★★ */}
      <div className="flex justify-center gap-4">
        <button onClick={onCancel} className="btn btn-secondary w-24">キャンセル</button>
        <button onClick={onConfirm} className="btn btn-danger w-24">実行</button>
      </div>
    </div>
  </div>
);

// ★★★ 変更点: UserEditModalを削除 ★★★

const UserEdit = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // ★★★ 変更点: selectedUserForEditを削除 ★★★
  const [activeTab, setActiveTab] = useState("edit");
  const [toast, setToast] = useState({ message: '', visible: false });
  const [confirmation, setConfirmation] = useState({ isOpen: false, message: '', onConfirm: null });
  const [users, setUsers] = useState(() => {
    // ... (変更なし) ...
    const savedUsers = localStorage.getItem("managedUsers");
    return savedUsers ? JSON.parse(savedUsers) : [
        { id: 1, name: "certified_user", email: "pro@example.com", status: "active", role: "certified", deletionScheduledAt: null },
        { id: 2, name: "general_user_1", email: "user1@example.com", status: "active", role: "general", deletionScheduledAt: null },
        { id: 3, name: "suspended_user", email: "sample@example.com", status: "suspended", role: "general", reportReason: "規約違反の投稿", deletionScheduledAt: null },
        { id: 4, name: "pending_deletion_user", email: "delete@example.com", status: "pending_deletion", role: "general", reportReason: null, deletionScheduledAt: "2025-09-01" },
        { id: 5, name: "reported_user", email: "report@example.com", status: "reported", role: "general", reportReason: "スパム行為", deletionScheduledAt: null },
        { id: 6, name: "banned_user", email: "ban@example.com", status: "banned", role: "general", reportReason: "複数アカウントの所持", deletionScheduledAt: null },
        { id: 7, name: "old_deleted_user", email: "old@example.com", status: "pending_deletion", role: "general", reportReason: null, deletionScheduledAt: "2025-07-01" },
        { id: 8, name: "cert_applicant", email: "applicant@example.com", status: "pending_certification", role: "general", deletionScheduledAt: null },
      ];
  });
  useEffect(() => { localStorage.setItem("managedUsers", JSON.stringify(users)); }, [users]);
  useEffect(() => {
    // ... (変更なし) ...
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const activeUsers = users.filter(u => !(u.status === 'pending_deletion' && u.deletionScheduledAt && new Date(u.deletionScheduledAt) < sixtyDaysAgo));
    if (activeUsers.length !== users.length) setUsers(activeUsers);
  }, []);
  const showToast = (message) => setToast({ message, visible: true });
  const showConfirmation = (message, onConfirm) => setConfirmation({ isOpen: true, message, onConfirm });
  const hideConfirmation = () => setConfirmation({ isOpen: false, message: '', onConfirm: null });
  const handleAction = (message, updateFn) => { setUsers(users.map(updateFn)); showToast(message); hideConfirmation(); };

  // ★★★ 変更点: updateUserを削除 ★★★

  // ★★★ 変更点: 各種アクションに確認モーダル(showConfirmation)を追加 ★★★
  const certifyUser = (userId) => showConfirmation("このユーザーを認証しますか？", () => 
    handleAction("ユーザーを認証済みにしました", u => u.id === userId ? { ...u, role: 'certified', status: 'active' } : u)
  );

  // ★★★ 変更点: 認証拒否のアクションを追加 ★★★
  const denyCertification = (userId) => showConfirmation("このユーザーの認証申請を拒否しますか？", () => 
    handleAction("認証申請を拒否しました", u => u.id === userId ? { ...u, status: 'active' } : u)
  );

  const revokeCertification = (userId) => showConfirmation("このユーザーの認証を剥奪しますか？", () => 
    handleAction("認証を剥奪しました", u => u.id === userId ? { ...u, role: 'general' } : u)
  );

  const suspendUser = (userId) => showConfirmation("このユーザーを凍結しますか？", () => 
    handleAction("ユーザーを凍結しました", u => u.id === userId ? { ...u, status: 'suspended' } : u)
  );

  const restoreUser = (userId) => showConfirmation("このユーザーを復元しますか？", () => 
    handleAction("ユーザーを復元しました", u => u.id === userId ? { ...u, status: 'active', deletionScheduledAt: null } : u)
  );

  // ★★★ 変更点: BANを即時完全削除に変更 ★★★
  const banUser = (userId) => showConfirmation("このユーザーをBAN(即時完全削除)しますか？\n(この操作は復元できません)", () => {
    setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
    showToast("ユーザーをBAN(完全削除)しました");
    hideConfirmation();
  });
  
  const scheduleDeletion = (userId) => showConfirmation("このユーザーを削除しますか？\n(60日間は復元可能です)", () => {
    const today = new Date().toISOString().split('T')[0];
    handleAction("ユーザーを削除リストに移動しました", u => u.id === userId ? { ...u, status: 'pending_deletion', deletionScheduledAt: today } : u);
  });
  
  // ... (filteredUsers, tabs, getStatusComponentは変更なし) ...
  const filteredUsers = (statuses) => users.filter(u => statuses.includes(u.status) && u.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const tabs = {
    edit: { label: "ユーザー編集", color: "edit", users: filteredUsers(['active']) },
    auth: { label: "ユーザー認証", color: "auth", users: filteredUsers(['pending_certification']) },
    report: { label: "通報されたユーザー", color: "report", users: filteredUsers(['reported']) },
    recovery: { label: "要対応ユーザー", color: "recovery", users: filteredUsers(['suspended', 'banned', 'pending_deletion']) },
  };
  const getStatusComponent = (user) => {
    const statuses = {
      certified: <span className="user-status-badge user-status-certified">認証済み</span>,
      suspended: <span className="user-status-badge user-status-suspended">凍結中</span>,
      banned: <span className="user-status-badge user-status-banned">BAN</span>,
      pending_deletion: <span className="user-status-badge user-status-pending_deletion">削除保留</span>,
    };
    return statuses[user.status] || (user.role === 'certified' ? statuses.certified : null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      {toast.visible && <Toast message={toast.message} onDismiss={() => setToast({ ...toast, visible: false })} />}
      {confirmation.isOpen && <ConfirmationModal message={confirmation.message} onConfirm={confirmation.onConfirm} onCancel={hideConfirmation} />}
      {/* ★★★ 変更点: UserEditModalを削除 ★★★ */}
      
      <div className="mx-auto max-w-7xl rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="text-center text-3xl font-bold mb-6">ユーザー管理</h1>
        {/* ... (tabs, search areaは変更なし) ... */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
          {Object.entries(tabs).map(([key, { label, color }]) => (
            <button key={key} onClick={() => setActiveTab(key)} className={`main-tab ${activeTab === key ? `main-tab-active-${color}` : "main-tab-inactive"}`}>{label}</button>
          ))}
        </div>
        <div className="search-area mb-6">
          <input type="text" placeholder="ユーザー名で検索..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field sm:w-1/2" />
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4">{tabs[activeTab].label}</h2>
          {tabs[activeTab].users.length > 0 ? (
            <ul className="divide-y divide-slate-200">
              {tabs[activeTab].users.map(user => (
                <li key={user.id} className={`user-card user-card-${activeTab === 'edit' ? 'default' : activeTab}`}>
                  {/* ... (user info displayは変更なし) ... */}
                  <div className="flex items-center gap-4">
                    {getStatusComponent(user)}
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-slate-600">{user.email}</p>
                      {user.reportReason && <p className="mt-1 text-xs text-rose-700">理由: {user.reportReason}</p>}
                      {user.deletionScheduledAt && <p className="mt-1 text-xs text-slate-500">完全削除: {(d => {d.setDate(d.getDate() + 60); return d.toLocaleDateString();})(new Date(user.deletionScheduledAt))}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2 self-end sm:self-center">
                    {activeTab === 'edit' && <>
                      {/* ★★★ 変更点: 剥奪ボタンの色をbtn-dangerからbtn-secondaryに変更 ★★★ */}
                      {user.role === 'certified' && <button onClick={() => revokeCertification(user.id)} className="btn btn-secondary text-xs"><IconX />剥奪</button>}
                      {/* ★★★ 変更点: 編集ボタンを削除 ★★★ */}
                      <button onClick={() => scheduleDeletion(user.id)} className="btn btn-danger"><IconDelete />削除</button>
                    </>}
                    
                    {/* ★★★ 変更点: 拒否ボタンを追加 ★★★ */}
                    {activeTab === 'auth' && <>
                      <button onClick={() => denyCertification(user.id)} className="btn btn-danger"><IconX />拒否</button>
                      <button onClick={() => certifyUser(user.id)} className="btn btn-success"><IconCheck />承認</button>
                    </>}
                    
                    {activeTab === 'report' && <>
                      <button onClick={() => suspendUser(user.id)} className="btn btn-secondary">凍結</button>
                      <button onClick={() => banUser(user.id)} className="btn btn-danger">BAN</button>
                    </>}
                    {activeTab === 'recovery' && <button onClick={() => restoreUser(user.id)} className="btn btn-primary"><IconRestore />復元</button>}
                  </div>
                </li>
              ))}
            </ul>
          ) : <p className="text-slate-500 p-4 text-center">対象ユーザーはいません。</p>}
        </div>
      </div>
    </div>
  );
};

export default UserEdit;