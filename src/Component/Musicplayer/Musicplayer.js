
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faShuffle, faPlusCircle, faDownload, faEllipsisH, faCheckCircle, faClock } from '@fortawesome/free-solid-svg-icons';
import { FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa'; // Import icons
import '../Musicplayer/Musicplayer.css';
import { useNavigate } from 'react-router-dom';

const MusicPlayer = () => {
const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedSong, setSelectedSong] = useState("Đừng Làm Trái Tim Anh Đau"); // Default song

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    setShowNotifications(false); // Đóng pop-up thông báo nếu đang mở
  };
  const navigate = useNavigate();
  const handdleuser =()=>{
    navigate('/userin');
  };
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowUserMenu(false); // Đóng pop-up người dùng nếu đang mở
  };
  // const navigate = useNavigate();
  const handleLogout = () => {
   
    // Ví dụ: xóa token, thông tin người dùng từ localStorage
    localStorage.removeItem('userToken');
  
    // Chuyển hướng về trang đăng nhập
    navigate('/login');
  };
  return (
    <div className="Music">
      <div className="Home__header">
      <h2>Now Playing: {selectedSong}</h2>
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
                <div className="user-menu-item" onClick={handdleuser}>
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
        
      <div className="album-info">
        <img className="album-art" src="https://i.scdn.co/image/ab67616d00001e02a1bc26cdd8eecd89da3adc39" alt="Album Art" />
        <div className="album-details">
          <h1>Đừng Làm Trái Tim Anh Đau</h1>
          <p>Sơn Tùng M-TP • 2024 • 1 song, 4 min 39 sec</p>
        </div>
      </div>

      <div className="controls">
        <button className="control-button">
          <FontAwesomeIcon icon={faPlay} />
        </button>
        <button className="control-button">
          <FontAwesomeIcon icon={faShuffle} />
        </button>
        <button className="control-button">
          <FontAwesomeIcon icon={faPlusCircle} />
        </button>
        <button className="control-button">
          <FontAwesomeIcon icon={faDownload} />
        </button>
        <button className="control-button">
          <FontAwesomeIcon icon={faEllipsisH} />
        </button>
      </div>

      <table className="song-list">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Plays</th>
            <th><FontAwesomeIcon icon={faClock} /></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Đừng Làm Trái Tim Anh Đau</td>
            <td>23,113,266</td>
            <td>
              <FontAwesomeIcon icon={faCheckCircle} /> 4:39
            </td>
          </tr>
        </tbody>
      </table>

      <div className="more-music">
        <h2>More by Sơn Tùng M-TP</h2>
        <div className="album-thumbnails">
          <img src="https://i.scdn.co/image/ab67616d00001e02b5a7da0c97f51481d6f7a3c6" alt="Album Thumbnail" />
          <img src="https://i.scdn.co/image/ab67616d00001e022cd9649ea111a552283f0165" alt="Album Thumbnail" />
          <img src="https://i.scdn.co/image/ab67616d00001e020121ea113166222d5c743e2e" alt="Album Thumbnail" />
          {/* Add more thumbnails as needed */}
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
