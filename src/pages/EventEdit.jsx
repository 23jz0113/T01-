import React, { useState, useEffect } from "react";

/* --- アイコン群 --- */
const IconPlus = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const IconEdit = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconArchive = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>;
const IconRestore = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="12" y1="16" x2="12" y2="10"/><polyline points="15 13 12 10 9 13"/></svg>;
const IconEye = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;

/* --- トースト通知 --- */
const Toast = ({ message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);
  const bgColor = type === "success" ? "bg-emerald-500" : "bg-rose-500";
  return <div className={`fixed top-5 right-5 z-[100] rounded-lg px-4 py-3 text-white shadow-lg ${bgColor}`}>{message}</div>;
};

/* --- 確認モーダル --- */
const ConfirmationModal = ({ message, onConfirm, onCancel, confirmText = "実行" }) => (
  <div className="modal-overlay">
    <div className="modal-content text-center">
      <p className="mb-6 text-lg whitespace-pre-line">{message}</p>
      <div className="flex justify-center gap-4">
        <button onClick={onCancel} className="btn btn-secondary w-28">キャンセル</button>
        <button onClick={onConfirm} className="btn btn-danger w-28">{confirmText}</button>
      </div>
    </div>
  </div>
);

/* --- メイン --- */
const EventPage = () => {
  const [events, setEvents] = useState([
    { id: 1, keyword: "トレンド", start_date: "2025-10-01T00:00", end_date: "2025-10-31T23:59", status: "draft" },
    { id: 2, keyword: "人気", start_date: "2025-09-01T00:00", end_date: "2025-09-30T23:59", status: "draft" }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "", visible: false });
  const [confirmation, setConfirmation] = useState({ isOpen: false, message: '', onConfirm: null, confirmText: '実行' });

  const showToast = (message, type = "success") => setToast({ message, type, visible: true });
  const showConfirmation = (message, onConfirm, confirmText = '実行') => setConfirmation({ isOpen: true, message, onConfirm, confirmText });
  const hideConfirmation = () => setConfirmation({ isOpen: false, message: '', onConfirm: null, confirmText: '実行' });

  const handleOpenNew = () => { setEditingEvent(null); setIsModalOpen(true); };
  const handleEdit = (e) => { setEditingEvent(e); setIsModalOpen(true); };
  const handleClose = () => { setIsModalOpen(false); setEditingEvent(null); };

  const handleSave = (data) => {
    const now = new Date();
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);
    const status = now >= start && now <= end ? "published" : "draft";

    const saveData = data.id ? { ...data, status } : { ...data, id: Date.now(), status };
    setEvents(prev =>
      prev.some(e => e.id === saveData.id)
        ? prev.map(e => (e.id === saveData.id ? saveData : e))
        : [saveData, ...prev]
    );

    showToast("保存しました");
    handleClose();
  };

  /* --- 公開／非公開切り替え --- */
  const toggleStatus = (id) => {
    setEvents(prev =>
      prev.map(e =>
        e.id === id ? { ...e, status: e.status === "published" ? "draft" : "published" } : e
      )
    );
    showToast("ステータスを変更しました");
  };

  // --- 自動公開／非公開（1分ごと） ---
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setEvents(prev => prev.map(e => {
        const start = new Date(e.start_date);
        const end = new Date(e.end_date);
        const shouldBePublished = now >= start && now <= end;
        if ((shouldBePublished && e.status !== "published") || (!shouldBePublished && e.status !== "draft")) {
          return { ...e, status: shouldBePublished ? "published" : "draft" };
        }
        return e;
      }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = (id) => {
    showConfirmation(
      "このイベントを削除しますか？",
      () => {
        setEvents(prev => prev.filter(e => e.id !== id));
        showToast("削除しました");
        hideConfirmation();
      },
      "削除する"
    );
  };

  const renderList = () =>
    events.length ? events.map(e => (
      <div key={e.id} className="event-card">
        <div>
          <p className="font-bold text-lg">{e.keyword}</p>
          <p className="text-sm">開始: {new Date(e.start_date).toLocaleString()}</p>
          <p className="text-sm">終了: {new Date(e.end_date).toLocaleString()}</p>
          <p className="text-sm">ステータス: 
            <span className={`ml-2 px-2 py-1 rounded text-white ${e.status === "published" ? "bg-emerald-500" : "bg-gray-400"}`}>
              {e.status === "published" ? "公開" : "非公開"}
            </span>
          </p>
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={() => handleEdit(e)} className="btn btn-ghost"><IconEdit />編集</button>
          <button onClick={() => toggleStatus(e.id)} className={`btn ${e.status === "published" ? "btn-secondary" : "btn-success"}`}>
            {e.status === "published" ? "非公開にする" : "公開する"}
          </button>
          <button onClick={() => handleDelete(e.id)} className="btn btn-danger">削除</button>
        </div>
      </div>
    )) : <p>イベントがありません</p>;

  return (
    <div className="min-h-screen p-4 bg-slate-50">
      {toast.visible && <Toast {...toast} onDismiss={() => setToast({ ...toast, visible: false })} />}
      {confirmation.isOpen && <ConfirmationModal {...confirmation} onCancel={hideConfirmation} />}
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">イベント管理</h1>
          <button onClick={handleOpenNew} className="btn btn-primary"><IconPlus /> 新規作成</button>
        </div>
        <div className="space-y-4">
          {renderList()}
        </div>
      </div>
      {isModalOpen && (
        <EventFormModal
          event={editingEvent}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

/* --- イベント編集モーダル --- */
const EventFormModal = ({ event, onSave, onClose }) => {
  const [formData, setFormData] = useState({ keyword: "", start_date: "", end_date: "" });

  useEffect(() => {
    if (event) {
      setFormData({ ...event });
    } else {
      setFormData({ keyword: "", start_date: "", end_date: "" });
    }
  }, [event]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = () => onSave(formData);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4">{event ? "イベント編集" : "新規作成"}</h2>
        <div className="space-y-3">
          <div>
            <label className="input-label">イベント名（キーワード）:</label>
            <input name="keyword" value={formData.keyword} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="input-label">開始日時:</label>
            <input type="datetime-local" name="start_date" value={formData.start_date} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="input-label">終了日時:</label>
            <input type="datetime-local" name="end_date" value={formData.end_date} onChange={handleChange} className="input-field" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button className="btn btn-secondary" onClick={onClose}>キャンセル</button>
            <button className="btn btn-success" onClick={handleSubmit}>保存</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPage;
