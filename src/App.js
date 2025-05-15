import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import logo from './internhub-logo.png';
import ThankYou from './ThankYou';

function HomePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || 'Error adding email to waitlist.');
      } else {
        localStorage.setItem('waitlistEmail', email);
        navigate('/thank-you');
      }
    } catch (error) {
      alert('Error connecting to server.');
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
