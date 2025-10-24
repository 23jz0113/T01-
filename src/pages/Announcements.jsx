import React, { useState, useEffect } from "react";

/* --- アイコン群 --- */
const IconPlus = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const IconEdit = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconArchive = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>;
const IconRestore = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="12" y1="16" x2="12" y2="10"/><polyline points="15 13 12 10 9 13"/></svg>;
const IconEyeOff = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.01L3 3l18 18-3.35-3.35"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>;
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
const AnnouncementPage = () => {
  const [activeTab, setActiveTab] = useState("published");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "", visible: false });
  const [confirmation, setConfirmation] = useState({ isOpen: false, message: '', onConfirm: null, confirmText: '実行' });

  // --- 初期データ（テスト用） ---
  const initialData = [
    {
      id: 1,
      title: "新機能リリースのお知らせ",
      content: "管理画面に「イベントページ」が追加されました！\nぜひご利用ください。",
      status: "published",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2日前
      publishAt: null,
    },
    {
      id: 2,
      title: "メンテナンス予定",
      content: "10月30日 2:00〜4:00 の間、サーバーメンテナンスを行います。",
      status: "draft", 
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 昨日
      publishAt: null,
    },
    {
      id: 3,
      title: "旧イベントの終了報告",
      content: "夏季限定イベント「サマーフェスタ2025」は終了しました。\nご参加ありがとうございました！",
      status: "archived",
      archivedAt: new Date(Date.now() - 86400000 * 10).toISOString(), // 10日前
      createdAt: new Date(Date.now() - 86400000 * 20).toISOString(), // 20日前
      publishAt: null,
    },
    // ★★★ 変更点: 予約投稿のテストデータを追加 ★★★
    {
      id: 4,
      title: "（予約投稿）もうすぐ公開",
      content: "このお知らせは 14:30 に公開されます。",
      status: "draft",
      // JST 2025/10/24 14:30 (現在時刻 14:20) を想定
      publishAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), 
      createdAt: new Date().toISOString(),
    },
  ];

  // --- LocalStorage管理 ---
  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem("managedAnnouncements");
    if (saved) return JSON.parse(saved);
    localStorage.setItem("managedAnnouncements", JSON.stringify(initialData));
    return initialData;
  });

  /* --- 30日経過したアーカイブ削除 --- */
  useEffect(() => {
    // ... (変更なし) ...
    const now = new Date();
    const updated = announcements.filter(a => {
      if (a.status !== "archived" || !a.archivedAt) return true;
      const diff = (now - new Date(a.archivedAt)) / (1000 * 60 * 60 * 24);
      return diff < 30;
    });
    if (updated.length !== announcements.length) setAnnouncements(updated);
  }, []);

  useEffect(() => {
    localStorage.setItem("managedAnnouncements", JSON.stringify(announcements));
  }, [announcements]);

  // ★★★ 変更点: 自動公開チェック用のuseEffectを追加 ★★★
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toISOString();
      let changed = false;
      
      setAnnouncements(prevAnnouncements => {
        const updated = prevAnnouncements.map(a => {
          if (a.status === 'draft' && a.publishAt && a.publishAt <= now) {
            changed = true;
            return { ...a, status: 'published', publishAt: null, updatedAt: now };
          }
          return a;
        });
        
        if (changed) {
          // showToastはsetAnnouncementsのコールバックの外で呼ぶべきだが、
          // この設計では難しいので、グローバルな状態（例: Redux）がない限り、
          // ここでトーストを出すのは避けるか、別の方法（例: mainコンポーネントでのstate監視）が必要。
          // ここでは状態更新のみに留め、ユーザーが次にタブを切り替えた時などに表示が変わるようにする。
          return updated;
        }
        return prevAnnouncements;
      });

    }, 10000); // 10秒ごとにチェック

    return () => clearInterval(interval);
  }, []); // 空の配列でマウント時に一度だけ実行


  const showToast = (message, type = "success") => setToast({ message, type, visible: true });

  const showConfirmation = (message, onConfirm, confirmText = '実行') => setConfirmation({ isOpen: true, message, onConfirm, confirmText });
  const hideConfirmation = () => setConfirmation({ isOpen: false, message: '', onConfirm: null, confirmText: '実行' });


  // --- 状態別データ ---
  // ... (変更なし) ...
  const published = announcements.filter(a => a.status === "published");
  const draft = announcements.filter(a => a.status === "draft"); // "draft" は "非公開" を意味する
  const archived = announcements.filter(a => a.status === "archived");

  /* --- 操作 --- */
  const handleOpenNew = () => { setEditingAnnouncement(null); setIsModalOpen(true); };
  const handleEdit = (a) => { setEditingAnnouncement(a); setIsModalOpen(true); };
  const handleClose = () => { setIsModalOpen(false); setEditingAnnouncement(null); };

  // ★★★ 変更点: handleSaveを予約投稿ロジックに対応 ★★★
  const handleSave = (data) => {
    // バリデーション
    if (!data.title || !data.title.trim()) {
      showToast("タイトルを入力してください", "error");
      return;
    }
    if (!data.content || !data.content.trim()) {
      showToast("内容を入力してください", "error");
      return;
    }

    const now = new Date().toISOString();
    let effectiveStatus = data.status;
    // datetime-local inputは空文字""を返すので、nullに変換
    let effectivePublishAt = data.publishAt ? new Date(data.publishAt).toISOString() : null;
    let toastMessage = "";
    let showConfirm = false;

    if (data.status === 'published') {
      if (effectivePublishAt && effectivePublishAt > now) {
        // 公開」を選んだが、日時が未来 -> 予約投稿
        effectiveStatus = 'draft'; // ステータスは「非公開」として保存
        toastMessage = "公開予約しました";
      } else {
        // 「公開」を選び、日時が今/過去/なし -> 即時公開
        effectiveStatus = 'published';
        effectivePublishAt = null; // 予約日時はクリア
        toastMessage = "公開しました";
        showConfirm = true; // 即時公開のみ確認
      }
    } else {
      // 「非公開」を選んだ
      effectiveStatus = 'draft';
      if (effectivePublishAt && effectivePublishAt > now) {
        // 非公開だが、予約日時は保持（あとで公開に切り替えるかもしれない）
        toastMessage = "公開予約を非公開として保存しました";
      } else {
        // ただの非公開保存
        effectivePublishAt = null; // 過去の予約日時はクリア
        toastMessage = "非公開として保存しました";
      }
    }

    const saveData = data.id
      ? { ...data, status: effectiveStatus, publishAt: effectivePublishAt, updatedAt: now }
      : { ...data, id: Date.now(), status: effectiveStatus, publishAt: effectivePublishAt, createdAt: now };

    // 実行ロジック
    const saveLogic = () => {
      setAnnouncements(prev =>
        prev.some(a => a.id === saveData.id)
          ? prev.map(a => (a.id === saveData.id ? saveData : a))
          : [saveData, ...prev]
      );
      showToast(toastMessage);
      handleClose();
      hideConfirmation();
    };

    // 即時公開の場合のみ確認
    if (showConfirm) {
      showConfirmation(
        `お知らせ「${saveData.title}」を今すぐ公開しますか？`,
        saveLogic,
        "公開する"
      );
    } else {
      // 予約投稿や非公開保存は確認なし
      saveLogic();
    }
  };

  const handleArchive = (id) => {
    // ... (変更なし) ...
    const ann = announcements.find(a => a.id === id);
    if (!ann) return;
    showConfirmation(
      `「${ann.title}」を\nアーカイブしますか？`,
      () => {
        setAnnouncements(prev =>
          prev.map(a => (a.id === id ? { ...a, status: "archived", archivedAt: new Date().toISOString() } : a))
        );
        showToast("お知らせをアーカイブしました");
        hideConfirmation();
      },
      "アーカイブ"
    );
  };

  const handleRestore = (id) => {
    // ... (変更なし) ...
    const ann = announcements.find(a => a.id === id);
    if (!ann) return;
    showConfirmation(
      `「${ann.title}」を\n非公開に復元しますか？`,
      () => {
        setAnnouncements(prev => prev.map(a => (a.id === id ? { ...a, status: "draft" } : a)));
        showToast("非公開に復元しました");
        hideConfirmation();
      },
      "復元する"
    );
  };

  const handleUnpublish = (id) => {
    // ... (変更なし) ...
    const ann = announcements.find(a => a.id === id);
    if (!ann) return;
    showConfirmation(
      `「${ann.title}」を\n非公開に戻しますか？`,
      () => {
        setAnnouncements(prev => prev.map(a => (a.id === id ? { ...a, status: "draft", updatedAt: new Date().toISOString() } : a)));
        showToast("非公開に戻しました");
        hideConfirmation();
      },
      "非公開にする"
    );
  };

  const handlePublish = (id) => {
    // ... (変更なし) ...
    const ann = announcements.find(a => a.id === id);
    if (!ann) return;
    showConfirmation(
      `「${ann.title}」を\n公開しますか？`,
      () => {
        setAnnouncements(prev => prev.map(a => (a.id === id ? { ...a, status: "published", updatedAt: new Date().toISOString() } : a)));
        showToast("公開しました");
        hideConfirmation();
      },
      "公開する"
    );
  };


  /* --- 表示 --- */
  const renderList = (list, archivedMode = false) =>
    list.length ? (
      list.map(a => (
        <div key={a.id} className={`event-card ${a.status === "draft" ? "event-card-draft" : ""}`}>
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-2">
              <p className="font-bold text-lg text-slate-800">{a.title}</p>
              {a.status === "published" && <span className="status-badge status-badge-published">公開中</span>}
              {a.status === "draft" && (
                // ★★★ 変更点: 予約日時の有無でバッジを変更 ★★★
                a.publishAt ? 
                <span className="status-badge status-badge-scheduled">公開予約中</span> :
                <span className="status-badge status-badge-draft">非公開</span>
              )}
            </div>
            <p className="text-sm text-slate-600 whitespace-pre-wrap mb-2">{a.content}</p>
            {/* ★★★ 変更点: 予約日時を表示 ★★★ */}
            {a.status === "draft" && a.publishAt && (
              <p className="text-sm text-blue-600 mb-2">
                公開予定: {new Date(a.publishAt).toLocaleString()}
              </p>
            )}
            <p className="text-xs text-slate-400">
              {a.createdAt && `作成: ${new Date(a.createdAt).toLocaleString()}`}
              {a.updatedAt && `　更新: ${new Date(a.updatedAt).toLocaleString()}`}
            </p>
          </div>
          <div className="flex flex-shrink-0 gap-2 self-end sm:self-center">
            {archivedMode ? (
              <button onClick={() => handleRestore(a.id)} className="btn btn-success"><IconRestore />復元</button>
            ) : (
              <>
                <button onClick={() => handleEdit(a)} className="btn btn-ghost"><IconEdit />編集</button>
                
                {a.status === 'published' && (
                  <button onClick={() => handleArchive(a.id)} className="btn btn-danger"><IconArchive />アーカイブ</button>
                )}
                
                {a.status === 'draft' && (
                  <>
                    <button onClick={() => handlePublish(a.id)} className="btn btn-success"><IconEye />今すぐ公開</button>
                    <button onClick={() => handleArchive(a.id)} className="btn btn-danger"><IconArchive />アーカイブ</button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      ))
    ) : (
      <div className="text-center p-10 border-2 border-dashed rounded-lg text-slate-500">
        <p className="font-bold">お知らせがありません</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      {toast.visible && <Toast {...toast} onDismiss={() => setToast({ ...toast, visible: false })} />}
      {confirmation.isOpen && <ConfirmationModal {...confirmation} onCancel={hideConfirmation} />}

      <div className="mx-auto max-w-7xl bg-white rounded-2xl p-6 shadow-lg sm:p-8">
        {/* ... (ヘッダー、タブ切り替えは変更なし) ... */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">お知らせ管理</h1>
            <p className="text-slate-500 mt-1">投稿・編集・アーカイブを行います。</p>
          </div>
          <button onClick={handleOpenNew} className="btn btn-primary w-full sm:w-auto"><IconPlus />新規作成</button>
        </div>

        <div className="my-6 flex justify-center">
          <div className="tab-group">
            {["published", "draft", "archived"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-item ${activeTab === tab ? "tab-item-active" : "tab-item-inactive"}`}
              >
                {tab === "published" ? "公開中" : tab === "draft" ? "非公開" : "アーカイブ"}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {activeTab === "published" && renderList(published)}
          {activeTab === "draft" && renderList(draft)}
          {activeTab === "archived" && renderList(archived, true)}
        </div>
      </div>

      {isModalOpen && (
        <AnnouncementFormModal
          announcement={editingAnnouncement}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

/* --- モーダル --- */
const AnnouncementFormModal = ({ announcement, onSave, onClose }) => {
  // ★★★ 変更点: publishAt を state に追加 ★★★
  const [formData, setFormData] = useState({ title: "", content: "", status: "draft", publishAt: "" });
  const [error, setError] = useState("");

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

  useEffect(() => {
    if (announcement) {
      setFormData({
        ...announcement,
        // ★★★ 変更点: publishAtをinputのvalue形式にフォーマット ★★★
        publishAt: formatDateTimeForInput(announcement.publishAt)
      });
    } else {
      setFormData({ title: "", content: "", status: "draft", publishAt: "" });
    }
    setError("");
  }, [announcement]);

  const handleChange = (e) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    if (e.target.name === 'title' && e.target.value.trim()) setError("");
    if (e.target.name === 'content' && e.target.value.trim()) setError("");
  };

  const handleStatusChange = (newStatus) => {
    setFormData(prev => ({ ...prev, status: newStatus }));
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) return setError("タイトルを入力してください");
    if (!formData.content.trim()) return setError("内容を入力してください");
    // onSaveに渡す際、publishAtは 'YYYY-MM-DDTHH:mm' のまま
    onSave({ ...formData });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6 text-slate-800">
          {announcement ? "お知らせ編集" : "新規お知らせ作成"}
        </h2>

        <form onSubmit={e => e.preventDefault()} className="space-y-4">
          <div>
            <label className="input-label">タイトル:</label>
            <input name="title" value={formData.title} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="input-label">内容:</label>
            <textarea name="content" value={formData.content} onChange={handleChange} className="input-field input-field-textarea" />
          </div>

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

export default AnnouncementPage;

