import React, { useState, useEffect } from 'react';
import { FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import '../Home/Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [jumpBackIn, setJumpBackIn] = useState([]);
  
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

  const handleAlbumClick = (album) => {
    navigate(`/musicplayer/${album.id}`, { state: { album } });
  };
  

  // Fetch Spotify access token
  const fetchAccessToken = async () => {
    const clientId = 'd0a4d0901ef24d31b048d5f2ce9e9fee';
    const clientSecret = 'c5ee7fd1352b424b912e66292e334273';
    const authString = `${clientId}:${clientSecret}`;
    const encodedAuthString = btoa(authString);
  
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${encodedAuthString}`,
        },
        body: 'grant_type=client_credentials&scope=user-read-recently-played user-top-read',
      });
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error fetching access token:', error);
    }
  };
  


 // Fetch albums, recently played, and jump back in
 useEffect(() => {
  const fetchSpotifyData = async () => {
    try {
      const accessToken = await fetchAccessToken();
      if (!accessToken) return;

      const albumsResponse = await fetch('https://api.spotify.com/v1/browse/new-releases', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const albumsData = await albumsResponse.json();
      setAlbums(albumsData.albums.items || []);

      // Fetch Recently Played
      const recentlyPlayedResponse = await fetch('https://api.spotify.com/v1/me/player/recently-played', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const recentlyPlayedData = await recentlyPlayedResponse.json();
      if (recentlyPlayedData && recentlyPlayedData.items) {
        setRecentlyPlayed(
          recentlyPlayedData.items.map((item) => ({
            id: item.track.id,
            name: item.track.name,
            imageUrl: item.track.album.images[0].url, // Lấy hình ảnh từ album của bài hát
          }))
        );
      }

      // Fetch Jump Back In section
      const jumpBackInResponse = await fetch('https://api.spotify.com/v1/me/top/tracks', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const jumpBackInData = await jumpBackInResponse.json();
      if (jumpBackInData && jumpBackInData.items) {
        setJumpBackIn(
          jumpBackInData.items.map((track) => ({
            id: track.id,
            name: track.name,
            imageUrl: track.album.images[0].url, // Lấy hình ảnh từ album của bài hát
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching Spotify data:', error);
    }
  };

  fetchSpotifyData();
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
      </div>

      {/* Recently Played Section */}
<h3 className="Home__section-title">Recently Played</h3>
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
</div>

{/* Jump Back In Section */}
<h3 className="Home__section-title">Jump back in</h3>
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
</div>

    </div>
  );
};
export default Home;
// import React, { useState, useEffect } from 'react';
// import { FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
// import '../Home/Home.css';
// import { useNavigate } from 'react-router-dom';

// const Home = () => {
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [albums, setAlbums] = useState([]);
//   const [recentlyPlayed, setRecentlyPlayed] = useState([]);
//   const [jumpBackIn, setJumpBackIn] = useState([]);

//   const navigate = useNavigate();

//   const toggleUserMenu = () => {
//     setShowUserMenu(!showUserMenu);
//     setShowNotifications(false);
//   };

//   const handleUser = () => {
//     navigate('/userin');
//   };

//   const toggleNotifications = () => {
//     setShowNotifications(!showNotifications);
//     setShowUserMenu(false);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('userToken');
//     navigate('/login');
//   };

//   const handleAlbumClick = (album) => {
//     navigate(`/musicplayer/${album.id}`, { state: { album } });
//   };

//   // Fetch YouTube Data API v3
//   const fetchYouTubeMusicData = async () => {
//     const apiKey = 'AIzaSyDEnA4Y-BYwMS71-UKpxesqdxzD6iJr9Mk'; // Your YouTube Data API Key
//     const channelId = 'UCy8o19g9Y1KPTND6UwkBRAw'; // Corrected Channel ID

//     try {
//       // Fetch latest videos (Albums mới phát hành)
//       const response = await fetch(
//         `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=10&type=video&key=${apiKey}`
//       );
//       const data = await response.json();

//       setAlbums(
//         data.items.map((item) => ({
//           id: item.id.videoId,
//           name: item.snippet.title,
//           imageUrl: item.snippet.thumbnails.high.url, // Lấy hình ảnh của video
//         }))
//       );

//       // Fetch Recently Played (playlist videos)
//       const recentlyPlayedResponse = await fetch(
//         `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLFgquLnL59alGJcdc0BEZJb2p7IgkLHkI&maxResults=10&key=${apiKey}`
//       );
//       const recentlyPlayedData = await recentlyPlayedResponse.json();
//       setRecentlyPlayed(
//         recentlyPlayedData.items.map((item) => ({
//           id: item.snippet.resourceId.videoId,
//           name: item.snippet.title,
//           imageUrl: item.snippet.thumbnails.high.url,
//         }))
//       );

//       // Fetch Jump Back In section (playlist videos)
//       const jumpBackInResponse = await fetch(
//         `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLFs4vir_WsTwEd-nJgVJCZPNL3HALHHpF&maxResults=10&key=${apiKey}`
//       );
//       const jumpBackInData = await jumpBackInResponse.json();
//       setJumpBackIn(
//         jumpBackInData.items.map((item) => ({
//           id: item.snippet.resourceId.videoId,
//           name: item.snippet.title,
//           imageUrl: item.snippet.thumbnails.high.url,
//         }))
//       );
//     } catch (error) {
//       console.error('Error fetching YouTube Music data:', error);
//     }
//   };

//   useEffect(() => {
//     fetchYouTubeMusicData();
//   }, []);

//   return (
//     <div className="Home">
//       <div className="Home__header">
//         <h2>NOTIFY</h2>
//         <div className="header-right">
//           <div className="notification-icon" onClick={toggleNotifications}>
//             <FaBell size={25} />
//             {showNotifications && (
//               <div className="notification-popup">
//                 <h4>Thông báo</h4>
//                 <p>Bạn có 1 tin nhắn mới</p>
//                 <p>Thông báo về bài hát mới</p>
//                 <p>Cập nhật tính năng mới</p>
//               </div>
//             )}
//           </div>
//           <div className="user-circle" onClick={toggleUserMenu}>
//             <FaUserCircle size={30} />
//             {showUserMenu && (
//               <div className="user-menu">
//                 <div className="user-menu-item" onClick={handleUser}>
//                   <span>Tài khoản</span>
//                 </div>
//                 <div className="user-menu-item">
//                   <span>Hồ sơ</span>
//                 </div>
//                 <div className="user-menu-item">
//                   <span>Chế độ nghe riêng tư</span>
//                 </div>
//                 <div className="user-menu-item">
//                   <span>Cài đặt</span>
//                 </div>
//                 <div className="user-menu-item" onClick={handleLogout}>
//                   <FaSignOutAlt /> Đăng xuất
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="Home__playlists">
//         <h3 className="Home__section-title">Albums mới phát hành</h3>
//         <div className="playlist-grid">
//           {albums.length > 0 ? (
//             albums.map((album) => (
//               <div className="playlist" key={album.id} onClick={() => handleAlbumClick(album)}>
//                 <img src={album.imageUrl} alt={album.name} />
//                 <h4>{album.name}</h4>
//               </div>
//             ))
//           ) : (
//             <p>Không có album nào để hiển thị</p>
//           )}
//         </div>
//       </div>

//       {/* Recently Played Section */}
//       <h3 className="Home__section-title">Recently Played</h3>
//       <div className="section-grid">
//         {recentlyPlayed.length > 0 ? (
//           recentlyPlayed.map((item) => (
//             <div className="section-grid-item" key={item.id}>
//               <img src={item.imageUrl} alt={item.name} />
//               <h4>{item.name}</h4>
//             </div>
//           ))
//         ) : (
//           <p>Không có dữ liệu Recently Played để hiển thị</p>
//         )}
//       </div>

//       {/* Jump Back In Section */}
//       <h3 className="Home__section-title">Jump back in</h3>
//       <div className="section-grid">
//         {jumpBackIn.length > 0 ? (
//           jumpBackIn.map((item) => (
//             <div className="section-grid-item" key={item.id}>
//               <img src={item.imageUrl} alt={item.name} />
//               <h4>{item.name}</h4>
//             </div>
//           ))
//         ) : (
//           <p>Không có dữ liệu Jump Back In để hiển thị</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;
