import React, { useState, useEffect } from "react";

// お知らせ管理ページ（イベント管理ページを参考に作成）
const Announcements = () => {
  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem("managedAnnouncements");
    return saved ? JSON.parse(saved) : [
      { id: 1, title: "サーバーメンテナンスのお知らせ", content: "...", status: "published" },
      { id: 2, title: "新機能の追加について（下書き）", content: "...", status: "draft" },
    ];
  });

  useEffect(() => {
    localStorage.setItem("managedAnnouncements", JSON.stringify(announcements));
  }, [announcements]);

  return (
     <div className="p-4 sm:p-6">
      <div className="mx-auto max-w-7xl rounded-2xl bg-white p-6 shadow-lg sm:p-8">
        <div className="flex flex-col items-center justify-between gap-4 border-b pb-6 sm:flex-row">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">お知らせ管理</h1>
            <p className="text-slate-500 mt-1">ユーザーへの告知内容を管理します。</p>
          </div>
          <button className="btn btn-primary w-full sm:w-auto">新規作成</button>
        </div>
        <div className="mt-6 space-y-4">
          {announcements.map(item => (
            <div key={item.id} className="event-card">
              <div className="flex-grow">
                <p className="font-bold text-lg text-slate-800">{item.title}</p>
                <span className={`status-badge ${item.status === 'published' ? 'status-badge-published' : 'status-badge-draft'}`}>
                  {item.status === 'published' ? '公開中' : '下書き'}
                </span>
              </div>
              <div className="flex flex-shrink-0 gap-2">
                <button className="btn btn-ghost">編集</button>
                <button className="btn btn-danger">削除</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Announcements;