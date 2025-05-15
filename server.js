const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// SQLite connection
const db = new sqlite3.Database('sqlitecloud://conun07anz.g1.sqlite.cloud:8860/chinook.sqlite?apikey=ly9HAeqcPnNqrMfP72vG4lyrRV9tqsF3byAC1u1YFa8', (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Create waitlist table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS waitlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Routes
app.post('/api/waitlist', (req, res) => {
  const { email } = req.body;
  
  db.run('INSERT INTO waitlist (email) VALUES (?)', [email], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ message: 'Email already exists in waitlist' });
      } else {
        res.status(500).json({ message: 'Error adding email to waitlist' });
      }
    } else {
      res.status(201).json({ message: 'Email added to waitlist successfully' });
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 