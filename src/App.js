import React from 'react';
import './App.css';
import Sidebar from './Component/Sidebar/Sidebar';
import MainContent from './Component/MainContent/MainContent';
import LoginForm from './Component/Login/Login.js';
import Home from './Component/Home/Home.js';
import Signup from './Component/Signup/Signup.js';
import Userin from './Component/Userinfo/Userin.js';
import Musicplayer from './Component/Musicplayer/Musicplayer.js';
import Search from './Component/search/search.jsx';
import NowPlayingBar from './Component/NowPlayingBar/NowPlayingBar.js'; // Import the new component

import { SearchProvider } from './context/SearchContext';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();

  return (
    <div className="app">
      {location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/userin' && <Sidebar />}
      <SearchProvider>
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/home" element={<Home />} />
          <Route path="/musicplayer/:albumId" element={<Musicplayer />} />
          <Route path="/userin" element={<Userin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </SearchProvider>
      <NowPlayingBar /> {/* Include the NowPlayingBar component */}
    </div>
  );
}

export default App;