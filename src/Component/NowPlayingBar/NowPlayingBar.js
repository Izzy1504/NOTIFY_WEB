import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faForward, faBackward, faVolumeUp, faSpinner } from '@fortawesome/free-solid-svg-icons';
import './NowPlayingBar.css';

const audioCache = new Map();

const NowPlayingBar = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const savedTrack = localStorage.getItem('currentTrack');
    const savedDuration = localStorage.getItem('trackDuration');
    console.log('Saved track from localStorage:', savedTrack); // đẩy ra các saved track
    if (savedTrack) {
      const track = JSON.parse(savedTrack);
      setCurrentTrack(track);
      if (savedDuration) {
        setDuration(parseFloat(savedDuration));
      }
      if (audioRef.current) {
        audioRef.current.src = `http://localhost:5000/youtube-audio?videoId=${track.id}`;
        audioRef.current.play();
        setIsPlaying(true);
        console.log('NowPlayingBar is displaying the track:', track); // track đang phát
      }
    }
  }, []);

  useEffect(() => {
    const handleTrackSelected = async (event) => {
      const track = event.detail;
      setCurrentTrack(track);
      setIsLoading(true);
      setIsPlaying(false);

      if (audioRef.current) {
        audioRef.current.pause(); // Pause the current track immediately
        audioRef.current.src = ''; // Clear the current source

        try {
          // Check if the track is already in the cache
          if (audioCache.has(track.id)) {
            const cachedAudio = audioCache.get(track.id);
            audioRef.current.src = cachedAudio.src;
            setDuration(cachedAudio.duration);
            setIsLoading(false);
            audioRef.current.play().catch(error => {
              if (error.name !== 'AbortError') {
                console.error('Error playing audio:', error);
              }
            });
            setIsPlaying(true);
          } else {
            // Fetch track duration from the new route
            const durationResponse = await fetch(
              `http://localhost:5000/track-duration?videoId=${track.id}`
            );
            if (durationResponse.ok) {
              const durationData = await durationResponse.json();
              if (durationData.duration) {
                setDuration(parseFloat(durationData.duration));
              }
            } else {
              console.error('Error fetching track duration:', durationResponse.statusText);
            }

            // Fetch audio from YouTube
            const response = await fetch(
              `http://localhost:5000/youtube-audio?videoId=${track.id}`, 
              { method: 'HEAD' }
            );
            
            const duration = response.headers.get('X-Audio-Duration');
            if (duration) {
              setDuration(parseFloat(duration));
            }

            // Set audio source and cache it
            const audioSrc = `http://localhost:5000/youtube-audio?videoId=${track.id}`;
            audioRef.current.src = audioSrc;
            audioCache.set(track.id, { src: audioSrc, duration: parseFloat(duration) });

            audioRef.current.addEventListener('canplay', () => {
              setIsLoading(false);
              audioRef.current.play().catch(error => {
                if (error.name !== 'AbortError') {
                  console.error('Error playing audio:', error);
                }
              });
              setIsPlaying(true);
            }, { once: true });
          }
        } catch (error) {
          console.error('Error loading audio:', error);
          setIsLoading(false);
        }
      }
    };

    window.addEventListener('trackSelected', handleTrackSelected);
    return () => window.removeEventListener('trackSelected', handleTrackSelected);
  }, [isPlaying, currentTrack]);
  

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const updateProgress = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
      }
    };

    const setAudioDuration = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('loadedmetadata', setAudioDuration);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current.removeEventListener('loadedmetadata', setAudioDuration);
      }
    };
  }, []);

  const togglePlayPause = () => {
    if (!isLoading && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
// bài tiếp theo thì chưa có flow nên chưa làm
  const handleNext = () => {
    // Implement logic to play the next track
  };

  const handlePrevious = () => {
    // Implement logic to play the previous track
  };
// tăng âm lượng 
  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
  };
// thay đổi thời gian phát
  const handleProgressChange = (event) => {
    if (audioRef.current) {
      audioRef.current.currentTime = (event.target.value / 100) * audioRef.current.duration;
      setProgress(event.target.value);
    }
  };
// định dạng thời gian
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    currentTrack && (
      <div className="now-playing-bar">
        <div className="track-info">
          <img src={currentTrack.snippet.thumbnails.default.url} alt={currentTrack.snippet.title} />
          <div>
            <span className="track-title">{currentTrack.snippet.title}</span>
            <span className="track-artist">{currentTrack.snippet.channelTitle}</span>
          </div>
        </div>
        <div className="controls">
          <button onClick={handlePrevious} disabled={isLoading}>
            <FontAwesomeIcon icon={faBackward} />
          </button>
          <button onClick={togglePlayPause} disabled={isLoading}>
            <FontAwesomeIcon icon={isLoading ? faSpinner : (isPlaying ? faPause : faPlay)} />
          </button>
          <button onClick={handleNext} disabled={isLoading}>
            <FontAwesomeIcon icon={faForward} />
          </button>
        </div>
        <div className="time-display">
          <span>{formatTime(currentTime)}</span>
        </div>
        <div className="progress-bar">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
          />
        </div>
        <div className="time-display">
          <span>{formatTime(duration)}</span>
        </div>
        <div className="volume-control">
          <FontAwesomeIcon icon={faVolumeUp} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
        <audio ref={audioRef} />
      </div>
    )
  );
};

export default NowPlayingBar;