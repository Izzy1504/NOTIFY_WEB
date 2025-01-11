import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
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
import { FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import "../Musicplayer/Musicplayer.css";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const MusicPlayer = () => {
  const { albumId } = useParams();
  const { state } = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isRepeat, setIsRepeat] = useState(true);
  const [isBold, setIsBold] = useState(false);
  const navigate = useNavigate();
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const audioRef = useRef(null);
  const [tracks, setTracks] = useState([]);
  const apiKey = 'AIzaSyCHM1nFjoDZgJACpSr9oxbqGtk40wumu6Y'; // Replace with your API key

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    setShowNotifications(false);
  };

  const handdleuser = () => {
    navigate("/userin");
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowUserMenu(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleVolumeSlider = () => {
    setShowVolumeSlider(!showVolumeSlider);
  };

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const toggleRotate = () => {
    setIsRepeat(!isRepeat);
  };

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        let videoData;
        console.log("Fetching video details for albumId:", albumId); 
        
        if (state && state.video) {
          console.log("Loading video from search:", state.video);
          videoData = {
            id: state.video.id.videoId,
            snippet: state.video.snippet,
          };
        } else if (albumId) {
           console.log("Loading video from albumId:", albumId);
          const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${albumId}&key=${apiKey}`
          );
           const data = await response.json();
            if (data.items && data.items.length > 0) {
              videoData = {
              id: albumId,
              snippet: data.items[0].snippet
              };
            }
        }
          
         if(videoData) {
          setSelectedTrack(videoData);
          setVideoId(videoData.id);
         
        const relatedResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${videoData.id}&type=video&key=${apiKey}&maxResults=10`
        );
           const relatedData = await relatedResponse.json();
        if (relatedData.items) {
          setTracks([videoData, ...relatedData.items]);
            }
             await selectTrack(videoData);
        setIsPlaying(false);
          }
      } catch (error) {
        console.error("Error fetching video details:", error);
      }
    };

    if (albumId || (state && state.video)) {
      fetchVideoDetails();
    }
  }, [albumId, state, apiKey]);

  useEffect(() => {
    const savedTrack = localStorage.getItem("currentTrack");
    if (savedTrack) {
      const track = JSON.parse(savedTrack);
      setSelectedTrack(track);
      setVideoId(track.id);
      selectTrack(track);
    }
  }, []);

  const toggleBold = () => {
    const trackElement = document.querySelector(".track-list-item.active");
    if (trackElement) {
      trackElement.classList.toggle("bold");
    }
  };

  const selectTrack = async (track) => {
    let retryCount = 0;
    const maxRetries = 3;

    const tryLoadAudio = async () => {
        try {
            const videoData = {
                id: track.id.videoId || track.id,
                snippet: track.snippet
            };

            setSelectedTrack(videoData);
            setVideoId(videoData.id);

            if (audioRef.current) {
                // Ensure the audio is stopped before changing source
                audioRef.current.pause();
                audioRef.current.currentTime = 0;

                // Use more specific audio format and add timestamp to prevent caching
                const timestamp = new Date().getTime();
                const audioUrl = `http://localhost:5000/youtube-audio?videoId=${videoData.id}&t=${timestamp}`;

                console.log('Loading audio from:', audioUrl);

                audioRef.current.src = audioUrl;
                audioRef.current.crossOrigin = "anonymous";

                // Set audio type explicitly
                audioRef.current.type = 'audio/mpeg';

                // Create a timeout promise
                const loadPromise = new Promise((resolve, reject) => {
                    const timeoutId = setTimeout(() => {
                        reject(new Error('Audio load timeout'));
                    }, 15000); // 15 seconds timeout

                    audioRef.current.oncanplaythrough = () => {
                        clearTimeout(timeoutId);
                        resolve();
                    };

                    audioRef.current.onerror = (e) => {
                        clearTimeout(timeoutId);
                        const error = e.target.error;
                        console.error('Audio loading error:', {
                            code: error?.code,
                            message: error?.message,
                            details: error
                        });
                        reject(new Error(`Audio load failed: ${error?.message || 'Unknown error'}`));
                    };
                });

                await loadPromise;

                // If we get here, audio loaded successfully
                setIsPlaying(true);
                await audioRef.current.play().catch(error => {
                    console.error('Play failed:', error);
                    throw error;
                });

                // Save duration to localStorage
                localStorage.setItem("trackDuration", audioRef.current.duration);
            }
        } catch (error) {
            console.error(`Audio load attempt ${retryCount + 1} failed:`, error);
            if (retryCount < maxRetries) {
                retryCount++;
                console.log(`Retrying... Attempt ${retryCount} of ${maxRetries}`);
                await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
                return tryLoadAudio();
            }
            throw error;
        }
    };

    try {
        await tryLoadAudio();
        localStorage.setItem("currentTrack", JSON.stringify(track));
        console.log('Track saved to localStorage:', track); // Log the saved track
        // Notify NowPlayingBar about the selected track
        const event = new CustomEvent('trackSelected', { detail: track });
        window.dispatchEvent(event);
    } catch (error) {
        console.error('Final error selecting track:', error);
        // Show user-friendly error message
        alert('Unable to load this track. Please try another one or check your connection.');
        setIsPlaying(false);
    }
};

    const handleNext = () => {
       if (tracks.length === 0) {
         return;
       }
       const currentIndex = tracks.findIndex(track => track.id === (selectedTrack.id.videoId || selectedTrack.id));
      
       const nextIndex = (currentIndex + 1) % tracks.length;
        console.log('next track', nextIndex, tracks)
       selectTrack(tracks[nextIndex]);
       localStorage.setItem("currentTrack", JSON.stringify(tracks[nextIndex]));
    };

    const handlePrevious = () => {
      if (tracks.length === 0) {
        return;
      }
      const currentIndex = tracks.findIndex(track => track.id === (selectedTrack.id.videoId || selectedTrack.id));
      const previousIndex = (currentIndex - 1 + tracks.length) % tracks.length;
      selectTrack(tracks[previousIndex]);
      localStorage.setItem("currentTrack", JSON.stringify(tracks[previousIndex]));
    };

    const handleShuffle = () => {
      const shuffledTracks = [...tracks];
       for (let i = shuffledTracks.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledTracks[i], shuffledTracks[j]] = [shuffledTracks[j], shuffledTracks[i]];
        }
        setTracks(shuffledTracks);
        setIsBold(!isBold);
    };

  useEffect(() => {
    const location = window.location;
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("query");
    if (query) {
      fetchYouTubeResults(query);
    }
  }, [apiKey]);

  const fetchYouTubeResults = async (query) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${apiKey}&maxResults=10`
      );
      const data = await response.json();
        setTracks(data.items.map(item => ({
        ...item,
        id: item.id.videoId
      })));
    } catch (error) {
      console.error("Error fetching YouTube results:", error);
    }
  };

   useEffect(() => {
      const audio = audioRef.current;
    
    if (audio) {
      const timeUpdateHandler = () => setCurrentTime(audio.currentTime);
      const metadataHandler = () => {
        setDuration(audio.duration);
        console.log('Audio metadata loaded successfully');
      };
      const endedHandler = () => setIsPlaying(false);
      const canPlayHandler = () => console.log('Audio can play event');
      const errorHandler = (e) => console.error('audio tag error from event:', e.target.error);

      audio.addEventListener('timeupdate', timeUpdateHandler);
      audio.addEventListener('loadedmetadata', metadataHandler);
      audio.addEventListener('ended', endedHandler);
      audio.addEventListener('canplay', canPlayHandler);
      audio.addEventListener('error', errorHandler);

      // Cleanup function
      return () => {
        audio.removeEventListener('timeupdate', timeUpdateHandler);
        audio.removeEventListener('loadedmetadata', metadataHandler);
        audio.removeEventListener('ended', endedHandler);
        audio.removeEventListener('canplay', canPlayHandler);
        audio.removeEventListener('error', errorHandler);
      };
    }
     }, []);

  const handleSeekChange = (event) => {
    const seekTime = event.target.value;
    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  const menuItems = [
    { id: 1, text: "Tài khoản", onClick: handdleuser },
    { id: 2, text: "Hồ sơ" },
    { id: 3, text: "Chế độ nghe riêng tư" },
    { id: 4, text: "Cài đặt" },
    { id: 5, text: "Đăng xuất", onClick: handleLogout, isLogout: true },
  ];

  const notifications = [
    { id: 1, text: "Bạn có 1 tin nhắn mới" },
    { id: 2, text: "Thông báo về bài hát mới" },
    { id: 3, text: "Cập nhật tính năng mới" },
  ];

  return (
    <div className="Music">
      <div className="Home__header">
        <div className="header-content">
          <h2>
            {selectedTrack
              ? `Now Playing: ${selectedTrack.snippet.title}`
              : "Select a track"}
          </h2>
          <h3>{selectedTrack ? `Artist: ${selectedTrack.snippet.channelTitle}` : ""}</h3>
        </div>

        <div className="header-right">
          <div className="notification-icon" onClick={toggleNotifications}>
            <FaBell size={25} />
            {showNotifications && (
              <div className="notification-popup">
                <h4>Thông báo</h4>
                <div className="notifications-list">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="notification-item">
                      {notification.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="user-circle" onClick={toggleUserMenu}>
            <FaUserCircle size={30} />
            {showUserMenu && (
              <div className="user-menu">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className={`user-menu-item ${
                      item.isLogout ? "logout-item" : ""
                    }`}
                    onClick={item.onClick}
                  >
                    {item.isLogout && <FaSignOutAlt />}
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="player-content">
        {selectedTrack ? (
          <div className="song-info">
            <div className="song-art-container">
              <img
                className="song-art"
                src={selectedTrack.snippet.thumbnails.high.url}
                alt={selectedTrack.snippet.title}
                onError={(e) => {
                  e.target.src = "path/to/fallback/image.jpg";
                }}
              />
            </div>

            <div className="track-list">
              <h3>Playlist</h3>
              <div className="tracks-container">
                {tracks.map((track) => (
                  <div
                    key={track.id}
                    className={`track-item ${
                      selectedTrack.id === (track.id.videoId || track.id) ? "active" : ""
                    }`}
                    onClick={() => selectTrack(track)}
                  >
                    <img
                      src={track.snippet.thumbnails.default.url}
                      alt={track.snippet.title}
                      className="track-thumbnail"
                    />
                    <div className="track-info">
                      <span className="track-title">{track.snippet.title}</span>
                      <span className="track-artist">
                        {track.snippet.channelTitle}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="loading-state">
            <p>Loading music player...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;