import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import GameSearch from './components/GameSearch';
import GameDetail from './components/GameDetail';
import Login from './components/Login';
import AddGame from './components/AddGame';
import Signup from './components/SignUp';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [refreshGames, setRefreshGames] = useState(false);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1 style={{ cursor: 'pointer' }} onClick={() => setRefreshGames(prev => !prev)}>
            Game Store
          </h1>

          {user && (
            <div style={{ position: 'absolute', top: '10px', right: '20px', textAlign: 'right' }}>
              <p style={{ margin: 0 }}>Welcome, {user.name}</p>
              <button onClick={() => setUser(null)}>Logout</button>
            </div>
          )}
        </header>
        <main className="container">
          {!user ? (
            <>
              <Login setUser={setUser} />
              <p style={{ marginTop: '1rem' }}>
                New here? <Link to="/signup">Create an account</Link>
              </p>
              <Routes>
                <Route path="/signup" element={<Signup setUser={setUser} />} />
              </Routes>
            </>
          ) : (
            <Routes>
              <Route path="/" element={<GameSearch user={user} refreshTrigger={refreshGames} />} />
              <Route path="/game/:id" element={<GameDetail user={user} />} />
              {user.isAdmin && (
                <Route path="/admin/add" element={<AddGame user={user} />} />
              )}
            </Routes>
          )}
        </main>
      </div>
    </Router>
  );
}

export default App;
