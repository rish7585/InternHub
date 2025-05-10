import React from 'react';
import './App.css';
import logo from './internhub-logo.png';

function App() {
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
        <form className="waitlist-form">
          <input type="email" placeholder="Enter your email" required />
          <button type="submit">Notify Me</button>
        </form>
      </section>

      <footer>
        &copy; 2025 InternHub. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
