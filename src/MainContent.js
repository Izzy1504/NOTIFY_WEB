import React from 'react';
import './MainContent.css';
const MainContent = () => {
  return (  
    <div className="main-content">
      <div className="main-content__header">
        <h2>Bài hát đã thích</h2>
        <h2 className="login-type"> Đăng nhập </h2>
      </div>
      <div className="main-content__playlists">
        <h3>Vì đây là web-made by myself nên là các album sẽ được link qua youtube</h3>
        <div className="playlist-grid">
          <div className="playlist">
            <img src="https://i.scdn.co/image/ab67616d00001e02c006b0181a3846c1c63e178f" alt="Album 1" />
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
