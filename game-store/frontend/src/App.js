import React from 'react';
import GameSearch from './components/GameSearch';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Game Store</h1>
      </header>
      <main className="container">
        <GameSearch />
      </main>
    </div>
  );
}

export default App;