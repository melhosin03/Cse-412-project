import React, { useEffect, useState } from 'react';

function AdminDashboard({ user }) {
  const [games, setGames] = useState([]);
  const [newGame, setNewGame] = useState({
    title: '',
    description: '',
    price: '',
    platform: '',
    genre: '',
    developer: '',
    stock_quantity: '',
    release_date: ''
  });

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    const res = await fetch('http://localhost:5001/api/games');
    const data = await res.json();
    setGames(data);
  };

  const handleInputChange = (e) => {
    setNewGame({ ...newGame, [e.target.name]: e.target.value });
  };

  const handleAddGame = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:5001/api/admin/add-game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newGame)
    });

    if (res.ok) {
      alert('Game added!');
      setNewGame({
        title: '',
        description: '',
        price: '',
        platform: '',
        genre: '',
        developer: '',
        stock_quantity: '',
        release_date: ''
      });
      fetchGames();
    } else {
      alert('Failed to add game.');
    }
  };

  const handleDeleteGame = async (id) => {
    const res = await fetch(`http://localhost:5001/api/admin/delete-game/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      alert('Game deleted!');
      fetchGames();
    } else {
      alert('Failed to delete game.');
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <form onSubmit={handleAddGame} className="add-game-form">
        <h3>Add New Game</h3>
        {Object.keys(newGame).map((key) => (
          <div key={key}>
            <label>{key.replace('_', ' ')}:</label>
            <input
              type={key === 'release_date' ? 'date' : key === 'price' || key === 'stock_quantity' ? 'number' : 'text'}
              name={key}
              value={newGame[key]}
              onChange={handleInputChange}
              required
            />
          </div>
        ))}
        <button type="submit">Add Game</button>
      </form>

      <h3>Existing Games</h3>
      <ul>
        {games.map((game) => (
          <li key={game.game_id}>
            {game.title} — {game.platform}
            <button onClick={() => handleDeleteGame(game.game_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
