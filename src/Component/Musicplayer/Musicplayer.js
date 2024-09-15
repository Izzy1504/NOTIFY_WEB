import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faForward,
  faBackward,
  faVolumeUp,
  faRepeat,
  faShuffle,
} from "@fortawesome/free-solid-svg-icons";
import { FaBell, FaUserCircle } from "react-icons/fa";
import "../Musicplayer/Musicplayer.css";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const MusicPlayer = () => {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null); // Thông tin album
  const [isPlaying, setIsPlaying] = useState(false); // Trạng thái phát nhạc
  const [currentTrack, setCurrentTrack] = useState(null); // Bài hát hiện tại
  const [currentTime, setCurrentTime] = useState(0); // Thời gian hiện tại của bài hát
  const [duration, setDuration] = useState(0); // Tổng thời gian của bài hát
  const [volume, setVolume] = useState(50); // Volume
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [player, setPlayer] = useState(null); // Spotify Player instance
  const [deviceId, setDeviceId] = useState(null); // Device ID cho Spotify Player
  const [isRepeat, setIsRepeat] = useState(true); // làm cho repeat
  const [isBold, setIsBold] = useState(false); //
  const navigate = useNavigate();
  const [selectedTrack, setSelectedTrack] = useState(null); // State để lưu track được chọn

  const togglePlayPause = () => {
    if (player) {
      player.togglePlay().then(() => {
        setIsPlaying(!isPlaying);
      });
    }
  };

  const toggleVolumeSlider = () => {
    setShowVolumeSlider(!showVolumeSlider);
  };

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    setVolume(newVolume);
    if (player) {
      player.setVolume(newVolume / 100); // Chỉnh âm lượng
    }
  };

  const toggleRotate = () => {
    setIsRepeat(!isRepeat);
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
        body: 'grant_type=client_credentials',
      });
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error fetching access token:', error);
    }
  };

  // Khởi tạo Spotify Web Playback SDK và kết nối
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    script.onload = () => {
      window.onSpotifyWebPlaybackSDKReady = async () => {
        const token = await fetchAccessToken();

        const playerInstance = new window.Spotify.Player({
          name: 'Spotify Web Playback SDK',
          getOAuthToken: cb => { cb(token); },
          volume: 0.5
        });

        // Đăng ký sự kiện của player
        playerInstance.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          setDeviceId(device_id);
        });

        playerInstance.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
        });

        playerInstance.addListener('player_state_changed', (state) => {
          if (!state) return;
          setCurrentTrack(state.track_window.current_track);
          setIsPlaying(!state.paused);
          setDuration(state.duration);
          setCurrentTime(state.position);
        });

        // Kết nối với player
        playerInstance.connect();
        setPlayer(playerInstance);
      };
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const toggleBold = () => {
    const trackElement = document.querySelector('.track-list-item.active');
    if (trackElement) {
      trackElement.classList.toggle('bold');
    }
  };

  // Fetch album data from Spotify API
  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        const accessToken = await fetchAccessToken();
        if (!accessToken) return;

        const albumResponse = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const albumData = await albumResponse.json();
        setAlbum(albumData);
      } catch (error) {
        console.error('Error fetching album data:', error);
      }
    };

    if (albumId) {
      fetchAlbumData();
    }
  }, [albumId]);

  // Chọn bài hát để phát
  const selectTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    if (player) {
      player._options.getOAuthToken(async (token) => {
        await fetch(
          `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
          {
            method: 'PUT',
            body: JSON.stringify({
              uris: [track.uri], // Phát bài hát đã chọn
            }),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
      });
    }
    setSelectedTrack(track);
  };

  // Xử lý khi thanh seek bar thay đổi
  const handleSeekChange = (event) => {
    const seekTime = event.target.value;
    setCurrentTime(seekTime);
    if (player) {
      player.seek(seekTime * 1000); // Chuyển thời gian phát nhạc
    }
  };

  return (
    <div className="Music">
      <div className="Home__header">
        <h2>Now Playing: {album ? album.name : "Loading..."}</h2>
        <div className="header-right">
          <div className="notification-icon">
            <FaBell size={25} />
          </div>
          <div className="user-circle">
            <FaUserCircle size={30} />
          </div>
        </div>
      </div>

      {album ? (
        <div className="album-info">
          <img
            className="album-art"
            src={album.images[0].url}
            alt={album.name}
          />
          <div className="album-details">
            <h1>{album.name}</h1>
            <p>{album.artists[0].name} • {album.release_date} • {album.total_tracks} songs</p>
          </div>

          {/* Hiển thị danh sách bài hát */}
          <div className="track-list">
            {album.tracks.items.map((track, index) => (
              <div key={index} className="track-item" onClick={() => selectTrack(track)}>
                <span>{track.track_number}. {track.name}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Loading album data...</p>
      )}

{album && (
  <div className="bottom-bar">
    <div className="bottom-bar-left">
      <img
        className="bottom-album-art"
        src={album.images[0].url}
        alt={album.name}
      />
      <div className="bottom-song-info">
        <h4>Now Playing: {selectedTrack ? selectedTrack.name : "Loading..."}</h4>
        <p>{album.artists[0].name}</p>
      </div>
    </div>
    <div className="bottom-controls">
      <button className="control-button" onClick={toggleBold}>
        <FontAwesomeIcon icon={faShuffle} className={isBold ? "bold-icon" : ""} />
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
        <i className={isRepeat ? "bi bi-repeat-1" : "bi bi-repeat"}></i>
      </button>
    </div>
    {currentTrack && (
      <div className="seek-bar-container">
        <div className="time-info">
          <FontAwesomeIcon icon={faVolumeUp} className="volume-icon" />
          <span>{Math.floor(currentTime / 60)}:{("0" + Math.floor(currentTime % 60)).slice(-2)}</span>
          <input
            type="range"
            min="0"
            max={duration / 1000} // Chuyển từ ms sang giây
            value={currentTime}
            onChange={handleSeekChange}
            className="seek-bar"
          />
          <span>{Math.floor(duration / 60000)}:{("0" + Math.floor((duration % 60000) / 1000)).slice(-2)}</span>
        </div>
        {showVolumeSlider && (
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        )}
      </div>
    )}
  </div>
)}
    </div>
  );
};

export default MusicPlayer;