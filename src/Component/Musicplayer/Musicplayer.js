import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faShuffle,
  faPlusCircle,
  faDownload,
  faEllipsisH,
  faCheckCircle,
  faClock,
  faPause,
  faForward,
  faBackward,
  faRepeat,
  faRetweet,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import { FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa"; // Import icons
import "../Musicplayer/Musicplayer.css";
import { useNavigate } from "react-router-dom";

const MusicPlayer = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedSong, setSelectedSong] = useState("Đừng Làm Trái Tim Anh Đau"); // Default song
  const [isPlaying, setIsPlaying] = useState(false); // Track playing state
  const [isRepeat, setIsRepeat] = useState(true); // làm cho repeat

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    setShowNotifications(false); // Close notifications pop-up if open
  };

  const navigate = useNavigate();
  const handleUser = () => {
    navigate("/userin");
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowUserMenu(false); // Close user menu if open
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying); // Toggle play/pause state
  };
  const toggleRotate = () => {
    setIsRepeat(!isRepeat);
  };
  const [isBold, setIsBold] = useState(false);

  // Function to toggle bold effect
  const toggleBold = () => {
    setIsBold(!isBold); // Toggle state between true and false
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
                <div className="user-menu-item" onClick={handleUser}>
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
        <img
          className="album-art"
          src="https://i.scdn.co/image/ab67616d00001e02a1bc26cdd8eecd89da3adc39"
          alt="Album Art"
        />
        <div className="album-details">
          <h1>Đừng Làm Trái Tim Anh Đau</h1>
          <p>Sơn Tùng M-TP • 2024 • 1 song, 4 min 39 sec</p>
        </div>
      </div>

      <div className="controls">
        <button className="control-button" onClick={togglePlayPause}>
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
        </button>
        <button className="control-button" onClick={toggleBold}>
          <FontAwesomeIcon
            icon={faShuffle}
            className={isBold ? "Bold-icon" : ""}
          />
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
            <th>
              <FontAwesomeIcon icon={faClock} />
            </th>
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
          <img
            src="https://i.scdn.co/image/ab67616d00001e02b5a7da0c97f51481d6f7a3c6"
            alt="Album Thumbnail"
          />
          <img
            src="https://i.scdn.co/image/ab67616d00001e022cd9649ea111a552283f0165"
            alt="Album Thumbnail"
          />
          <img
            src="https://i.scdn.co/image/ab67616d00001e020121ea113166222d5c743e2e"
            alt="Album Thumbnail"
          />
        </div>
      </div>

      {/* Bottom Playback Bar */}
      <div className="bottom-bar">
        <div className="bottom-bar-left">
          <img
            src="https://i.scdn.co/image/ab67616d00001e02a1bc26cdd8eecd89da3adc39"
            alt="Playing"
            className="bottom-album-art"
          />
          <div className="bottom-song-info">
            <h4>Đừng Làm Trái Tim Anh Đau</h4>
            <p>Sơn Tùng M-TP</p>
          </div>
        </div>
        <div className="bottom-controls">
          <button className="control-button" onClick={toggleBold}>
            <FontAwesomeIcon
              icon={faShuffle}
              className={isBold ? "bold-icon" : ""}
            />
          </button>
          <button className="control-button">
            <FontAwesomeIcon icon={faBackward} />
          </button>
          <button className="control-button" onClick={togglePlayPause}>
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
          </button>
          <button className="control-button">
            <FontAwesomeIcon icon={faForward} />
          </button>
          <button className="control-button" onClick={toggleRotate}>
            <FontAwesomeIcon icon={isRepeat ? faRepeat : faRetweet} />
          </button>
        </div>

        {/* Add Volume and Time Icons */}
        <div className="bottom-progress">
          <FontAwesomeIcon icon={faVolumeUp} className="volume-icon" />{" "}
          {/* Volume icon */}
          <FontAwesomeIcon icon={faClock} className="clock-icon" />
           {/* clock icon */}
          <span>0:46</span>
          <div className="progress-bar">
            <div className="progress-filled"></div>
          </div>
          <span>4:18</span>
          <FontAwesomeIcon icon={faClock} className="time-icon" />{" "}
          {/* Time icon */}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
