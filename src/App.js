import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Database } from '@sqlitecloud/drivers';
import './App.css';
import logo from './internhub-logo.png';
import ThankYou from './ThankYou';

const db = new Database("sqlitecloud://conun07anz.g1.sqlite.cloud:8860/chinook.sqlite?apikey=ly9HAeqcPnNqrMfP72vG4lyrRV9tqsF3byAC1u1YFa8");

function HomePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Creating table if not exists...');
      // Create waitlist table if it doesn't exist
      await db.sql`
        CREATE TABLE IF NOT EXISTS waitlist (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log('Table created/verified');

      console.log('Inserting email:', email);
      // Insert email into waitlist
      await db.sql`
        INSERT INTO waitlist (email) VALUES (${email})
      `;
      console.log('Email inserted successfully');

      localStorage.setItem('waitlistEmail', email);
      navigate('/thank-you');
    } catch (error) {
      console.error('Error in form submission:', error);
      setError(error.message);
      if (error.message.includes('UNIQUE constraint failed')) {
        alert('This email is already in our waitlist!');
      } else {
        alert('Error adding email to waitlist. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <section className="hero">
        <img src={logo} className="logo" alt="InternHub Logo" />
        <h1>InternHub</h1>
        <p className="subtitle">Connect with interns, make friends, and explore your city together.</p>
        <a className="cta-btn" href="#waitlist">Join the Waitlist</a>
      </section>

      <section className="features">
        <h2>Why InternHub?</h2>
        <div className="features-list">
          <div className="feature">
            <h3>Meet New People</h3>
            <p>Connect with interns from nearby companies and schools.</p>
          </div>
          <div className="feature">
            <h3>Explore Your City</h3>
            <p>Discover local hangouts, activities, and events together.</p>
          </div>
          <div className="feature">
            <h3>Make Memories</h3>
            <p>Create unforgettable moments with your new community.</p>
          </div>
        </div>
      </section>

      <section className="waitlist" id="waitlist">
        <h2>Join the Waitlist</h2>
        <form className="waitlist-form" onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Enter your email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="loading-spinner" />
                Submitting...
              </>
            ) : 'Notify Me'}
          </button>
        </form>
      </section>

      <footer>
        &copy; 2025 InternHub. All rights reserved.
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
    </Router>
  );
}

export default App;
