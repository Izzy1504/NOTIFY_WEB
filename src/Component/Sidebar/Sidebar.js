import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Sidebar/Sidebar.css';
import { SearchContext } from '../../context/SearchContext';
import logo from '../../assets/LOGO2.png'; // Update the logo image path

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

const Sidebar = () => {
  const isMobile = useIsMobile();
  const [isLikedSongsOpen, setIsLikedSongsOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [isArtistOpen, setIsArtistOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [likedSongs, setLikedSongs] = useState([]);
  const [libraryItems, setLibraryItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedLikedSongs = JSON.parse(localStorage.getItem('likedSongs')) || [];
    const savedLibraryItems = JSON.parse(localStorage.getItem('libraryItems')) || [];
    setLikedSongs(savedLikedSongs);
    setLibraryItems(savedLibraryItems);
  }, []);

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

  const handlePlaylistSelect = (playlist) => {
    setSelectedPlaylist(playlist);
    setIsPlaylistOpen(false);
  };

  const handleArtistSelect = (artist) => {
    setSelectedArtist(artist);
    setIsArtistOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchTerm}`);
  };

  const handleHomeClick = () => {
    navigate('/home');
  };

  const handleLogoClick = () => {
    navigate('/home');
  };

  const handleAddToLikedSongs = (song) => {
    const updatedLikedSongs = [...likedSongs, song];
    setLikedSongs(updatedLikedSongs);
    localStorage.setItem('likedSongs', JSON.stringify(updatedLikedSongs));
  };

  const handleAddToLibrary = (item) => {
    const updatedLibraryItems = [...libraryItems, item];
    setLibraryItems(updatedLibraryItems);
    localStorage.setItem('libraryItems', JSON.stringify(updatedLibraryItems));
  };

  const playlistData = {
    songs: [
      { id: 1, title: 'Đừng làm trái tim anh đau' },
      { id: 2, title: 'Sơn Tùng và các bài hát khác' },
      { id: 3, title: 'Vũ.' },
      { id: 4, title: 'RPT MCK' },
      { id: 5, title: 'RAP VIỆT' },
    ],
    artists: [
      { id: 1, name: 'Sơn Tùng' },
    ],
    likedSongs: [
      { id: 1, title: 'Em của ngày hôm qua' },
      { id: 2, title: 'Hãy trao cho anh' },
      { id: 3, title: 'Lạc trôi' },
    ],
  };

  return (
    <div className="sidebar-container">
      {isMobile && (
        <button onClick={toggleSidebar} className="toggle-sidebar-btn">
          {isSidebarOpen ? '✕' : '☰'}
        </button>
      )}
      <div className={`sidebar ${isMobile && !isSidebarOpen ? 'closed' : 'open'}`}>
        <div className="sidebar__header">
          <div onClick={handleHomeClick} className="home-button">
            <img src={logo} alt="Logo" className="logo hover-effect" onClick={handleLogoClick} /> {/* Add the logo image */}
            <h2 className="home-title">Trang chủ</h2>
          </div>
          
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Tìm kiếm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* <button type="submit">Search</button> */}
          </form>
        </div>
        <div className="sidebar__library">
          <h5 onClick={handleLibraryToggle} className="dropdown-toggle">
            Thư viện
          </h5>
          {isLibraryOpen && (
            <ul className="dropdown-content">
              <li onClick={handlePlaylistToggle} className="nested-dropdown-toggle">
                Playlist
                {isPlaylistOpen && (
                  <ul className="nested-dropdown-content">
                    {playlistData.songs.map(song => (
                      <li key={song.id} onClick={() => handlePlaylistSelect(song)}>
                        {song.title}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li onClick={handleArtistToggle} className="nested-dropdown-toggle">
                Nghệ sĩ
                {isArtistOpen && (
                  <ul className="nested-dropdown-content">
                    {playlistData.artists.map(artist => (
                      <li key={artist.id} onClick={() => handleArtistSelect(artist)}>
                        {artist.name}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </ul>
          )}
        </div>
        <div className="sidebar__playlists">
          <h5 onClick={handleLikedSongsToggle} className="dropdown-toggle">
            Bài hát đã thích
          </h5>
          {isLikedSongsOpen && (
            <ul className="dropdown-content">
              {likedSongs.map(song => (
                <li key={song.id}>{song.title}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;