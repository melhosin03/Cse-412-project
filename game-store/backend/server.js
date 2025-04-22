const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// Create Express app
const app = express();
const PORT = 5001; // Using 5001 

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost', 
  database: 'CSE412_Project', // Ensure this matches your database name
  password: 'asdfgh789456',  // Ensure this matches your database password
  port: 5432,
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, message: 'Database connected!', time: result.rows[0].now });
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
});

// Search games endpoint
app.get('/api/games/search', async (req, res) => {
  try {
    const { title } = req.query;
    let query = 'SELECT * FROM Games';
    let params = [];

    if (title) {
      query = 'SELECT * FROM Games WHERE title ILIKE $1';
      params = [`%${title}%`];
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error searching games:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all games endpoint
app.get('/api/games', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Games LIMIT 10');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching games:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get game by ID
app.get('/api/games/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM Games WHERE game_id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching game details:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});