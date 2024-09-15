import React, { useEffect, useState } from 'react';
import './App.css';
import Sidebar from './Component/Sidebar/Sidebar';
import MainContent from './Component/MainContent/MainContent';
import LoginForm from './Component/Login/Login.js';
import Home from './Component/Home/Home.js';
import Signup from './Component/Signup/Signup.js';
import Userin from './Component/Userinfo/Userin.js';
import Musicplayer from './Component/Musicplayer/Musicplayer.js';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const [player, setPlayer] = useState(null); // Để lưu trữ đối tượng Spotify Player

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      // Thay thế 'YOUR_OAUTH_TOKEN' bằng token bạn lấy từ quá trình OAuth
      const token = 'YOUR_OAUTH_TOKEN'; 

      const playerInstance = new window.Spotify.Player({
        name: 'React Spotify Player',
        getOAuthToken: cb => { cb(token); }, // Cung cấp token khi player cần
        volume: 0.5
      });

      // Đăng ký sự kiện của player
      playerInstance.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });

      playerInstance.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      // Kết nối player
      playerInstance.connect();

      // Lưu trữ player vào state
      setPlayer(playerInstance);
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="app">
      {location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/userin' && <Sidebar />}
      
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/musicplayer/:albumId" element={<Musicplayer player={player} />} />
        <Route path="/userin" element={<Userin />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
