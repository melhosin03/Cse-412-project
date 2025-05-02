import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddGame({ user }) {
  const navigate = useNavigate();

  const [game, setGame] = useState({
    title: '',
    description: '',
    price: '',
    platform: '',
    genre: '',
    developer: '',
    stock_quantity: '',
    release_date: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGame({ ...game, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:5001/api/admin/add-game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(game)
    });

    if (res.ok) {
      alert('Game added successfully!');
      navigate('/');
    } else {
      alert('Failed to add game');
    }
  };

  return (
    <div className="add-game-form">
      <h2>Add New Game</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(game).map((key) => (
          <div key={key}>
            <label>{key.replace('_', ' ')}:</label>
            <input
              type={
                key === 'release_date'
                  ? 'date'
                  : key === 'price' || key === 'stock_quantity'
                  ? 'number'
                  : 'text'
              }
              name={key}
              value={game[key]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit">Submit</button>
        <button type="button" onClick={() => navigate('/')} style={{ marginLeft: '10px' }}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default AddGame;
