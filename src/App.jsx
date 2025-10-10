import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Ranking from "./pages/Ranking";
import EventCreate from "./pages/EventCreate";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/event-create" element={<EventCreate />} />
      </Routes>
    </Router>
  );
}

export default App;
