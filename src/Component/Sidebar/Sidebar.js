import React, { useState, useEffect } from 'react';
import '../Sidebar/Sidebar.css';

const Sidebar = () => {
  const [isLikedSongsOpen, setIsLikedSongsOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [isArtistOpen, setIsArtistOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [playlistData, setPlaylistData] = useState({
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
  });

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

  useEffect(() => {
    if (selectedArtist) {
      fetch(`https://api.example.com/artist/${selectedArtist.id}`)
        .then(response => response.json())
        .then(data => {
          console.log('Artist info:', data);
        })
        .catch(error => {
          console.error('Error fetching artist info:', error);
        });
    }
  }, [selectedArtist]);

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <h2>Trang chủ</h2>
        <input
          type="text"
          placeholder="Tìm kiếm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
        <h3 onClick={handleLikedSongsToggle} className="dropdown-toggle">
          Bài hát đã thích
        </h3>
        {isLikedSongsOpen && (
          <ul className="dropdown-content">
            {playlistData.likedSongs.map(song => (
              <li key={song.id}>{song.title}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
