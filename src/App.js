import React from "react";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="hero">
        <img src="/internhub-logo.png" alt="InternHub Logo" className="logo" />
        <h1>InternHub</h1>
        <p className="subtitle">
          InternHub is the social platform for interns to connect, make friends, and explore their city together.<br />
          Whether you're looking for roommates, local events, or new friends outside your company, InternHub helps you build your summer community—before Day 1 even begins.
        </p>
        <a href="#waitlist" className="cta-btn">Join the Waitlist</a>
      </header>

      <section className="features">
        <h2>Why InternHub?</h2>
        <div className="features-list">
          <div className="feature">
            <h3>Connect</h3>
            <p>Meet other interns in your city and company.</p>
          </div>
          <div className="feature">
            <h3>Find Roommates</h3>
            <p>Match with potential roommates before you move in.</p>
          </div>
          <div className="feature">
            <h3>Discover Events</h3>
            <p>Stay in the loop with local events and activities.</p>
          </div>
          <div className="feature">
            <h3>Make Friends</h3>
            <p>Build your summer community from Day 0.</p>
          </div>
        </div>
      </section>

      <section className="waitlist" id="waitlist">
        <h2>Get Early Access</h2>
        <form className="waitlist-form">
          <input type="email" placeholder="Your email" required />
          <button type="submit">Join Waitlist</button>
        </form>
      </section>

      <footer>
        <p>© {new Date().getFullYear()} InternHub. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;