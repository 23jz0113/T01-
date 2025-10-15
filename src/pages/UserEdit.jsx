import React, { useState, useEffect } from "react";

// ★★ 変更点1: 初期データをlocalStorageから読み込む ★★
const UserEdit = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("edit");
  
  // 最初にlocalStorageからデータを読み込む。なければ初期データを使う。
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("managedUsers");
    if (savedUsers) {
      return JSON.parse(savedUsers);
    } else {
      // localStorageに何もない初回だけ、この初期データが使われる
      return [
        { id: 1, name: "certified_user", email: "pro@example.com", status: "active", role: "certified", deletionScheduledAt: null },
        { id: 2, name: "general_user_1", email: "user1@example.com", status: "active", role: "general", deletionScheduledAt: null },
        { id: 3, name: "suspended_user", email: "sample@example.com", status: "suspended", role: "general", reportReason: "規約違反の投稿", deletionScheduledAt: null },
        { id: 4, name: "pending_deletion_user", email: "delete@example.com", status: "pending_deletion", role: "general", reportReason: null, deletionScheduledAt: "2025-09-01" },
        { id: 5, name: "reported_user", email: "report@example.com", status: "reported", role: "general", reportReason: "スパム行為", deletionScheduledAt: null },
        { id: 6, name: "banned_user", email: "ban@example.com", status: "banned", role: "general", reportReason: "複数アカウントの所持", deletionScheduledAt: null },
        { id: 7, name: "old_deleted_user", email: "old@example.com", status: "pending_deletion", role: "general", reportReason: null, deletionScheduledAt: "2025-07-01" },
        { id: 8, name: "cert_applicant", email: "applicant@example.com", status: "pending_certification", role: "general", deletionScheduledAt: null },
      ];
    }
  });

  // ★★ 変更点2: usersステートが変更されるたびにlocalStorageに保存する ★★
  useEffect(() => {
    localStorage.setItem("managedUsers", JSON.stringify(users));
  }, [users]);


  // 60日以上経過したユーザーを自動的に削除する (サーバー処理のシミュレーション)
  useEffect(() => {
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const activeUsers = users.filter(user => {
      if (user.status === 'pending_deletion' && user.deletionScheduledAt) {
        return new Date(user.deletionScheduledAt) > sixtyDaysAgo;
      }
      return true;
    });
    if (activeUsers.length !== users.length) {
      setUsers(activeUsers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // (以降のロジックは変更ありません)
  const filterUsersBySearch = (userList) => 
    userList.filter((u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const usersForEdit = filterUsersBySearch(users.filter(u => u.status === 'active'));
  const usersForCertification = filterUsersBySearch(users.filter(u => u.status === 'pending_certification'));
  const usersForReport = filterUsersBySearch(users.filter(u => u.status === 'reported'));
  const usersForRecovery = filterUsersBySearch(users.filter(u => ['suspended', 'banned', 'pending_deletion'].includes(u.status)));

  const handleUpdate = (e) => { e.preventDefault(); if (!selectedUser) return; setUsers(users.map((u) => (u.id === selectedUser.id ? selectedUser : u))); alert("ユーザー情報を更新しました"); setSelectedUser(null); };
  const handleCertify = (userId) => { setUsers(users.map(u => u.id === userId ? { ...u, role: 'certified', status: 'active' } : u)); alert("ユーザーを認証済みにしました。"); };
  const handleRevokeCertification = (userId) => { setUsers(users.map(u => u.id === userId ? { ...u, role: 'general' } : u)); alert("認証を剥奪しました。"); };
  const handleSuspend = (userId) => { setUsers(users.map(u => u.id === userId ? { ...u, status: 'suspended' } : u)); alert("ユーザーを凍結しました。"); };
  const handleBan = (userId) => { if (window.confirm("このユーザーをBANしますか？\nユーザーは「要対応ユーザー」リストに移動します。")) { setUsers(users.map(u => u.id === userId ? { ...u, status: 'banned' } : u)); alert("ユーザーをBANしました。"); } };
  const handleScheduleDeletion = (userId) => { if (window.confirm("このユーザーを削除しますか？\n60日間は復元可能です。")) { const today = new Date().toISOString().split('T')[0]; setUsers(users.map(u => u.id === userId ? { ...u, status: 'pending_deletion', deletionScheduledAt: today } : u)); alert("ユーザーを削除リストに移動しました。"); } };
  const handleRestore = (userId) => { setUsers(users.map(u => u.id === userId ? { ...u, status: 'active', deletionScheduledAt: null } : u)); alert("ユーザーを復元しました。"); };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">ユーザー管理</h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <button onClick={() => setActiveTab("edit")} className={`py-3 rounded-lg font-semibold w-full transition-all duration-200 active:scale-95 ${ activeTab === "edit" ? "bg-blue-500 text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300" }`}>ユーザー編集</button>
          <button onClick={() => setActiveTab("auth")} className={`py-3 rounded-lg font-semibold w-full transition-all duration-200 active:scale-95 ${ activeTab === "auth" ? "bg-green-500 text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300" }`}>ユーザー認証</button>
          <button onClick={() => setActiveTab("report")} className={`py-3 rounded-lg font-semibold w-full transition-all duration-200 active:scale-95 ${ activeTab === "report" ? "bg-red-500 text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300" }`}>通報されたユーザー</button>
          <button onClick={() => setActiveTab("recovery")} className={`py-3 rounded-lg font-semibold w-full transition-all duration-200 active:scale-95 ${ activeTab === "recovery" ? "bg-gray-600 text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300" }`}>要対応ユーザー</button>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner mb-6">
          <h2 className="text-xl font-bold mb-3">ユーザー検索</h2>
          <input type="text" placeholder="ユーザー名で検索" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"/>
        </div>

        {/* (以降のJSX部分は変更ありません) */}
        {activeTab === "edit" && (
          <>
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
              <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">アクティブユーザー一覧</h2>
              <ul className="divide-y divide-gray-300">
                {usersForEdit.map((user) => (
                  <li key={user.id} className="py-3 flex flex-col sm:flex-row justify-between sm:items-center gap-2 transition-colors hover:bg-gray-100 rounded-md -mx-2 px-2">
                    <div className="flex items-center gap-3">
                      {user.role === 'certified' && (
                        <div className="flex items-center gap-2">
                          <span title="認証済みユーザー">⭐</span> 
                          <button onClick={() => handleRevokeCertification(user.id)} className="bg-red-100 text-red-700 px-2 py-0.5 rounded-md text-xs font-semibold hover:bg-red-200 transition-colors">剥奪</button>
                        </div>
                      )}
                      <div><p className="font-semibold">{user.name}</p><p className="text-sm text-gray-600">{user.email}</p></div>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md text-sm transition active:scale-95" onClick={() => setSelectedUser({ ...user })}>編集</button>
                      <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md text-sm transition active:scale-95" onClick={() => handleScheduleDeletion(user.id)}>削除</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {selectedUser && (
              <div className="bg-gray-50 p-6 rounded-lg shadow-inner mt-6">
                <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">編集: {selectedUser.name}</h2>
                <form className="grid gap-4" onSubmit={handleUpdate}>
                  <input type="text" value={selectedUser.name} onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })} className="w-full px-4 py-2 border rounded-md"/>
                  <input type="email" value={selectedUser.email} onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })} className="w-full px-4 py-2 border rounded-md"/>
                  <div className="flex gap-2 justify-end"><button type="button" onClick={() => setSelectedUser(null)} className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-md font-semibold">キャンセル</button><button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md font-semibold">更新する</button></div>
                </form>
              </div>
            )}
          </>
        )}

        {activeTab === "auth" && (
          <div className="bg-green-50 p-6 rounded-lg shadow-inner"><h2 className="text-xl font-bold mb-4 border-b border-green-300 pb-2 text-green-800">認証リクエスト一覧</h2><ul className="divide-y divide-gray-300">{usersForCertification.length > 0 ? usersForCertification.map((user) => (<li key={user.id} className="py-3 flex justify-between items-center gap-2 hover:bg-green-100 rounded-md -mx-2 px-2"><div><p className="font-semibold">{user.name}</p><p className="text-sm text-gray-600">{user.email}</p></div><button className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md text-sm" onClick={() => handleCertify(user.id)}>承認する</button></li>)) : <p className="text-gray-600 mt-2">認証リクエストはありません。</p>}</ul></div>
        )}

        {activeTab === "report" && (
          <div className="bg-red-50 p-6 rounded-lg shadow-inner"><h2 className="text-xl font-bold mb-4 border-b border-red-300 pb-2 text-red-800">通報されたユーザー</h2><ul className="divide-y divide-gray-300">{usersForReport.length > 0 ? usersForReport.map((user) => (<li key={user.id} className="py-3 flex justify-between items-center gap-2 hover:bg-red-100 rounded-md -mx-2 px-2"><div><p className="font-semibold">{user.name}</p><p className="text-sm text-gray-600">{user.email}</p><p className="text-xs text-red-700 mt-1">通報理由: {user.reportReason}</p></div><div className="flex gap-2"><button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-md text-sm" onClick={() => handleSuspend(user.id)}>凍結</button><button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md text-sm" onClick={() => handleBan(user.id)}>BAN</button></div></li>)) : <p className="text-gray-600 mt-2">通報されたユーザーはいません。</p>}</ul></div>
        )}

        {activeTab === "recovery" && (
          <div className="bg-gray-200 p-6 rounded-lg shadow-inner"><h2 className="text-xl font-bold mb-4 border-b border-gray-400 pb-2 text-gray-800">要対応ユーザーの管理</h2><ul className="divide-y divide-gray-400">{usersForRecovery.length > 0 ? usersForRecovery.map((user) => { const deletionDate = user.deletionScheduledAt ? new Date(user.deletionScheduledAt) : null; if(deletionDate) { deletionDate.setDate(deletionDate.getDate() + 60); } return (<li key={user.id} className="py-3 flex justify-between items-center gap-2 hover:bg-gray-300 rounded-md -mx-2 px-2"><div><div className="flex items-center gap-3"><p className="font-semibold">{user.name}</p>{user.status === 'suspended' && <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">凍結中</span>}{user.status === 'banned' && <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">BAN</span>}{user.status === 'pending_deletion' && <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">削除保留中</span>}</div>{deletionDate && <p className="text-xs text-gray-600 mt-1">完全削除予定日: {deletionDate.toLocaleDateString()}</p>}</div><button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md text-sm" onClick={() => handleRestore(user.id)}>復元</button></li>);}) : <p className="text-gray-600 mt-2">対象ユーザーはいません。</p>}</ul></div>
        )}
      </div>
    </div>
  );
};

export default UserEdit;