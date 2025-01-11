import React, { useState, useEffect } from 'react';
import { FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import '../Home/Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [jumpBackIn, setJumpBackIn] = useState([]);
  const [trendingSongs, setTrendingSongs] = useState([]); // Manage trending songs
  const [countryCode, setCountryCode] = useState('US'); // Manage country code
  
  const navigate = useNavigate();

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

  const handleSongClick = (song) => { // Handle song selection
    navigate(`/musicplayer/${song.id}`, { state: { song } });
    // saveToRecentlyPlayed(song);
  };
  
  // const saveToRecentlyPlayed = (song) => {
  //   setRecentlyPlayed((prev) => {
  //       const songInfo = {
  //         data: song.data,
  //           id: song.id,
  //           name: song.name, // Lấy tên bài hát
  //           imageUrl: song.imageUrl, // Lấy URL ảnh
        
  //       };

  //       const updatedList = [songInfo, ...prev.filter((item) => item.id !== songInfo.id)];
  //       localStorage.setItem('recentlyPlayed', JSON.stringify(updatedList));
  //       return updatedList;
  //       console.log(updatedList);
  //     });
  //   };

  const handleCountryChange = (code) => {
    setCountryCode(code);
  };

  // Fetch Trending Songs from YouTube
  const fetchTrendingSongs = async () => {
    const apiKey = 'AIzaSyCHM1nFjoDZgJACpSr9oxbqGtk40wumu6Y'; 
    try {
      
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&chart=mostPopular&maxResults=10&regionCode=${countryCode}&videoCategoryId=10&key=${apiKey}`
      );
      const data = await response.json();

      setTrendingSongs(
        data.items.map((item) => ({
          id: item.id,
          name: item.snippet.title,
          imageUrl: item.snippet.thumbnails.high.url,
        }))
      );
    } catch (error) {
      console.error('Error fetching trending songs:', error);
    }
  };

  useEffect(() => {
    fetchTrendingSongs(); 
  }, [countryCode]);

  useEffect(() => {
    const storedRecentlyPlayed = JSON.parse(localStorage.getItem('recentlyPlayed')) || [];
    setRecentlyPlayed(storedRecentlyPlayed);

    const savedTrack = localStorage.getItem("currentTrack");
    if (savedTrack) {
      const track = JSON.parse(savedTrack);
      const trackInfo = {
        id: track.id,
        name: track.snippet.title,
        imageUrl: track.snippet.thumbnails.high.url,
        snippet: track.snippet
      };
      setRecentlyPlayed((prev) => {
        const updatedList = [trackInfo, ...prev.filter((item) => item.id !== trackInfo.id)];
        localStorage.setItem('recentlyPlayed', JSON.stringify(updatedList));
        return updatedList;
      });
    }
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

      <div className="Home__playlists">
        <h3 className="Home__section-title">Top 10 Trending Songs</h3> {/* Updated section title */}
        <div className="country-buttons">
          <button onClick={() => handleCountryChange('US')}>US-UK</button>
          <button onClick={() => handleCountryChange('VN')}>Vietnam</button>
          <button onClick={() => handleCountryChange('KR')}>Korea</button>
          <button onClick={() => handleCountryChange('JP')}>Japan</button>
          {/* <button onClick={() => handleCountryChange('CN')}>China</button> */}
        </div>
        <div className="playlist-grid">
          {trendingSongs.length > 0 ? ( // Use trendingSongs for display
            trendingSongs.map((song) => (
              <div className="playlist" key={song.id} onClick={() => handleSongClick(song)}>
                <img src={song.imageUrl} alt={song.name} />
                <h4>{song.name}</h4>
              </div>
            ))
          ) : (
            <p>No trending songs to display</p>
          )}
        </div>
      </div>

      {/* Recently Played Section */}
<h3 className="Home__section-title">Recently Played</h3>
<div className="section-grid">
  {recentlyPlayed.length > 0 ? (
    recentlyPlayed.map((item) => (
      <div className="section-grid-item" key={item.id} onClick={() => handleSongClick(item)}>
        <img src={item.imageUrl} alt={item.name} />
        <h4>{item.name}</h4>
      </div>
    ))
  ) : (
    <p>Không có dữ liệu Recently Played để hiển thị</p>
  )}
</div>

    </div>
  );
};
export default Home;
