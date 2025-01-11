import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faForward, faBackward, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import './NowPlayingBar.css';

const NowPlayingBar = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const savedTrack = localStorage.getItem('currentTrack');
    const savedDuration = localStorage.getItem('trackDuration');
    console.log('Saved track from localStorage:', savedTrack); // Log the saved track
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
        console.log('NowPlayingBar is displaying the track:', track); // Log the track being displayed
      }
    }
  }, []);

  useEffect(() => {
    const handleTrackSelected = (event) => {
      const track = event.detail;
      setCurrentTrack(track);
      if (audioRef.current) {
        audioRef.current.src = `http://localhost:5000/youtube-audio?videoId=${track.id}`;
        audioRef.current.play();
        setIsPlaying(true);
        console.log('NowPlayingBar is displaying the track:', track); // Log the track being displayed
      }
    };

    window.addEventListener('trackSelected', handleTrackSelected);

    return () => {
      window.removeEventListener('trackSelected', handleTrackSelected);
    };
  }, []);
  

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
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    // Implement logic to play the next track
  };

  const handlePrevious = () => {
    // Implement logic to play the previous track
  };

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
  };

  const handleProgressChange = (event) => {
    if (audioRef.current) {
      audioRef.current.currentTime = (event.target.value / 100) * audioRef.current.duration;
      setProgress(event.target.value);
    }
  };

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
          <button onClick={handlePrevious}>
            <FontAwesomeIcon icon={faBackward} />
          </button>
          <button onClick={togglePlayPause}>
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
          </button>
          <button onClick={handleNext}>
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