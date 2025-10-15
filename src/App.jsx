import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/Login";
import Ranking from "./pages/Ranking";
import EventEdit from "./pages/EventEdit";
import UserEdit from "./pages/UserEdit";

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex flex-wrap justify-between items-center">
      <h1 className="text-xl font-bold mb-2 sm:mb-0">管理システム</h1>
      <div className="flex flex-wrap gap-2">
        <Link to="/ranking" className="px-3 py-1 bg-blue-500 hover:bg-blue-700 rounded">ランキング</Link>
        <Link to="/event" className="px-3 py-1 bg-blue-500 hover:bg-blue-700 rounded">イベント編集</Link>
        <Link to="/user" className="px-3 py-1 bg-blue-500 hover:bg-blue-700 rounded">ユーザー管理</Link>
        <Link to="/" className="px-3 py-1 bg-gray-500 hover:bg-gray-700 rounded">ログアウト</Link>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/*"
          element={
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <div className="p-6">
                <Routes>
                  <Route path="/ranking" element={<Ranking />} />
                  <Route path="/event" element={<EventEdit />} />
                  <Route path="/user" element={<UserEdit />} />
                  <Route path="*" element={<Navigate to="/ranking" replace />} />
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}
