const express = require('express');
const cors = require('cors');
const { Database } = require('@sqlitecloud/drivers');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use Railway environment variable for SQLiteCloud connection
const db = new Database(process.env.SQLITE_CLOUD_URL);

// Create waitlist table if it doesn't exist
(async () => {
  await db.sql`
    CREATE TABLE IF NOT EXISTS waitlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
})();

// Add email to waitlist
app.post('/api/waitlist', async (req, res) => {
  const { email } = req.body;
  try {
    await db.sql`INSERT INTO waitlist (email) VALUES (${email})`;
    res.status(201).json({ message: 'Email added to waitlist successfully' });
  } catch (error) {
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ message: 'Email already exists in waitlist' });
    } else {
      res.status(500).json({ message: 'Error adding email to waitlist' });
    }
  }
});

// Get all emails from waitlist
app.get('/api/waitlist', async (req, res) => {
  try {
    const result = await db.sql`SELECT email, created_at FROM waitlist ORDER BY created_at DESC`;
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching emails' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 