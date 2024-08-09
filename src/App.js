import React from 'react';
import './App.css';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
function App() {
  return (
    <div className="app">
      <Sidebar />
      <MainContent />
    </div>
  );
}

export default App;