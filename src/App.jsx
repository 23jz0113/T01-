import { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import EventEdit from './pages/EventEdit';
import UserEdit from './pages/UserEdit';
import Announcements from './pages/Announcements';
// import Security from './pages/Security'; // ★★★ 不要なので削除 ★★★
import Logout from './pages/Logout';

const IdleTimer = ({ onIdle }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const timeout = 30 * 60 * 1000;
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
  useEffect(() => { localStorage.setItem('isLoggedIn', isLoggedIn); }, [isLoggedIn]);
  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <BrowserRouter>
      {isLoggedIn && <IdleTimer onIdle={handleLogout} />}
      <div className="bg-slate-50 min-h-screen">
        {isLoggedIn && <Navbar />}
        <main className={isLoggedIn ? "pt-20" : ""}>
          <Routes>
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
            
            <Route path="/event-edit" element={<ProtectedRoute isLoggedIn={isLoggedIn}><EventEdit /></ProtectedRoute>} />
            <Route path="/user-edit" element={<ProtectedRoute isLoggedIn={isLoggedIn}><UserEdit /></ProtectedRoute>} />
            <Route path="/announcements" element={<ProtectedRoute isLoggedIn={isLoggedIn}><Announcements /></ProtectedRoute>} />
            {/* ★★★ /security のルートを削除 ★★★ */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;