import React from 'react';
import './App.css';
import Sidebar from './Component/Sidebar/Sidebar';
import MainContent from './Component/MainContent/MainContent';
function App() {
  return (
    <div className="app">
      <Sidebar />
      <MainContent />
    </div>
  );
}

export default App;