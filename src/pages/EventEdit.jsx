import React, { useEffect, useState } from "react";

const EventPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost/T01/public/api/rankings");
        const data = await res.json();
        console.log("APIから取得:", data);
        setEvents(data);
      } catch (err) {
        console.error("イベント取得エラー:", err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>イベント一覧</h2>
      {events.length === 0 ? (
        <p>イベントがありません</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <strong>開始:</strong> {event.start_date} <br />
              <strong>終了:</strong> {event.end_date} <br />
              <strong>キーワード:</strong> {event.keyword.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventPage;
