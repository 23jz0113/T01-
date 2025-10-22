import React, { useState, useEffect } from "react";

// --- サブコンポーネント: アイコン ---
const IconPlus = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const IconEdit = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const IconArchive = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>;
const IconRestore = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="12" y1="16" x2="12" y2="10"></line><polyline points="15 13 12 10 9 13"></polyline></svg>;

// --- サブコンポーネント: トースト通知 ---
const Toast = ({ message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const bgColor = type === 'success' ? 'bg-emerald-500' : 'bg-red-500';
  return (
    <div className={`fixed top-5 right-5 z-50 rounded-lg px-4 py-3 text-white shadow-lg ${bgColor}`}>
      {message}
    </div>
  );
};

// --- メインコンポーネント: AnnouncementPage ---
const AnnouncementPage = () => {
  const [activeTab, setActiveTab] = useState("published"); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null); 
  const [toast, setToast] = useState({ message: '', type: '', visible: false });

  // お知らせデータをlocalStorageで管理
  const [announcements, setAnnouncements] = useState(() => {
    const savedAnnouncements = localStorage.getItem("managedAnnouncements");
    return savedAnnouncements ? JSON.parse(savedAnnouncements) : [
      { id: 1, title: "サーバーメンテナンスのお知らせ", content: "2025年10月30日 2:00〜4:00の間、サーバーメンテナンスを実施いたします。期間中はサービスをご利用いただけません。", status: "published" },
      { id: 2, title: "新機能「コーデ保存」リリース", content: "お気に入りのコーデを保存できる新機能をリリースしました。ぜひお試しください。", status: "published" },
      { id: 3, title: "（下書き）送料改定のお知らせ", content: "2026年1月1日より、配送料金を改定させていただく予定です。", status: "draft" },
      { id: 4, title: "（アーカイブ）旧バージョンサポート終了", content: "v1.x.x のサポートは2025年9月30日をもって終了いたしました。", status: "archived" },
    ];
  });
  useEffect(() => {
    localStorage.setItem("managedAnnouncements", JSON.stringify(announcements));
  }, [announcements]);

  const showToast = (message, type = 'success') => setToast({ message, type, visible: true });

  // ステータス別の配列を生成
  const publishedAnnouncements = announcements.filter(ann => ann.status === 'published');
  const draftAnnouncements = announcements.filter(ann => ann.status === 'draft');
  const archivedAnnouncements = announcements.filter(ann => ann.status === 'archived');

  const handleOpenModalForNew = () => { setEditingAnnouncement(null); setIsModalOpen(true); };
  const handleOpenModalForEdit = (announcement) => { setEditingAnnouncement(announcement); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setEditingAnnouncement(null); };

  // お知らせの保存処理
  const handleSaveAnnouncement = (announcementData, status) => {
    const saveData = { ...announcementData, status };
    if (saveData.id) {
      setAnnouncements(announcements.map(ann => (ann.id === saveData.id ? saveData : ann)));
      showToast(`お知らせを「${status === 'published' ? '公開' : '下書き'}」として更新しました`);
    } else {
      setAnnouncements([{ ...saveData, id: Date.now() }, ...announcements]);
      showToast(`新規お知らせを「${status === 'published' ? '公開' : '下書き'}」として作成しました`);
    }
    handleCloseModal();
  };
  
  // アーカイブ処理
  const handleArchiveAnnouncement = (announcementId) => {
    setAnnouncements(announcements.map(ann => ann.id === announcementId ? { ...ann, status: 'archived' } : ann));
    showToast("お知らせをアーカイブしました");
  };

  // 復元処理
  const handleRestoreAnnouncement = (announcementId) => {
    setAnnouncements(announcements.map(ann => ann.id === announcementId ? { ...ann, status: 'draft' } : ann));
    showToast("お知らせを下書きとして復元しました");
  };

  // お知らせ一覧のレンダリング
  const renderAnnouncements = (anns, type = 'default') => {
    if (anns.length === 0) return (
      <div className="text-center p-10 border-2 border-dashed rounded-lg text-slate-500">
        <p className="font-bold">お知らせがありません</p>
        <p className="text-sm mt-1">新しいお知らせを作成してみましょう！</p>
      </div>
    );

    return anns.map(ann => (
      // EventPageと同じ 'event-card' クラス名を流用します
      <div key={ann.id} className={`event-card ${ann.status === 'draft' ? 'event-card-draft' : ''}`}>
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-2">
            <p className="font-bold text-lg text-slate-800">{ann.title}</p>
            {ann.status === 'published' && <span className="status-badge status-badge-published">公開中</span>}
            {ann.status === 'draft' && <span className="status-badge status-badge-draft">下書き</span>}
          </div>
          {/* pre-wrapで改行と空白を保持 */}
          <p className="text-sm text-slate-600 whitespace-pre-wrap">{ann.content}</p> 
        </div>
        <div className="flex flex-shrink-0 gap-2">
          {type === 'archived' ? (
            <button onClick={() => handleRestoreAnnouncement(ann.id)} className="btn btn-success"><IconRestore />復元</button>
          ) : (
            <>
              <button onClick={() => handleOpenModalForEdit(ann)} className="btn btn-ghost"><IconEdit />編集</button>
              <button onClick={() => handleArchiveAnnouncement(ann.id)} className="btn btn-danger"><IconArchive />アーカイブ</button>
            </>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-800 sm:p-6">
      {toast.visible && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast({ ...toast, visible: false })} />}
      
      <div className="mx-auto max-w-7xl rounded-2xl bg-white p-6 shadow-lg sm:p-8">
        <div className="flex flex-col items-center justify-between gap-4 border-b pb-6 sm:flex-row">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">お知らせ管理</h1>
              <p className="text-slate-500 mt-1">お知らせの作成、編集、管理を行います。</p>
            </div>
            <button onClick={handleOpenModalForNew} className="btn btn-primary w-full sm:w-auto">
                <IconPlus />
                新規作成
            </button>
        </div>
        
        <div className="my-6 flex justify-center">
          <div className="tab-group">
            {['published', 'draft', 'archived'].map(tab => {
              const tabNames = { published: '公開中', draft: '下書き', archived: 'アーカイブ済み' };
              return (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)} 
                  className={`tab-item ${activeTab === tab ? "tab-item-active" : "tab-item-inactive"}`}
                >{tabNames[tab]}</button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          {activeTab === "published" && renderAnnouncements(publishedAnnouncements)}
          {activeTab === "draft" && renderAnnouncements(draftAnnouncements)}
          {activeTab === "archived" && renderAnnouncements(archivedAnnouncements, 'archived')}
        </div>

      </div>
      {isModalOpen && <AnnouncementFormModal announcement={editingAnnouncement} onSave={handleSaveAnnouncement} onClose={handleCloseModal} />}
    
      {/* --- ここからスタイル定義 --- */}
      {/* EventPage.jsxからコピーした共通スタイル */}
      <style>{`
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem; /* 8px */
          border-radius: 0.5rem; /* 8px */
          padding-left: 1rem; /* 16px */
          padding-right: 1rem; /* 16px */
          padding-top: 0.5rem; /* 8px */
          padding-bottom: 0.5rem; /* 8px */
          font-size: 0.875rem; /* 14px */
          line-height: 1.25rem; /* 20px */
          font-weight: 600;
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }
        .btn-primary {
          background-color: #2563eb; /* bg-blue-600 */
          color: #ffffff; /* text-white */
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); /* shadow-md */
        }
        .btn-primary:hover { background-color: #1d4ed8; /* hover:bg-blue-700 */ }
        .btn-primary:active { background-color: #1e40af; /* active:bg-blue-800 */ }
        
        .btn-success {
          background-color: #059669; /* bg-emerald-600 */
          color: #ffffff; /* text-white */
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); /* shadow-sm */
        }
        .btn-success:hover { background-color: #047857; /* hover:bg-emerald-700 */ }
        .btn-success:active { background-color: #065f46; /* active:bg-emerald-800 */ }

        .btn-danger {
          background-color: #fee2e2; /* bg-red-100 */
          color: #b91c1c; /* text-red-700 */
        }
        .btn-danger:hover { background-color: #fecaca; /* hover:bg-red-200 */ }
        .btn-danger:active { background-color: #fca5a5; /* active:bg-red-300 */ }

        .btn-ghost {
          background-color: #f1f5f9; /* bg-slate-100 */
          color: #334155; /* text-slate-700 */
        }
        .btn-ghost:hover { background-color: #e2e8f0; /* hover:bg-slate-200 */ }
        .btn-ghost:active { background-color: #cbd5e1; /* active:bg-slate-300 */ }

        .btn-secondary {
          background-color: #ffffff; /* bg-white */
          color: #334155; /* text-slate-700 */
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); /* shadow-sm */
          ring: 1px solid #cbd5e1; /* ring-1 ring-slate-300 */
        }
        .btn-secondary:hover { background-color: #f8fafc; /* hover:bg-slate-50 */ }
        .btn-secondary:active { background-color: #f1f5f9; /* active:bg-slate-100 */ }
        
        .tab-group {
          display: flex;
          width: 100%;
          max-width: 36rem; /* max-w-md */
          border-radius: 0.75rem; /* rounded-xl */
          background-color: #f1f5f9; /* bg-slate-100 */
          padding: 0.375rem; /* p-1.5 */
        }
        .tab-item {
          width: 100%;
          border-radius: 0.5rem; /* rounded-lg */
          padding-left: 1rem; /* px-4 */
          padding-right: 1rem; /* px-4 */
          padding-top: 0.625rem; /* py-2.5 */
          padding-bottom: 0.625rem; /* py-2.5 */
          font-size: 0.875rem; /* 14px */
          line-height: 1.25rem; /* 20px */
          font-weight: 600;
          color: #475569; /* text-slate-600 */
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 200ms;
        }
        .tab-item-active {
          background-color: #ffffff; /* bg-white */
          color: #2563eb; /* text-blue-600 */
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); /* shadow-md */
        }
        .tab-item-inactive:hover {
          background-color: rgba(226, 232, 240, 0.7); /* hover:bg-slate-200/70 */
        }

        /* お知らせカード（event-cardクラスを流用） */
        .event-card {
          display: flex;
          flex-direction: column;
          /* sm:flex-row */
          @media (min-width: 640px) {
            flex-direction: row;
            align-items: center;
          }
          justify-content: space-between;
          gap: 1rem; /* 16px */
          border-radius: 0.75rem; /* rounded-xl */
          border-width: 1px;
          border-color: #e2e8f0; /* border-slate-200 */
          background-color: #ffffff; /* bg-white */
          padding: 1.25rem; /* p-5 */
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); /* shadow-sm */
        }
        .event-card-draft {
          border-left-width: 4px;
          border-left-color: #facc15; /* border-l-yellow-400 */
        }
        
        .status-badge {
          border-radius: 9999px; /* rounded-full */
          padding-left: 0.625rem; /* px-2.5 */
          padding-right: 0.625rem; /* px-2.5 */
          padding-top: 0.125rem; /* py-0.5 */
          padding-bottom: 0.125rem; /* py-0.5 */
          font-size: 0.75rem; /* 12px */
          line-height: 1rem; /* 16px */
          font-weight: 600;
        }
        .status-badge-published {
          background-color: #d1fae5; /* bg-emerald-100 */
          color: #065f46; /* text-emerald-700 */
        }
        .status-badge-draft {
          background-color: #fef9c3; /* bg-yellow-100 */
          color: #854d0e; /* text-yellow-700 */
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 40;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem; /* 16px */
        }
        .modal-content {
          width: 100%;
          max-width: 42rem; /* max-w-2xl */
          border-radius: 1rem; /* rounded-2xl */
          background-color: #ffffff; /* bg-white */
          padding: 1.5rem; /* p-6 */
          box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25); /* shadow-xl */
        }
        .input-label {
          display: block;
          margin-bottom: 0.375rem; /* mb-1.5 */
          font-size: 0.875rem; /* 14px */
          line-height: 1.25rem; /* 20px */
          font-weight: 500;
          color: #475569; /* text-slate-600 */
        }
        .input-field {
          width: 100%;
          border-radius: 0.5rem; /* rounded-lg */
          border-width: 1px;
          border-color: #cbd5e1; /* border-slate-300 */
          padding-left: 0.75rem; /* px-3 */
          padding-right: 0.75rem; /* px-3 */
          padding-top: 0.5rem; /* py-2 */
          padding-bottom: 0.5rem; /* py-2 */
          font-size: 0.875rem; /* 14px */
          line-height: 1.25rem; /* 20px */
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); /* shadow-sm */
        }
        .input-field:focus {
          border-color: #3b82f6; /* focus:border-blue-500 */
          outline: 1px solid #3b82f6; /* focus:ring-1 focus:ring-blue-500 */
        }
        .input-field-textarea {
          min-height: 120px;
          resize: vertical;
        }
      `}</style>
      {/* --- スタイル定義ここまで --- */}
    </div>
  );
};

// --- サブコンポーネント: モーダル ---
const AnnouncementFormModal = ({ announcement, onSave, onClose }) => {
  const [formData, setFormData] = useState({ title: "", content: "" });
  // エラーメッセージ用のstate
  const [error, setError] = useState("");

  useEffect(() => {
    if (announcement) {
      setFormData({ ...announcement });
    } else {
      setFormData({ title: "", content: "", status: "draft" });
    }
    setError(""); // モーダルが開く/切り替わるたびにエラーをリセット
  }, [announcement]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(""); // 入力を始めたらエラーを消す
  };

  const handleSubmit = (statusToSave) => {
    // alert()の代わりに state を使ったエラー表示
    if (!formData.title.trim()) {
      setError("タイトルを入力してください");
      return;
    }
     if (!formData.content.trim()) {
      setError("内容を入力してください");
      return;
    }
    setError(""); // エラーがなければクリア
    onSave({ ...announcement, ...formData }, statusToSave);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6 text-slate-800">{announcement ? "お知らせ編集" : "新規お知らせ作成"}</h2>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="input-label" htmlFor="title-input">タイトル:</label>
            <input id="title-input" type="text" name="title" value={formData.title} onChange={handleChange} className="input-field" required />
          </div>
          <div>
            <label className="input-label" htmlFor="content-input">内容:</label>
            <textarea 
              id="content-input"
              name="content" 
              value={formData.content} 
              onChange={handleChange} 
              className="input-field input-field-textarea" 
              required 
            />
          </div>
          
          {/* エラーメッセージの表示エリア */}
          {error && (
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn btn-secondary">キャンセル</button>
            <button type="button" onClick={() => handleSubmit('draft')} className="btn btn-ghost">下書き保存</button>
            <button type="button" onClick={() => handleSubmit('published')} className="btn btn-success">公開して保存</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementPage;

