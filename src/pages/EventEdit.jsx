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

// --- メインコンポーネント: EventPage ---
const EventPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '', visible: false });

  // ... (useStateとuseEffect for eventsは変更なし)
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem("managedEvents");
    return savedEvents ? JSON.parse(savedEvents) : [
      { id: 1, title: "ハロウィンコーデ", start: "2025-10-01", end: "2025-10-31", banner: "https://via.placeholder.com/200x80?text=Halloween", status: "published" },
      { id: 2, title: "クリスマスコーデ", start: "2025-12-01", end: "2025-12-25", banner: "https://via.placeholder.com/200x80?text=Christmas", status: "published" },
      { id: 3, title: "春の新作コーデ", start: "2026-04-01", end: "2026-04-30", banner: "https://via.placeholder.com/200x80?text=Spring", status: "published" },
      { id: 4, title: "バレンタイン（下書き）", start: "2026-02-01", end: "2026-02-14", banner: "https://via.placeholder.com/200x80?text=Valentine", status: "draft" },
      { id: 5, title: "過去のイベント（アーカイブ）", start: "2025-01-01", end: "2025-01-15", banner: "https://via.placeholder.com/200x80?text=Archived", status: "archived" },
    ];
  });
  useEffect(() => {
    localStorage.setItem("managedEvents", JSON.stringify(events));
  }, [events]);

  const showToast = (message, type = 'success') => setToast({ message, type, visible: true });

  const today = new Date().toISOString().split("T")[0];
  const publishedEvents = events.filter(ev => ev.status === 'published');
  const draftEvents = events.filter(ev => ev.status === 'draft');
  const archivedEvents = events.filter(ev => ev.status === 'archived');
  const ongoingEvents = publishedEvents.filter(ev => ev.start <= today && ev.end >= today);
  const upcomingEvents = publishedEvents.filter(ev => ev.start > today);
  const pastEvents = publishedEvents.filter(ev => ev.end < today);

  const handleOpenModalForNew = () => { setEditingEvent(null); setIsModalOpen(true); };
  const handleOpenModalForEdit = (event) => { setEditingEvent(event); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setEditingEvent(null); };

  const handleSaveEvent = (eventData, status) => {
    const saveData = { ...eventData, status };
    if (saveData.id) {
      setEvents(events.map(ev => (ev.id === saveData.id ? saveData : ev)));
      showToast(`イベントを「${status === 'published' ? '公開' : '下書き'}」として更新しました`);
    } else {
      setEvents([{ ...saveData, id: Date.now() }, ...events]);
      showToast(`新規イベントを「${status === 'published' ? '公開' : '下書き'}」として作成しました`);
    }
    handleCloseModal();
  };
  
  const handleArchiveEvent = (eventId) => {
    setEvents(events.map(ev => ev.id === eventId ? { ...ev, status: 'archived' } : ev));
    showToast("イベントをアーカイブしました");
  };

  const handleRestoreEvent = (eventId) => {
    setEvents(events.map(ev => ev.id === eventId ? { ...ev, status: 'draft' } : ev));
    showToast("イベントを下書きとして復元しました");
  };

  const renderEvents = (evs, type = 'default') => {
    if (evs.length === 0) return (
        <div className="text-center p-10 border-2 border-dashed rounded-lg text-slate-500">
            <p className="font-bold">イベントがありません</p>
            <p className="text-sm mt-1">新しいイベントを作成してみましょう！</p>
        </div>
    );

    return evs.map(ev => (
      <div key={ev.id} className={`event-card ${ev.status === 'draft' ? 'event-card-draft' : ''}`}>
        <div className="flex flex-grow items-center gap-4">
          <img src={ev.banner} alt={ev.title} className="h-16 w-32 rounded-md object-cover" />
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-lg text-slate-800">{ev.title}</p>
              {ev.status === 'published' && <span className="status-badge status-badge-published">公開中</span>}
              {ev.status === 'draft' && <span className="status-badge status-badge-draft">下書き</span>}
            </div>
            <p className="text-sm text-slate-500">{ev.start} ～ {ev.end}</p>
          </div>
        </div>
        <div className="flex flex-shrink-0 gap-2">
          {type === 'archived' ? (
            <button onClick={() => handleRestoreEvent(ev.id)} className="btn btn-success"><IconRestore />復元</button>
          ) : (
            <>
              <button onClick={() => handleOpenModalForEdit(ev)} className="btn btn-ghost"><IconEdit />編集</button>
              <button onClick={() => handleArchiveEvent(ev.id)} className="btn btn-danger"><IconArchive />アーカイブ</button>
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
              <h1 className="text-3xl font-bold text-slate-900">イベント管理</h1>
              <p className="text-slate-500 mt-1">イベントの作成、編集、管理を行います。</p>
            </div>
            <button onClick={handleOpenModalForNew} className="btn btn-primary w-full sm:w-auto">
                <IconPlus />
                新規作成
            </button>
        </div>
        
        <div className="my-6 flex justify-center">
          <div className="tab-group">
            {['ongoing', 'upcoming', 'past', 'archived'].map(tab => {
              const tabNames = { ongoing: '開催中', upcoming: '予定', past: '過去', archived: 'アーカイブ済み' };
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
          {activeTab === "ongoing" && renderEvents(ongoingEvents)}
          {activeTab === "upcoming" && renderEvents([...draftEvents, ...upcomingEvents])}
          {activeTab === "past" && renderEvents(pastEvents)}
          {activeTab === "archived" && renderEvents(archivedEvents, 'archived')}
        </div>

      </div>
      {isModalOpen && <EventFormModal event={editingEvent} onSave={handleSaveEvent} onClose={handleCloseModal} />}
    </div>
  );
};

// --- サブコンポーネント: モーダル ---
const EventFormModal = ({ event, onSave, onClose }) => {
  const [formData, setFormData] = useState({ title: "", start: "", end: "", banner: "" });

  useEffect(() => {
    if (event) setFormData({ ...event });
    else {
      const today = new Date().toISOString().split("T")[0];
      setFormData({ title: "", start: today, end: today, banner: "https://via.placeholder.com/200x80?text=NewEvent", status: "draft" });
    }
  }, [event]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (statusToSave) => {
    if (!formData.title) return alert("イベント名を入力してください");
    if (formData.start > formData.end) return alert("終了日は開始日以降に設定してください");
    onSave({ ...event, ...formData }, statusToSave);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6 text-slate-800">{event ? "イベント編集" : "新規イベント作成"}</h2>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div><label className="input-label">イベント名:</label><input type="text" name="title" value={formData.title} onChange={handleChange} className="input-field" required /></div>
          <div><label className="input-label">開始日:</label><input type="date" name="start" value={formData.start} onChange={handleChange} className="input-field" /></div>
          <div><label className="input-label">終了日:</label><input type="date" name="end" value={formData.end} onChange={handleChange} className="input-field" /></div>
          <div><label className="input-label">バナーURL:</label><input type="url" name="banner" value={formData.banner} onChange={handleChange} className="input-field" /></div>
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

export default EventPage;