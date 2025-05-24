import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import logo from './internhub-logo.png';
import ThankYou from './ThankYou';

const API_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5001/api/waitlist'
    : 'https://api.internhub.us/api/waitlist';

function HomePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(API_URL, {
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

      <section className="features-grid-section dropdown">
        <button
          className="dropdown-toggle"
          onClick={() => setDropdownOpen((open) => !open)}
          aria-expanded={dropdownOpen}
          aria-controls="features-dropdown"
          type="button"
        >
          See all features <span className={`dropdown-chevron${dropdownOpen ? ' open' : ''}`}>▼</span>
        </button>
        {dropdownOpen && <div className="dropdown-backdrop" />}
        <div
          className={`features-grid dropdown-content${dropdownOpen ? ' open' : ''}`}
          id="features-dropdown"
          ref={dropdownRef}
          style={{ pointerEvents: dropdownOpen ? 'auto' : 'none' }}
        >
          <button className="dropdown-close" onClick={() => setDropdownOpen(false)} aria-label="Close features dropdown">×</button>
          <div className="feature-category">
            <h3>👥 Profile & Discovery</h3>
            <ul>
              <li>Personal profile with school and internship details</li>
              <li>City and interests matching</li>
              <li>Activity preferences (coffee, events, gym)</li>
              <li>Profile customization</li>
            </ul>
          </div>
          <div className="feature-category">
            <h3>🌐 Social Feed</h3>
            <ul>
              <li>Share lifestyle updates with photos</li>
              <li>Create and join events</li>
              <li>Start discussions and polls</li>
              <li>Interactive Q&A threads</li>
            </ul>
          </div>
          <div className="feature-category">
            <h3>🔍 Smart Search</h3>
            <ul>
              <li>Find people by company or school</li>
              <li>Location-based discovery</li>
              <li>Interest matching</li>
              <li>Event type filtering</li>
            </ul>
          </div>
          <div className="feature-category">
            <h3>🗓️ Event Discovery</h3>
            <ul>
              <li>RSVP to local events</li>
              <li>See who's attending</li>
              <li>Map integration</li>
              <li>Calendar sync</li>
            </ul>
          </div>
          <div className="feature-category">
            <h3>🛏️ Roommate Finder</h3>
            <ul>
              <li>Budget and location matching</li>
              <li>Lifestyle compatibility</li>
              <li>Direct messaging</li>
              <li>Detailed roommate profiles</li>
            </ul>
          </div>
          <div className="feature-category">
            <h3>💼 Intern Resources</h3>
            <ul>
              <li>Company-specific channels</li>
              <li>Local city guides</li>
              <li>Transportation tips</li>
              <li>Intern survival guides</li>
            </ul>
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
