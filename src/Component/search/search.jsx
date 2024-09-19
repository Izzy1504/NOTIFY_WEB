import React, { useState, useEffect, useContext } from 'react';
import { FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import '../Home/Home.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { SearchContext } from '../../context/SearchContext';

const Search = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [jumpBackIn, setJumpBackIn] = useState([]);
  const { searchResults, searchSpotify } = useContext(SearchContext);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    setShowNotifications(false);
  };

  const handdleuser = () => {
    navigate('/userin');
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowUserMenu(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  const handleAlbumClick = (album) => {
    navigate(`/musicplayer/${album.id}`, { state: { album } });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams(location.search).get('query');
    if (query) {
      searchSpotify(query);
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search).get('query');
    if (query) {
      searchSpotify(query);
    }
  }, [location.search]);

  // Clear the search query on component mount
  useEffect(() => {
    const url = new URL(window.location);
    url.searchParams.delete('query');
    window.history.replaceState({}, '', url);
  }, []);

  return (
    <div className="Home">
      <div className="Home__header">
        <h2>NOTIFY</h2>
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

      <form onSubmit={handleSearch} className="search-form">
        <label className="search-label">
          Search for:
          <br />
          <span className="search-display">
            {new URLSearchParams(location.search).get('query') || 'No query provided'}
          </span>
        </label>
        {/* <button type="submit">Search</button> */}
      </form>

      {searchResults && searchResults.albums && (
        <div className="Home__search-results">
          <h3 className="Home__section-title">Search Results</h3>
          <div className="playlist-grid">
            {searchResults.albums.items.map((album) => (
              <div className="playlist" key={album.id} onClick={() => handleAlbumClick(album)}>
                <img src={album.images[0].url} alt={album.name} />
                <h4>{album.name}</h4>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* <div className="Home__playlists">
        <h3 className="Home__section-title">Albums mới phát hành</h3>
        <div className="playlist-grid">
          {albums.length > 0 ? (
            albums.map((album) => (
              <div className="playlist" key={album.id} onClick={() => handleAlbumClick(album)}>
                <img src={album.images[0].url} alt={album.name} />
                <h4>{album.name}</h4>
              </div>
            ))
          ) : (
            <p>Không có album nào để hiển thị</p>
          )}
        </div>
      </div> */}

      {/* Recently Played Section */}
      {/* <h3 className="Home__section-title">Recently Played</h3>
      <div className="section-grid">
        {recentlyPlayed.length > 0 ? (
          recentlyPlayed.map((item) => (
            <div className="section-grid-item" key={item.id}>
              <img src={item.imageUrl} alt={item.name} />
              <h4>{item.name}</h4>
            </div>
          ))
        ) : (
          <p>Không có dữ liệu Recently Played để hiển thị</p>
        )}
      </div> */}

      {/* Jump Back In Section */}
      {/* <h3 className="Home__section-title">Jump back in</h3>
      <div className="section-grid">
        {jumpBackIn.length > 0 ? (
          jumpBackIn.map((item) => (
            <div className="section-grid-item" key={item.id}>
              <img src={item.imageUrl} alt={item.name} />
              <h4>{item.name}</h4>
            </div>
          ))
        ) : (
          <p>Không có dữ liệu Jump Back In để hiển thị</p>
        )}
      </div> */}
    </div>
  );
};

export default Search;