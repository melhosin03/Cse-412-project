import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GameSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dbStatus, setDbStatus] = useState('');
  
  // Test database connection on component mount
  useEffect(() => {
    const testDbConnection = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/test-db');
        if (response.data.success) {
          setDbStatus('Connected to database successfully!');
        }
      } catch (err) {
        setDbStatus('Failed to connect to database. Check backend server.');
        console.error('DB test error:', err);
      }
    };
    
    testDbConnection();
  }, []);
  
  // Fetch initial games on mount
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/games');
        setGames(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching games. Check backend server.');
        setLoading(false);
        console.error('Fetch error:', err);
      }
    };
    
    fetchGames();
  }, []);
  
  const handleSearch = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5001/api/games/search?title=${searchTerm}`);
      setGames(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error searching games');
      setLoading(false);
      console.error('Search error:', err);
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  return (
    <div className="game-search">
      <div className="db-status">
        Database Status: <span className={dbStatus.includes('Connected') ? 'connected' : 'disconnected'}>
          {dbStatus || 'Checking connection...'}
        </span>
      </div>
      
      <form onSubmit={handleSearch} className="search-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Search games by title..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </div>
      </form>
      
      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="games-list">
          <h2>Games ({games.length})</h2>
          {games.length === 0 ? (
            <p>No games found. Try a different search term.</p>
          ) : (
            <div className="game-cards">
              {games.map(game => (
                <div key={game.game_id} className="game-card">
                  <h3>{game.title}</h3>
                  <p className="platform"><strong>Platform:</strong> {game.platform}</p>
                  <p className="price"><strong>Price:</strong> ${game.price}</p>
                  <p className="genre"><strong>Genre:</strong> {game.genre}</p>
                  <p className="developer"><strong>Developer:</strong> {game.developer}</p>
                  <p className="stock"><strong>In Stock:</strong> {game.stock_quantity}</p>
                  <p className="release-date"><strong>Release Date:</strong> {new Date(game.release_date).toLocaleDateString()}</p>
                  <div className="description">
                    <strong>Description:</strong>
                    <p>{game.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GameSearch;