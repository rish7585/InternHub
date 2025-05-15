import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const API_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5001/api/waitlist'
    : 'https://your-backend.onrender.com/api/waitlist';

function ThankYou() {
  const [email, setEmail] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [storedEmails, setStoredEmails] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem('waitlistEmail');
    if (savedEmail) setEmail(savedEmail);
    setIsVisible(true);

    // Fetch all stored emails from backend
    const fetchEmails = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to fetch emails');
        const data = await res.json();
        setStoredEmails(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchEmails();
  }, []);

  return (
    <div className="App">
      <section className="hero thank-you-page" style={{
        opacity: isVisible ? 1 : 0,
        transform: `translateY(${isVisible ? '0' : '20px'})`,
        transition: 'all 0.5s ease-out'
      }}>
        <div className="thank-you-content">
          <div className="success-check" />
          <h1>Thank You!</h1>
          <p className="subtitle">We've added you to our waitlist. We'll notify you when InternHub launches!</p>
          {email && (
            <p className="email-confirmation">
              We'll send updates to: <strong>{email}</strong>
            </p>
          )}
          <div className="stored-emails">
            <h3>All Waitlist Emails:</h3>
            {error ? (
              <p className="error-message">Error: {error}</p>
            ) : (
              <div className="email-list">
                {storedEmails.length === 0 ? (
                  <p>No emails in the waitlist yet.</p>
                ) : (
                  storedEmails.map((item, index) => (
                    <div key={index} className="email-item">
                      <span className="email">{item.email}</span>
                      <span className="date">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <Link to="/" className="cta-btn">Back to Home</Link>
        </div>
      </section>
    </div>
  );
}

export default ThankYou; 