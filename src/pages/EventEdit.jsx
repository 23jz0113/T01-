import React, { useState, useEffect } from "react";

/* --- アイコン --- */
const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconEdit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

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
  <div className="modal-overlay" style={{ zIndex: 200 }}>
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
const EventFormModal = ({ event, onSave, onClose, isKeywordLocked }) => {
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

  const handleChange = (e) => {
    if (isKeywordLocked && e.target.name === "keyword") return;
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!formData.keyword.trim()) return setError("キーワードを入力してください");
    if (!formData.start_date || !formData.end_date) return setError("開始日・終了日を入力してください");

    onSave({
      ...event,
      keyword: {
        id: event?.keyword?.id,
        name: formData.keyword,
      },
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
            <input
              name="keyword"
              value={formData.keyword}
              onChange={handleChange}
              className={`input-field ${isKeywordLocked ? "bg-gray-200 cursor-not-allowed" : ""}`}
              disabled={isKeywordLocked}
            />
            {isKeywordLocked && <p className="text-xs text-gray-500 mt-1">公開中のキーワードは変更できません</p>}
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

  const fetchEvents = async () => {
    try {
      const res = await fetch("https://style.mydns.jp/T01/api/rankings");
      if (!res.ok) {
        if (res.status === 404) {
          // 404の場合はイベントがないとみなし、空の配列をセット
          setEvents([]);
          return;
        }
        throw new Error(`Server responded with status ${res.status}`);
      }
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error(err);
      showToast("イベントの取得に失敗しました", "error");
    }
  };

  useEffect(() => {
     fetchEvents();
  }, []);

  const showToast = (message, type = "success") => setToast({ message, type, visible: true });
  const showConfirmation = (message, onConfirm, confirmText = "実行") =>
     setConfirmation({ isOpen: true, message, onConfirm, confirmText });
  const hideConfirmation = () =>
     setConfirmation({ isOpen: false, message: "", onConfirm: null, confirmText: "実行" });

  const handleOpenNew = () => {
    setEditingEvent(null);
    setIsModalOpen(true); 
  };

  const handleEdit = (e) => {
    setEditingEvent(e); 
    setIsModalOpen(true); 
  };

  const handleClose = () => {
    setIsModalOpen(false); 
    setEditingEvent(null); 
  };

  const isPublished = (event) => {
    const now = new Date();
    const start = new Date(event.start_date);
    const end = new Date(event.end_date);
    return now >= start && now <= end;
  };

  const isPastEvent = (event) => {
    const now = new Date();
    const end = new Date(event.end_date);
    return now > end;
  };

  const canEditKeyword = (event) => !isPublished(event) && !isPastEvent(event);
  const canDelete = (event) => !isPublished(event) && !isPastEvent(event);

  const formatDateTime = (datetime) => {
    const d = new Date(datetime);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const h = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${y}/${m}/${day} ${h}:${min}`;
  };

  /* 保存処理（API すべて修正版） */
  const handleSave = async (evt, skipCheck = false) => {
    const now = new Date();
    const startDate = new Date(evt.start_date);
    const endDate = new Date(evt.end_date);

    if (!skipCheck) {
      const willBePublished = now >= startDate && now <= endDate;
      const currentlyPublished = editingEvent ? isPublished(editingEvent) : false;

      if (willBePublished && !currentlyPublished) {
        return showConfirmation(
          "開始日時を今日に変更したため、このまま公開されます。\nよろしいですか？",
          () => { hideConfirmation(); handleSave(evt, true); },
          "公開する"
        );
      }
    }

    try {
      let keywordId = evt.keyword?.id;

      /* --- キーワード更新 or 新規 --- */
      if (keywordId) {
        const keywordRes = await fetch(`https://style.mydns.jp/T01/api/keywords/${keywordId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: evt.keyword.name }),
        });
        if (!keywordRes.ok) throw new Error("既存キーワード更新失敗");
      } else {
        const keywordRes = await fetch("https://style.mydns.jp/T01/api/keywords", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: evt.keyword.name }),
        });
        if (!keywordRes.ok) throw new Error("新規キーワード作成失敗");
        const keywordData = await keywordRes.json();
        keywordId = keywordData.data?.id;
      }

      /* --- ランキング更新 or 新規 --- */
      let rankingRes;
      if (evt.id) {
        rankingRes = await fetch(`https://style.mydns.jp/T01/api/rankings/${evt.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            keywords_id: keywordId,
            start_date: evt.start_date,
            end_date: evt.end_date,
          }),
        });
      } else {
        rankingRes = await fetch("https://style.mydns.jp/T01/api/rankings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            keywords_id: keywordId,
            start_date: evt.start_date,
            end_date: evt.end_date,
          }),
        });
      }

      if (!rankingRes.ok) throw new Error("ランキング保存失敗");

      showToast("保存しました");
      handleClose();
      fetchEvents();
    } catch (err) {
      console.error(err);
      showToast("保存に失敗しました", "error");
    }
  };

  /* 削除処理（API 修正版） */
  const handleDelete = (id) => {
    const evt = events.find((e) => e.id === id);
    if (!evt) return;

    if (!canDelete(evt)) {
      showToast("削除できません", "error");
      return;
    }

    showConfirmation(
      `「${evt.keyword?.name || evt.keyword || ""}」を削除しますか？`,
      async () => {
        hideConfirmation();
        try {
          const res = await fetch(`https://style.mydns.jp/T01/api/rankings/${id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ _method: "DELETE" }),
          });

          if (!res.ok) {
            let errorMessage = "削除に失敗しました";
            if (res.status === 404) {
              errorMessage = "アイテムはすでに削除されています。";
              fetchEvents(); // リストを再同期
            } else if (res.status === 405) {
              errorMessage = "サーバーがこの操作を許可していません。";
            } else if (res.status === 403) {
              errorMessage = "権限がありません。";
            }
            showToast(errorMessage, "error");
            return;
          }

          fetchEvents();
          showToast("削除しました");
        } catch (err) {
          console.error(err);
          showToast("削除中にエラーが発生しました", "error");
        }
      },
      "削除"
    );
  };

  const getStatusBadge = (event) => {
    const now = new Date();
    const start = new Date(event.start_date);
    const end = new Date(event.end_date);

    if (now < start) return <span className="status-badge bg-blue-500 text-white">公開予定</span>;
    if (now > end) return <span className="status-badge bg-gray-400 text-white">過去イベント</span>;
    return <span className="status-badge bg-green-500 text-white">公開中</span>;
  };

  const filteredEvents = events.filter((e) => {
    const now = new Date();
    const start = new Date(e.start_date);
    const end = new Date(e.end_date);
    if (activeTab === "scheduled") return now < start;
    if (activeTab === "published") return now >= start && now <= end;
    if (activeTab === "archived") return now > end;
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
          <button onClick={handleOpenNew} className="btn btn-primary w-full sm:w-auto">
            <IconPlus /> 新規作成
          </button>
        </div>

        <div className="my-6 flex justify-center">
          <div className="tab-group">
            <button onClick={() => setActiveTab("scheduled")} className={`tab-item ${activeTab === "scheduled" ? "tab-item-active" : "tab-item-inactive"}`}>公開予定</button>
            <button onClick={() => setActiveTab("published")} className={`tab-item ${activeTab === "published" ? "tab-item-active" : "tab-item-inactive"}`}>公開中</button>
            <button onClick={() => setActiveTab("archived")} className={`tab-item ${activeTab === "archived" ? "tab-item-active" : "tab-item-inactive"}`}>過去イベント</button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredEvents.length ? filteredEvents.map((event) => (
            <div key={event.id} className="event-card">
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-bold text-lg text-slate-800">{event.keyword?.name || event.keyword || "なし"}</p>
                  {getStatusBadge(event)}
                </div>
                <p className="text-sm text-slate-600">
                  開始: {formatDateTime(event.start_date)}<br />
                  終了: {formatDateTime(event.end_date)}
                </p>
              </div>

              <div className="flex flex-shrink-0 gap-2 self-end sm:self-center">
                {!isPastEvent(event) && <button onClick={() => handleEdit(event)} className="btn btn-ghost"><IconEdit /> 編集</button>}
                {canDelete(event) && <button onClick={() => handleDelete(event.id)} className="btn btn-danger">削除</button>}
              </div>
            </div>
          )) : (
            <div className="text-center p-10 border-2 border-dashed rounded-lg text-slate-500">
              <p className="font-bold">イベントがありません</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <EventFormModal
          event={editingEvent}
          onSave={handleSave}
          onClose={handleClose}
          isKeywordLocked={editingEvent && !canEditKeyword(editingEvent)}
        />
      )}
    </div>
  );
};

export default EventPage;
