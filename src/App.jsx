import { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import EventEdit from './pages/EventEdit';
import UserEdit from './pages/UserEdit';
import BrandsAndCategories from './pages/BrandsAndCategories';
import Logout from './pages/Logout';
import api from './api/api';

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
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const isAuthenticated = !!token;

  const handleSetToken = (newToken) => {
    setToken(newToken);
    sessionStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setToken(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  };

  return (
    <BrowserRouter basename='/admin'>
      {isAuthenticated && <IdleTimer onIdle={handleLogout} />}
      <div className="bg-slate-50 min-h-screen">
        {isAuthenticated && <Navbar onLogout={handleLogout} />}
        <main className={isAuthenticated ? "pt-20" : ""}>
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/event-edit" replace />
                ) : (
                  <Login onLoginSuccess={handleSetToken} />
                )
              }
            />
            <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
            <Route
              path="/event-edit"
              element={<ProtectedRoute isLoggedIn={isAuthenticated}><EventEdit /></ProtectedRoute>}
            />
            <Route
              path="/user-edit"
              element={<ProtectedRoute isLoggedIn={isAuthenticated}><UserEdit /></ProtectedRoute>}
            />
            <Route
              path="/brands-categories"
              element={<ProtectedRoute isLoggedIn={isAuthenticated}><BrandsAndCategories /></ProtectedRoute>}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;