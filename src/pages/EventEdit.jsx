import React, { useState, useEffect } from "react";

/* --- アイコン --- */
const IconPlus = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const IconEdit = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;

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

/* --- イベントモーダル --- */
const EventFormModal = ({ event, onSave, onClose }) => {
  const [formData, setFormData] = useState({ keyword: "", start_date: "", end_date: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (event) {
      setFormData({
        keyword: event.keyword?.name || event.keyword || "",
        start_date: event.start_date?.slice(0, 16) || "",
        end_date: event.end_date?.slice(0, 16) || "",
      });
    } else {
      setFormData({ keyword: "", start_date: "", end_date: "" });
    }
    setError("");
  }, [event]);

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    if (!formData.keyword.trim()) return setError("キーワードを入力してください");
    if (!formData.start_date || !formData.end_date) return setError("開始日・終了日を入力してください");
    onSave({
      ...event,
      keyword: { name: formData.keyword },
      start_date: formData.start_date,
      end_date: formData.end_date,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6 text-slate-800">{event ? "イベント編集" : "新規イベント"}</h2>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="input-label">キーワード:</label>
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
          {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md">{error}</p>}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn btn-secondary">キャンセル</button>
            <button type="button" onClick={handleSubmit} className="btn btn-success">保存する</button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* --- メイン --- */
const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("published");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "", visible: false });
  const [confirmation, setConfirmation] = useState({ isOpen: false, message: "", onConfirm: null, confirmText: "実行" });

  /* --- API取得 --- */
  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost/T01/public/api/rankings");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
      showToast("取得失敗", "error");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const showToast = (message, type = "success") => setToast({ message, type, visible: true });
  const showConfirmation = (message, onConfirm, confirmText = "実行") => setConfirmation({ isOpen: true, message, onConfirm, confirmText });
  const hideConfirmation = () => setConfirmation({ isOpen: false, message: "", onConfirm: null, confirmText: "実行" });

  const handleOpenNew = () => { setEditingEvent(null); setIsModalOpen(true); };
  const handleEdit = (e) => { setEditingEvent(e); setIsModalOpen(true); };
  const handleClose = () => { setIsModalOpen(false); setEditingEvent(null); };

  /* --- 保存（編集 or 新規） --- */
  /* --- 保存（編集 or 新規） --- */
const handleSave = async (event) => {
  try {
    if (event.id) {
      // ✅ 既存イベント → 更新APIへ
      const res = await fetch(`http://localhost/T01/public/api/rankings/update/${event.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keywords_id: event.keyword.id,
          start_date: event.start_date,
          end_date: event.end_date
        }),
      });
      if (!res.ok) throw new Error("更新失敗");
    } else {
      // ✅ 新規イベント → uploadAPIへ
      const res = await fetch("http://localhost/T01/public/api/rankings/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: event.keyword.name,
          start_date: event.start_date,
          end_date: event.end_date,
        }),
      });
      if (!res.ok) throw new Error("登録失敗");
    }

    showToast("保存しました");
    handleClose();

    // 再取得して反映
    const refetch = await fetch("http://localhost/T01/public/api/rankings");
    const newData = await refetch.json();
    setEvents(newData);

  } catch (err) {
    console.error(err);
    showToast("保存に失敗しました", "error");
  }
};


  /* --- 削除 --- */
  const handleDelete = (id) => {
    const evt = events.find((e) => e.id === id);
    if (!evt) return;
    showConfirmation(`「${evt.keyword?.name || evt.keyword || ""}」を削除しますか？`, async () => {
      try {
        const res = await fetch(`http://localhost/T01/public/api/rankings/destroy/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("削除失敗");
        await fetchEvents();
        showToast("削除しました");
        hideConfirmation();
      } catch (err) {
        console.error(err);
        showToast("削除に失敗しました", "error");
      }
    }, "削除");
  };

  /* --- 公開判定 --- */
  const getStatusBadge = (event) => {
    const now = new Date();
    const start = new Date(event.start_date);
    const end = new Date(event.end_date);
    return now >= start && now <= end
      ? <span className="status-badge status-badge-published">公開中</span>
      : <span className="status-badge status-badge-draft">非公開</span>;
  };

  /* --- タブフィルター --- */
  const filteredEvents = events.filter((e) => {
    const now = new Date();
    const start = new Date(e.start_date);
    const end = new Date(e.end_date);
    if (activeTab === "published") return now >= start && now <= end;
    if (activeTab === "archived") return now < start || now > end;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      {toast.visible && <Toast {...toast} onDismiss={() => setToast({ ...toast, visible: false })} />}
      {confirmation.isOpen && <ConfirmationModal {...confirmation} onCancel={hideConfirmation} />}

      <div className="mx-auto max-w-7xl bg-white rounded-2xl p-6 shadow-lg sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">イベント管理</h1>
            <p className="text-slate-500 mt-1">開始・終了日時から公開状況を自動判定します。</p>
          </div>
          <button onClick={handleOpenNew} className="btn btn-primary w-full sm:w-auto"><IconPlus />新規作成</button>
        </div>

        <div className="my-6 flex justify-center">
          <div className="tab-group">
            {["published", "archived"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-item ${activeTab === tab ? "tab-item-active" : "tab-item-inactive"}`}
              >
                {tab === "published" ? "公開中" : "非公開"}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredEvents.length ? (
            filteredEvents.map((event) => (
              <div key={event.id} className="event-card">
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-bold text-lg text-slate-800">{event.keyword?.name || event.keyword || "なし"}</p>
                    {getStatusBadge(event)}
                  </div>
                  <p className="text-sm text-slate-600">
                    開始: {new Date(event.start_date).toLocaleString()}<br />
                    終了: {new Date(event.end_date).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-shrink-0 gap-2 self-end sm:self-center">
                  <button onClick={() => handleEdit(event)} className="btn btn-ghost"><IconEdit />編集</button>
                  <button onClick={() => handleDelete(event.id)} className="btn btn-danger">削除</button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-10 border-2 border-dashed rounded-lg text-slate-500">
              <p className="font-bold">イベントがありません</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && <EventFormModal event={editingEvent} onSave={handleSave} onClose={handleClose} />}
    </div>
  );
};

export default EventPage;
