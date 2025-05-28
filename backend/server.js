const express = require('express');
const cors = require('cors');
const { Database } = require('@sqlitecloud/drivers');

const app = express();
app.use(cors());
app.use(express.json());

// Environment variable for SQLiteCloud connection (Railway sets this)
const connectionString = process.env.SQLITE_CLOUD_URL;

// Ensure the waitlist table exists (using a short-lived connection at startup)
(async () => {
  let dbInit;
  try {
    dbInit = new Database(connectionString);
    await dbInit.sql`
      CREATE TABLE IF NOT EXISTS waitlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("Verified 'waitlist' table exists.");
  } catch (err) {
    console.error("Error initializing database schema:", err);
  } finally {
    dbInit?.close(); // close the initialization connection
  }
})();

// Route: Add email to waitlist (opens and closes its own connection)
app.post('/api/waitlist', async (req, res) => {
  const { email } = req.body;
  let db;
  try {
    db = new Database(connectionString);           // Open new connection for this request
    await db.sql`INSERT INTO waitlist (email) VALUES (${email});`;
    res.status(201).json({ message: 'Email added to waitlist successfully' });
  } catch (error) {
    // Handle specific errors (e.g., unique constraint or connection issues)
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ message: 'Email already exists in waitlist' });
    } else if (error.message && error.message.includes('connection')) {
      // Optional: Retry logic if the error was a connection issue
      try {
        console.warn('Database connection was closed, retrying...');
        db?.close();                   // ensure any broken connection is closed
        db = new Database(connectionString);  // establish a new connection
        await db.sql`INSERT INTO waitlist (email) VALUES (${email});`;
        return res.status(201).json({ message: 'Email added to waitlist successfully' });
      } catch (err2) {
        console.error('Retry failed:', err2);
        res.status(500).json({ message: 'Database connection error on insert' });
      }
    } else {
      console.error('Error adding email:', error);
      res.status(500).json({ message: 'Error adding email to waitlist' });
    }
  } finally {
    db?.close();  // Close the connection even if an error occurred
  }
});

// Route: Get all emails from waitlist (opens and closes its own connection)
app.get('/api/waitlist', async (req, res) => {
  let db;
  try {
    db = new Database(connectionString);
    const result = await db.sql`SELECT email, created_at FROM waitlist ORDER BY created_at DESC;`;
    res.json(result);
  } catch (error) {
    console.error('Error fetching waitlist:', error);
    res.status(500).json({ message: 'Error fetching emails' });
  } finally {
    db?.close();
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
