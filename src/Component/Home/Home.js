import React, { useState } from 'react';
import { FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa'; // Import icons
import '../Home/Home.css';
import '../Footer/Footer.js';
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    setShowNotifications(false); // Đóng pop-up thông báo nếu đang mở
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowUserMenu(false); // Đóng pop-up người dùng nếu đang mở
  };
  const navigate = useNavigate();
  const handleLogout = () => {
   
    // Ví dụ: xóa token, thông tin người dùng từ localStorage
    localStorage.removeItem('userToken');
  
    // Chuyển hướng về trang đăng nhập
    navigate('/login');
  };


  return (
    <div className="Home">
      <div className="Home__header">
        <h2>Bài hát đã thích</h2>
        <div className="header-right">
          <div className="notification-icon" onClick={toggleNotifications}>
            <FaBell size={25} />
            {showNotifications && (
              <div className="notification-popup">
                <h4>Thông báo</h4>
                <p>Bạn có 1 tin nhắn mới</p>
                <p>Thông báo về bài hát mới</p>
                <p>Cập nhật tính năng mới</p>
              </div>
            )}
          </div>
          <div className="user-circle" onClick={toggleUserMenu}>
            <FaUserCircle size={30} />
            {showUserMenu && (
              <div className="user-menu">
                <div className="user-menu-item">
                  <span>Tài khoản</span>
                </div>
                <div className="user-menu-item">
                  <span>Hồ sơ</span>
                </div>
                <div className="user-menu-item">
                  <span>Chế độ nghe riêng tư</span>
                </div>
                <div className="user-menu-item">
                  <span>Cài đặt</span>
                </div>
                <div className="user-menu-item" onClick={handleLogout}>
                  <FaSignOutAlt /> Đăng xuất
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="Home__playlists">
        <h3>Vì đây là web-made by myself nên là các album sẽ được link qua youtube</h3>
        <div className="playlist-grid">
          <div className="playlist">
            <img src="https://i.scdn.co/image/ab67616d00001e02c006b0181a3846c1c63e178f" alt="Album 1" />
            <h4>Album 1</h4>
          </div>
          <div className="playlist">
            <img src="https://i.scdn.co/image/ab67616d00001e022cd9649ea111a552283f0165" alt="Album 2" />
            <h4>Album 2</h4>
          </div>
          <div className="playlist">
            <img src="https://i.scdn.co/image/ab67616d0000b27371430c9ea4b34fb0b75ba14b" alt="Album 3" />
            <h4>Album 3</h4>
          </div>
          <div className="playlist">
            <img src="https://i.scdn.co/image/ab67616d00001e02e1e1f8385eccf8e572507b7a" alt="Album 4" />
            <h4>Album 4</h4>
          </div>
        </div>
      </div>
    
    </div>
  );
};

export default Home;
