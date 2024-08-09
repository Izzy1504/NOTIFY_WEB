import React, { useState } from 'react';
import '../src/Sidebar.css';
const Sidebar = () => {
    const [isLikedSongsOpen, setIsLikedSongsOpen] = useState(false);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
    const [isArtistOpen, setIsArtistOpen] = useState(false);
  
    const handleLikedSongsToggle = () => {
      setIsLikedSongsOpen(!isLikedSongsOpen);
    };
  
    const handleLibraryToggle = () => {
      setIsLibraryOpen(!isLibraryOpen);
    };
  
    const handlePlaylistToggle = () => {
      setIsPlaylistOpen(!isPlaylistOpen);
    };
  
    const handleArtistToggle = () => {
      setIsArtistOpen(!isArtistOpen);
    };
  
    return (
      <div className="sidebar">
        <div className="sidebar__header">
          <h2>Trang chủ</h2>
          <input type="text" placeholder="Tìm kiếm" />
        </div>
        <div className="sidebar__library">
          <h3 onClick={handleLibraryToggle} className="dropdown-toggle">
            Thư viện
          </h3>
          {isLibraryOpen && (
            <ul className="dropdown-content">
              <li onClick={handlePlaylistToggle} className="nested-dropdown-toggle">
                Playlist
                {isPlaylistOpen && (
                  <ul className="nested-dropdown-content">
                    <li>Đừng làm trái tim anh đau</li>
                  </ul>
                )}
              </li>
              <li onClick={handleArtistToggle} className="nested-dropdown-toggle">
                Nghệ sĩ
                {isArtistOpen && (
                  <ul className="nested-dropdown-content">
                    <li>Sơn Tùng</li>
                  </ul>
                )}
              </li>
            </ul>
          )}
        </div>
        <div className="sidebar__playlists">
          <h3 onClick={handleLikedSongsToggle} className="dropdown-toggle">
            Bài hát đã thích
          </h3>
          {isLikedSongsOpen && (
            <ul className="dropdown-content">
              <li>Sơn Tùng M-TP</li>
              <li>Sơn Tùng và các bài hát khác</li>
              <li>Vũ.</li>
              <li>RPT MCK</li>
              <li>RAP VIỆT</li>
            </ul>
          )}
        </div>
      </div>
    );
  };
  
  export default Sidebar;