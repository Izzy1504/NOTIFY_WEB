import React from "react";
import { useNavigate } from "react-router-dom";
import "../MainContent/MainContent.css";

const MainContent = () => {
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate("/login"); // Điều hướng đến trang đăng nhập
  };
  return (
    <div className="main-content">
      <div className="main-content__header">
        <h2>Bài hát đã thích</h2>
        <button onClick={handleLoginClick} className="login-type">
          Đăng nhập
        </button>
      </div>
      <div className="main-content__playlists">
        <h3>
          Vì đây là web-made by myself nên là các album sẽ được link qua youtube
        </h3>
        <div className="playlist-grid">
          <div className="playlist">
            <img
              src="https://i.scdn.co/image/ab67616d00001e02c006b0181a3846c1c63e178f"
              alt="Album 1"
            />
            <h4>Album 1</h4>
          </div>
          <div className="playlist">
            <img src="https://via.placeholder.com/150" alt="Album 2" />
            <h4>Album 2</h4>
          </div>
          <div className="playlist">
            <img src="https://via.placeholder.com/150" alt="Album 3" />
            <h4>Album 3</h4>
          </div>
          <div className="playlist">
            <img src="https://via.placeholder.com/150" alt="Album 4" />
            <h4>Album 4</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
