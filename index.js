const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: 'postgres://focuqkyj:BwVzr7XAnpPQymR_n_eTrUJ-twFiAZtK@rogue.db.elephantsql.com/focuqkyj',
  ssl: {
    rejectUnauthorized: false
  }
});

app.get('/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/users/:id/orders', async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const { rows } = await pool.query('SELECT * FROM orders WHERE user_id = $1', [userId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.post('/users', async (req, res) => {
  const { firstName, lastName, age } = req.body;
  try {
    const { rows } = await pool.query('INSERT INTO users (first_name, last_name, age) VALUES ($1, $2, $3) RETURNING *', [firstName, lastName, age]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
