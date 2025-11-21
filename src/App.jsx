import { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import EventEdit from './pages/EventEdit';
import UserEdit from './pages/UserEdit';
import Logout from './pages/Logout';

// 無操作時に自動ログアウトするタイマーコンポーネント
const IdleTimer = ({ onIdle }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const timeout = 30 * 60 * 1000; // 30分
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        onIdle();
        navigate("/");
      }, timeout);
    };

    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [onIdle, navigate]);

  return null;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    sessionStorage.setItem("sessionToken", "true"); // ✅ セッション作成
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("sessionToken"); // ✅ セッション削除
    localStorage.setItem("isLoggedIn", "false");
  };

  // ✅ 起動時にログイン状態をチェック
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const session = sessionStorage.getItem("sessionToken");

    if (!session || !loggedIn) {
      localStorage.setItem("isLoggedIn", "false");
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <BrowserRouter basename='/admin'>
      {isLoggedIn && <IdleTimer onIdle={handleLogout} />}
      <div className="bg-slate-50 min-h-screen">
        {/* ✅ ログイン中のみNavbar表示 */}
        {isLoggedIn && <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />}
        <main className={isLoggedIn ? "pt-20" : ""}>
          <Routes>
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
            <Route
              path="/event-edit"
              element={<ProtectedRoute isLoggedIn={isLoggedIn}><EventEdit /></ProtectedRoute>}
            />
            <Route
              path="/user-edit"
              element={<ProtectedRoute isLoggedIn={isLoggedIn}><UserEdit /></ProtectedRoute>}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;