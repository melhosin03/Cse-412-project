const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// Create Express app
const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  user: 'noahdezutter',
  host: 'localhost',
  database: 'gamestore',
  password: 'asdfgh789456',
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

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // First try customer login
    const customerResult = await pool.query(
      'SELECT * FROM customers WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (customerResult.rows.length > 0) {
      return res.json({ success: true, user: customerResult.rows[0], isAdmin: false });
    }

    // Then try admin login
    const adminResult = await pool.query(
      'SELECT * FROM administrators WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (adminResult.rows.length > 0) {
      return res.json({ success: true, user: adminResult.rows[0], isAdmin: true });
    }

    // No match
    res.json({ success: false, message: 'Invalid credentials' });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// Submit review endpoint
app.post('/api/reviews', async (req, res) => {
  const { customer_id, game_id, rating, review_text } = req.body;

  try {
    await pool.query(
      'INSERT INTO reviews (customer_id, game_id, rating, review_text) VALUES ($1, $2, $3, $4)',
      [customer_id, game_id, rating, review_text]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Review insert error:', err);
    res.status(500).json({ success: false });
  }
});

// Mock payment endpoint
app.post('/api/payment', async (req, res) => {
  const { customer_id, amount_paid, payment_method } = req.body;

  try {
    const paymentRes = await pool.query(
      'INSERT INTO payments (amount_paid, payment_status) VALUES ($1, $2) RETURNING transaction_id',
      [amount_paid, 'Successful']
    );

    const transaction_id = paymentRes.rows[0].transaction_id;

    await pool.query(
      'INSERT INTO orders (customer_id, total_price, order_status, payment_method, transaction_id) VALUES ($1, $2, $3, $4, $5)',
      [customer_id, amount_paid, 'Completed', payment_method, transaction_id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Payment error:', err);
    res.status(500).json({ success: false });
  }
});

app.get('/api/reviews/:game_id', async (req, res) => {
  const { game_id } = req.params;

  try {
    const result = await pool.query(
      'SELECT rating, review_text FROM reviews WHERE game_id = $1 ORDER BY review_date DESC',
      [game_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new game
app.post('/api/admin/add-game', async (req, res) => {
  const {
    title, description, price, platform,
    genre, developer, stock_quantity, release_date
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO games (title, description, price, platform, genre, developer, stock_quantity, release_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [title, description, price, platform, genre, developer, stock_quantity, release_date]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error adding game:', err);
    res.status(500).json({ success: false });
  }
});

// Delete game by ID
app.delete('/api/admin/delete-game/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM games WHERE game_id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting game:', err);
    res.status(500).json({ success: false });
  }
});

app.post('/api/signup', async (req, res) => {
  const { name, email, password, phone_number, address } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO customers (name, email, password, phone_number, address, is_registered)
       VALUES ($1, $2, $3, $4, $5, true)
       RETURNING *`,
      [name, email, password, phone_number, address]
    );
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, error: 'Signup failed' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

