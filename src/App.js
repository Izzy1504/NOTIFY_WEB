import React from 'react';
import './App.css';
import Sidebar from './Component/Sidebar/Sidebar';
import MainContent from './Component/MainContent/MainContent';
import LoginForm from './Component/Login/Login.js';
import Home from './Component/Home/Home.js';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

function App() {
  // Lấy đường dẫn hiện tại
  const location = useLocation();

  return (
    <div className="app">
      {/* Kiểm tra nếu không phải là trang đăng nhập thì hiển thị Sidebar */}
      {location.pathname !== '/login' && <Sidebar />}
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
