import React from 'react';
import './App.css';
import TopBar from './Component/AppBar';
import { MainContent } from './Component/Main';

// first parent element
function App() {
  return (
    <div className="App">
      <TopBar/>
      <MainContent/>
    </div>
  );
}

export default App;
