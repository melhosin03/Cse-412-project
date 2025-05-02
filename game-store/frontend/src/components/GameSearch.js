import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function GameSearch({ user, refreshTrigger }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dbStatus, setDbStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    testDbConnection();
    fetchAllGames();
  }, []);

  useEffect(() => {
    fetchAllGames(); // Re-fetch full list when the trigger changes
  }, [refreshTrigger]);

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

  const fetchAllGames = async () => {
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

  const handleDeleteGame = async (gameId) => {
    const confirmed = window.confirm('Are you sure you want to delete this game?');
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:5001/api/admin/delete-game/${gameId}`);
      setGames((prev) => prev.filter((g) => g.game_id !== gameId));
      alert('Game deleted!');
    } catch (err) {
      console.error(err);
      alert('Failed to delete game.');
    }
  };

  return (
    <div className="game-search">
      <div className="db-status">
        Database Status:{' '}
        <span className={dbStatus.includes('Connected') ? 'connected' : 'disconnected'}>
          {dbStatus || 'Checking connection...'}
        </span>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Search games by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </div>
      </form>

      {user?.isAdmin && (
        <button onClick={() => navigate('/admin/add')} style={{ marginBottom: '1rem' }}>
          Add New Game
        </button>
      )}

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
              {games.map((game) => (
                <div key={game.game_id} className="game-card">
                  <h3>{game.title}</h3>
                  <p><strong>Platform:</strong> {game.platform}</p>
                  <p><strong>Price:</strong> ${game.price}</p>
                  <p><strong>Genre:</strong> {game.genre}</p>
                  <p><strong>Developer:</strong> {game.developer}</p>
                  <p><strong>In Stock:</strong> {game.stock_quantity}</p>
                  <p><strong>Release Date:</strong> {new Date(game.release_date).toLocaleDateString()}</p>
                  <div><strong>Description:</strong> {game.description}</div>
                  <Link to={`/game/${game.game_id}`}><button>Details</button></Link>
                  {user?.isAdmin && (
                    <button onClick={() => handleDeleteGame(game.game_id)} style={{ marginLeft: '10px' }}>
                      Delete
                    </button>
                  )}
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
