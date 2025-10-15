import React, { useState, useEffect } from "react";

const EventPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

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
      alert(`イベントを「${status === 'published' ? '公開' : '下書き'}」として更新しました`);
    } else {
      const newEvent = { ...saveData, id: Date.now() };
      setEvents([newEvent, ...events]);
      alert(`新規イベントを「${status === 'published' ? '公開' : '下書き'}」として作成しました`);
    }
    handleCloseModal();
  };

  const handleArchiveEvent = (eventId) => {
    if (window.confirm("このイベントをアーカイブしますか？")) {
      setEvents(events.map(ev => ev.id === eventId ? { ...ev, status: 'archived' } : ev));
      alert("イベントをアーカイブしました");
    }
  };

  const handleRestoreEvent = (eventId) => {
    setEvents(events.map(ev => ev.id === eventId ? { ...ev, status: 'draft' } : ev));
    alert("イベントを下書きとして復元しました");
  };

  const renderEvents = (evs, type = 'default') => {
    if (evs.length === 0) return <p className="p-4 text-slate-500">該当するイベントはありません</p>;

    return evs.map(ev => {
      const isDraft = ev.status === 'draft';
      return (
        <div key={ev.id} className={`flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg mb-3 bg-white shadow-sm transition-shadow duration-200 w-full ${isDraft ? 'border-dashed border-gray-400' : 'border-slate-200'}`}>
          <div className="flex items-center gap-4 mb-3 sm:mb-0 flex-grow">
            <img src={ev.banner} alt={ev.title} className="w-32 h-16 object-cover rounded-md" />
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-lg text-slate-800">{ev.title}</p>
                {ev.status === 'published' && <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">公開中</span>}
                {isDraft && <span className="text-xs font-bold text-gray-600 bg-gray-200 px-2 py-1 rounded-full">下書き</span>}
              </div>
              <p className="text-sm text-slate-500">{ev.start} ～ {ev.end}</p>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {type === 'archived' ? (
              <button onClick={() => handleRestoreEvent(ev.id)} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm font-semibold">復元</button>
            ) : (
              <>
                <button onClick={() => handleOpenModalForEdit(ev)} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md hover:bg-blue-200 text-sm font-semibold">編集</button>
                <button onClick={() => handleArchiveEvent(ev.id)} className="bg-red-100 text-red-800 px-4 py-2 rounded-md hover:bg-red-200 text-sm font-semibold">アーカイブ</button>
              </>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-slate-100 text-slate-800">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">

        <h1 className="text-3xl font-bold mb-6 text-slate-900 text-center">イベント管理</h1>
        
        {/* ★★ ここをFlexboxレイアウトに変更 ★★ */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <button onClick={handleOpenModalForNew} className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-sm hover:shadow-md transition-shadow w-full sm:w-auto">
            新規作成
          </button>
          
          <div className="flex rounded-lg bg-slate-200 p-1">
            {['ongoing', 'upcoming', 'past', 'archived'].map(tab => {
              const tabNames = { ongoing: '開催中', upcoming: '予定', past: '過去', archived: 'アーカイブ済み' };
              return (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)} 
                  className={`w-28 text-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab 
                      ? "bg-white text-blue-600 shadow" 
                      : "text-slate-600 hover:bg-slate-300/50"
                  }`}
                >
                  {tabNames[tab]}
                </button>
              );
            })}
          </div>
        </div>

        <div>
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

const EventFormModal = ({ event, onSave, onClose }) => {
  const [formData, setFormData] = useState({ title: "", start: "", end: "", banner: "" });

  useEffect(() => {
    if (event) {
      setFormData({ ...event });
    } else {
      const today = new Date().toISOString().split("T")[0];
      setFormData({ title: "", start: today, end: today, banner: "https://via.placeholder.com/200x80?text=NewEvent", status: "draft" });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (statusToSave) => {
    if (!formData.title) return alert("イベント名を入力してください");
    if (formData.start > formData.end) return alert("終了日は開始日以降に設定してください");
    onSave({ ...event, ...formData }, statusToSave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-6 text-slate-800">{event ? "イベント編集" : "新規イベント作成"}</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4"><label className="block mb-1 font-bold text-slate-600">イベント名:</label><input type="text" name="title" value={formData.title} onChange={handleChange} className="border p-2 rounded w-full border-slate-300" required /></div>
          <div className="mb-4"><label className="block mb-1 font-bold text-slate-600">開始日:</label><input type="date" name="start" value={formData.start} onChange={handleChange} className="border p-2 rounded w-full border-slate-300" /></div>
          <div className="mb-4"><label className="block mb-1 font-bold text-slate-600">終了日:</label><input type="date" name="end" value={formData.end} onChange={handleChange} className="border p-2 rounded w-full border-slate-300" /></div>
          <div className="mb-4"><label className="block mb-1 font-bold text-slate-600">バナーURL:</label><input type="url" name="banner" value={formData.banner} onChange={handleChange} className="border p-2 rounded w-full border-slate-300" /></div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded text-slate-700 bg-slate-200 hover:bg-slate-300 font-semibold">キャンセル</button>
            <button type="button" onClick={() => handleSubmit('draft')} className="px-4 py-2 rounded text-blue-800 bg-blue-100 hover:bg-blue-200 font-semibold">下書き保存</button>
            <button type="button" onClick={() => handleSubmit('published')} className="px-4 py-2 rounded text-white bg-green-600 hover:bg-green-700 font-semibold">公開して保存</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventPage;