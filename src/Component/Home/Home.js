import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Home/Home.css';
import { FaBell } from 'react-icons/fa'; // Import icon notification

const Home = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLoginClick = () => {
    navigate('/login'); // Điều hướng đến trang đăng nhập
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
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
                <p>Thông báo 1</p>
                <p>Thông báo 2</p>
              </div>
            )}
          </div>
          <div className="user-circle">
            <span>ĐK</span> {/* Giả định là tên viết tắt của người dùng */}
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
