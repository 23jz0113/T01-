import React, { useState, useEffect } from "react";

// --- サブコンポーネント: アイコン ---
const IconPlus = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const IconEdit = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const IconArchive = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>;
const IconRestore = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="12" y1="16" x2="12" y2="10"></line><polyline points="15 13 12 10 9 13"></polyline></svg>;
const IconEyeOff = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.01L3 3l18 18-3.35-3.35"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;
const IconEye = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>;


// --- サブコンポーネント: トースト通知 ---
const Toast = ({ message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const bgColor = type === 'success' ? 'bg-emerald-500' : 'bg-rose-500';
  return (
    <div className={`fixed top-5 right-5 z-[100] rounded-lg px-4 py-3 text-white shadow-lg ${bgColor}`}>
      {message}
    </div>
  );
};

// --- サブコンポーネント: 確認モーダル ---
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

// --- メインコンポーネント: EventPage ---
const EventPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '', visible: false });
  const [confirmation, setConfirmation] = useState({ isOpen: false, message: '', onConfirm: null, confirmText: '実行' });

  // ★★★ 変更点: 初期データに publishAt を追加、予約アイテムも追加 ★★★
  const initialData = [
    { id: 1, title: "ハロウィンコーデ", start: "2025-10-01", end: "2025-10-31", banner: "https://placehold.co/200x80/FF7A00/FFFFFF?text=Halloween", status: "published", publishAt: null },
    { id: 2, title: "クリスマスコーデ", start: "2025-12-01", end: "2025-12-25", banner: "https://placehold.co/200x80/D62828/FFFFFF?text=Christmas", status: "published", publishAt: null },
    { id: 3, title: "春の新作コーデ", start: "2026-04-01", end: "2026-04-30", banner: "https://placehold.co/200x80/9EF01A/333333?text=Spring", status: "published", publishAt: null },
    { id: 4, title: "バレンタイン（非公開）", start: "2026-02-01", end: "2026-02-14", banner: "https://placehold.co/200x80/E85D75/FFFFFF?text=Valentine", status: "draft", publishAt: null },
    { id: 5, title: "夏のコーデ（アーカイブ）", start: "2025-07-01", end: "2025-07-31", banner: "https://placehold.co/200x80/00A6FB/FFFFFF?text=Summer", status: "archived", publishAt: null },
    { id: 6, title: "（予約投稿）GWコーデ", start: "2026-04-29", end: "2026-05-05", banner: "https://placehold.co/200x80/34A853/FFFFFF?text=GW", status: "draft", publishAt: new Date(Date.now() + 10 * 60 * 1000).toISOString() }, // 10分後
  ];

  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem("managedEvents");
    if (savedEvents) return JSON.parse(savedEvents);
    localStorage.setItem("managedEvents", JSON.stringify(initialData));
    return initialData;
  });
  
  useEffect(() => {
    localStorage.setItem("managedEvents", JSON.stringify(events));
  }, [events]);

  // ★★★ 変更点: 自動公開チェック用のuseEffectを追加 ★★★
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toISOString();
      let changed = false;

      setEvents(prevEvents => {
        const updated = prevEvents.map(ev => {
          if (ev.status === 'draft' && ev.publishAt && ev.publishAt <= now) {
            // 開始日が未来の場合は、予約時間になっても公開しない（「予定」タブに残る）
            if (ev.start > now.split("T")[0]) {
               // ただし、ステータスは公開にしておく（予定タブで「公開中」として表示される）
               changed = true;
               return { ...ev, status: 'published', publishAt: null, updatedAt: now };
            }
            // 開始日が今日以前なら即時「開催中」タブへ移動
            changed = true;
            return { ...ev, status: 'published', publishAt: null, updatedAt: now };
          }
          return ev;
        });

        if (changed) {
          // ここではトーストを表示しない（バックグラウンド実行のため）
          return updated;
        }
        return prevEvents;
      });

    }, 10000); // 10秒ごとにチェック

    return () => clearInterval(interval);
  }, []);

  const showToast = (message, type = 'success') => setToast({ message, type, visible: true });

  const showConfirmation = (message, onConfirm, confirmText = '実行') => setConfirmation({ isOpen: true, message, onConfirm, confirmText });
  const hideConfirmation = () => setConfirmation({ isOpen: false, message: '', onConfirm: null, confirmText: '実行' });

  
  const today = new Date().toISOString().split("T")[0];
  const publishedEvents = events.filter(ev => ev.status === 'published');
  // ★★★ 変更点: draftは「非公開」を意味する ★★★
  const draftEvents = events.filter(ev => ev.status === 'draft');
  const archivedEvents = events.filter(ev => ev.status === 'archived');
  const ongoingEvents = publishedEvents.filter(ev => ev.start <= today && ev.end >= today);
  const upcomingEvents = publishedEvents.filter(ev => ev.start > today);
  const pastEvents = publishedEvents.filter(ev => ev.end < today);

  const handleOpenModalForNew = () => { setEditingEvent(null); setIsModalOpen(true); };
  const handleOpenModalForEdit = (event) => { setEditingEvent(event); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setEditingEvent(null); };

  // ★★★ 変更点: handleSaveEventを予約投稿ロジックに対応 ★★★
  const handleSaveEvent = (eventData) => {
    // バリデーション
    if (!eventData.title) {
      showToast("イベント名を入力してください", "error");
      return;
    }
    if (eventData.start > eventData.end) {
      showToast("終了日は開始日以降に設定してください", "error");
      return;
    }

    const now = new Date().toISOString();
    let effectiveStatus = eventData.status;
    let effectivePublishAt = eventData.publishAt ? new Date(eventData.publishAt).toISOString() : null;
    let toastMessage = "";
    let showConfirm = false;

    if (eventData.status === 'published') {
      if (effectivePublishAt && effectivePublishAt > now) {
        // 「公開」を選んだが、日時が未来 -> 予約投稿
        effectiveStatus = 'draft'; // ステータスは「非公開」として保存
        toastMessage = "公開予約しました";
      } else {
        // 「公開」を選び、日時が今/過去/なし -> 即時公開
        effectiveStatus = 'published';
        effectivePublishAt = null; // 予約日時はクリア
        toastMessage = "イベントを公開しました";
        showConfirm = true; // 即時公開のみ確認
      }
    } else {
      // 「非公開」を選んだ
      effectiveStatus = 'draft';
      if (effectivePublishAt && effectivePublishAt > now) {
        // 非公開だが、予約日時は保持
        toastMessage = "公開予約を非公開として保存しました";
      } else {
        // ただの非公開保存
        effectivePublishAt = null; // 過去の予約日時はクリア
        toastMessage = "非公開として保存しました";
      }
    }

    const saveData = eventData.id
      ? { ...eventData, status: effectiveStatus, publishAt: effectivePublishAt, updatedAt: now }
      : { ...eventData, id: Date.now(), status: effectiveStatus, publishAt: effectivePublishAt, createdAt: now };

    // 実行ロジック
    const saveLogic = () => {
      if (saveData.id) {
        setEvents(events.map(ev => (ev.id === saveData.id ? saveData : ev)));
      } else {
        setEvents([{ ...saveData, id: Date.now() }, ...events]);
      }
      showToast(toastMessage);
      handleCloseModal();
      hideConfirmation(); // 確認モーダルを閉じる
    };

    // 即時公開の場合のみ確認
    if (showConfirm) {
      showConfirmation(
        `イベント「${saveData.title}」を今すぐ公開しますか？`,
        saveLogic,
        "公開する"
      );
    } else {
      // 予約投稿や非公開保存は確認なしで実行
      saveLogic();
    }
  };
  
  const handleArchiveEvent = (eventId) => {
    // ... (変更なし) ...
    const eventToArchive = events.find(ev => ev.id === eventId);
    if (!eventToArchive) return;
    
    showConfirmation(
      `イベント「${eventToArchive.title}」を\nアーカイブしますか？`,
      () => {
        setEvents(events.map(ev => ev.id === eventId ? { ...ev, status: 'archived' } : ev));
        showToast("イベントをアーカイブしました");
        hideConfirmation();
      },
      "アーカイブ"
    );
  };

  const handleRestoreEvent = (eventId) => {
    // ... (変更なし) ...
    const eventToRestore = events.find(ev => ev.id === eventId);
    if (!eventToRestore) return;

    showConfirmation(
      // ★★★ 変更点: 表記を「非公開」に変更 ★★★
      `イベント「${eventToRestore.title}」を\n非公開として復元しますか？`,
      () => {
        setEvents(events.map(ev => ev.id === eventId ? { ...ev, status: 'draft' } : ev));
        showToast("イベントを非公開として復元しました");
        hideConfirmation();
      },
      "復元する"
    );
  };
  
  const handleUnpublishEvent = (eventId) => {
    // ... (変更なし) ...
    const eventToUnpublish = events.find(ev => ev.id === eventId);
    if (!eventToUnpublish) return;

    showConfirmation(
      // ★★★ 変更点: 表記を「非公開」に変更 ★★★
      `イベント「${eventToUnpublish.title}」を\n非公開に戻しますか？`,
      () => {
        setEvents(events.map(ev => ev.id === eventId ? { ...ev, status: 'draft' } : ev));
        showToast("イベントを非公開に戻しました");
        hideConfirmation();
      },
      "非公開にする"
    );
  };

  const handlePublishEvent = (eventId) => {
    // ... (変更なし) ...
    const eventToPublish = events.find(ev => ev.id === eventId);
    if (!eventToPublish) return;

    // バリデーション
    if (eventToPublish.start > eventToPublish.end) {
      showToast("終了日は開始日以降に設定してください。\n編集画面から日付を修正してください。", "error");
      return;
    }

    showConfirmation(
      `イベント「${eventToPublish.title}」を\n公開しますか？`,
      () => {
        setEvents(events.map(ev => ev.id === eventId ? { ...ev, status: 'published' } : ev));
        showToast("イベントを公開しました");
        hideConfirmation();
      },
      "公開する"
    );
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
        <div className="flex flex-grow items-center gap-4 overflow-hidden">
          <img 
            src={ev.banner} 
            alt={ev.title} 
            className="h-16 w-32 rounded-md object-cover flex-shrink-0"
            onError={(e) => e.currentTarget.src = 'https://placehold.co/200x80/CCCCCC/FFFFFF?text=No+Image'}
          />
          <div className="truncate">
            <div className="flex items-center gap-2">
              <p className="font-bold text-lg text-slate-800 truncate">{ev.title}</p>
              {ev.status === 'published' && <span className="status-badge status-badge-published flex-shrink-0">公開中</span>}
              {/* ★★★ 変更点: 予約バッジと非公開バッジの分岐 ★★★ */}
              {ev.status === 'draft' && (
                ev.publishAt ?
                <span className="status-badge status-badge-scheduled flex-shrink-0">公開予約中</span> :
                <span className="status-badge status-badge-draft flex-shrink-0">非公開</span>
              )}
            </div>
            <p className="text-sm text-slate-500">{ev.start} ～ {ev.end}</p>
            {/* ★★★ 変更点: 予約日時を表示 ★★★ */}
            {ev.status === 'draft' && ev.publishAt && (
              <p className="text-sm text-blue-600 mt-1">
                公開予定: {new Date(ev.publishAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-shrink-0 gap-2 self-end sm:self-center">
          {type === 'archived' ? (
            <button onClick={() => handleRestoreEvent(ev.id)} className="btn btn-success"><IconRestore />復元</button>
          ) : (
            <>
              <button onClick={() => handleOpenModalForEdit(ev)} className="btn btn-ghost"><IconEdit />編集</button>
              
              {ev.status === 'published' && (
                <button onClick={() => handleUnpublishEvent(ev.id)} className="btn btn-secondary"><IconEyeOff />非公開</button>
              )}
              {ev.status === 'draft' && (
                <>
                  {/* ★★★ 変更点: ボタン名を「今すぐ公開」に変更 ★★★ */}
                  <button onClick={() => handlePublishEvent(ev.id)} className="btn btn-success"><IconEye />今すぐ公開</button>
                  <button onClick={() => handleArchiveEvent(ev.id)} className="btn btn-danger"><IconArchive />アーカイブ</button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-800 sm:p-6">
      {toast.visible && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast({ ...toast, visible: false })} />}
      {confirmation.isOpen && <ConfirmationModal {...confirmation} onCancel={hideConfirmation} />}
      
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
              const tabNames = { ongoing: '開催中', upcoming: '予定', past: '過去', archived: 'アーカイブ' };
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
          {/* ★★★ 変更点: 予定タブにも非公開(draft)イベントを表示 ★★★ */}
          {activeTab === "upcoming" && renderEvents([...draftEvents.filter(ev => ev.start > today), ...upcomingEvents])}
          {activeTab === "past" && renderEvents(pastEvents)}
          {activeTab === "archived" && renderEvents(archivedEvents, 'archived')}
        </div>

      </div>
      {isModalOpen && <EventFormModal event={editingEvent} onSave={handleSaveEvent} onClose={handleCloseModal} />}
    </div>
  );
};

// --- サブコンポーネント: モーダル ---
// ★★★ 変更点: EventFormModalを予約機能に対応 ★★★
const EventFormModal = ({ event, onSave, onClose }) => {
  
  // ★★★ 変更点: ISO文字列をdatetime-localの入力値に変換するヘルパー ★★★
  const formatDateTimeForInput = (isoString) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      // タイムゾーンオフセットを考慮してローカル時刻に補正
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      // 'YYYY-MM-DDTHH:mm' 形式にスライス
      return date.toISOString().slice(0, 16);
    } catch (e) {
      return "";
    }
  };

  const [formData, setFormData] = useState({ 
    title: "", 
    start: "", 
    end: "", 
    banner: "",
    status: "draft",
    publishAt: "" // ★★★ 変更点: publishAt を state に追加
  });
  const [error, setError] = useState(""); // ★★★ 変更点: エラーstateを追加

  useEffect(() => {
    if (event) {
      // 編集時はイベントのデータをセット
      setFormData({ 
        ...event,
        // ★★★ 変更点: publishAtをinputのvalue形式にフォーマット ★★★
        publishAt: formatDateTimeForInput(event.publishAt)
      });
    } else {
      // 新規作成時
      const today = new Date().toISOString().split("T")[0];
      setFormData({ 
        title: "", 
        start: today, 
        end: today, 
        banner: "https://placehold.co/200x80/EEEEEE/333333?text=NewEvent", 
        status: "draft", // 新規作成時はデフォルト非公開
        publishAt: ""
      });
    }
    setError(""); // ★★★ 変更点: モーダル開閉時にエラーをリセット
  }, [event]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    // ★★★ 変更点: 入力時にエラーをリセット
    if (e.target.name === 'title' && e.target.value.trim()) setError("");
    if ((e.target.name === 'start' || e.target.name === 'end') && formData.start <= formData.end) setError("");
  };

  const handleStatusChange = (newStatus) => {
    setFormData(prev => ({ ...prev, status: newStatus }));
  };

  const handleSubmit = () => {
    // ★★★ 変更点: モーダル内でも簡易バリデーションを行う
    if (!formData.title.trim()) return setError("イベント名を入力してください");
    if (formData.start > formData.end) return setError("終了日は開始日以降に設定してください");
    
    // onSaveに渡す際、publishAtは 'YYYY-MM-DDTHH:mm' のまま
    onSave({ ...formData });
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
          
          {/* ★★★ 変更点: 公開予約日時 input を追加 ★★★ */}
          <div>
            <label className="input-label">公開予約日時 (任意):</label>
            <input
              type="datetime-local"
              name="publishAt"
              value={formData.publishAt}
              onChange={handleChange}
              className="input-field"
            />
            <p className="text-xs text-slate-500 mt-1">
              日時を指定して「公開中」で保存すると、その時間に自動公開されます。
            </p>
          </div>
          
          {/* ★★★ 変更点: ステータス選択UIの表記を「非公開」に変更 ★★★ */}
          <div>
            <label className="input-label">ステータス:</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="status" 
                  value="draft" 
                  checked={formData.status === 'draft'} 
                  onChange={() => handleStatusChange('draft')}
                  className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"
                />
                <span className="status-badge status-badge-draft">非公開</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="status" 
                  value="published" 
                  checked={formData.status === 'published'} 
                  onChange={() => handleStatusChange('published')}
                  className="form-radio h-5 w-5 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="status-badge status-badge-published">公開中</span>
              </label>
            </div>
          </div>

          {/* ★★★ 変更点: エラー表示を追加 ★★★ */}
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

export default EventPage;

