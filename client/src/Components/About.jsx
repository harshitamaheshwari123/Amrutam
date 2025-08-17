import React from "react";
import "./About.css";
import Navbar from "./Navbar";

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Header */}
      <Navbar/>
      <section className="about-header">
        <div className="about-icon">🍃</div>
        <h1>About AyuMeet</h1>
        <p>
          We are dedicated to bridging the gap between ancient Ayurvedic wisdom
          and modern-day wellness seekers through a trusted, accessible, and
          supportive online platform.
        </p>
      </section>

      {/* Mission & Story */}
      <section className="mission-story">
        <div className="mission-text">
          <h2>Our Mission & Story</h2>

          <div className="mission-block">
            <h3>🎯 Our Mission</h3>
            <p>
              To empower individuals to achieve holistic health and well-being
              by providing easy access to authentic Ayurvedic practitioners and
              personalized care, regardless of their location.
            </p>
          </div>

          <div className="mission-block">
            <h3>📖 Our Story</h3>
            <p>
              AyuMeet was founded by a team of wellness enthusiasts and
              Ayurvedic experts with a shared vision: to make Ayurveda simple,
              digital, and global. What started as a passion project is now a
              platform helping thousands find balance and healing.
            </p>
          </div>
        </div>

        <div className="mission-image">
          <img
            src="https://via.placeholder.com/600x400"
            alt="About illustration"
          />
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="team-section">
        <h2>Meet Our Team</h2>
        <p className="team-subtitle">
          The passionate individuals behind AyuMeet.
        </p>
        <div className="team-grid">
          <div className="team-card">
            <img
              src="https://via.placeholder.com/400x400"
              alt="Alisha Sharma"
            />
            <h3>Dr. Alisha Sharma</h3>
            <h4>Founder & Chief Ayurvedic Officer</h4>
            <p>
              Alisha is a third-generation Ayurvedic doctor with a passion for
              making ancient wisdom accessible to the modern world. She founded
              AyuMeet to connect people with authentic practitioners.
            </p>
          </div>
          <div className="team-card">
            <img src="https://via.placeholder.com/400x400" alt="Rohan Mehta" />
            <h3>Rohan Mehta</h3>
            <h4>Chief Executive Officer</h4>
            <p>
              Rohan brings his expertise in technology and business to guide
              AyuMeet’s mission. He is dedicated to creating a seamless and
              trustworthy platform for holistic wellness.
            </p>
          </div>
          <div className="team-card">
            <img src="https://via.placeholder.com/400x400" alt="Priya Singh" />
            <h3>Priya Singh</h3>
            <h4>Head of Community</h4>
            <p>
              Priya fosters a supportive and engaging community for our users
              and practitioners. She ensures everyone feels welcome and heard on
              their wellness journey.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-column brand">
            <div className="footer-logo">
              <span role="img" aria-label="leaf">
                🍃
              </span>{" "}
              <strong>AyuMeet</strong>
            </div>
            <p>Your trusted partner for holistic Ayurvedic care.</p>
          </div>

          <div className="footer-column">
            <h4>AyuMeet</h4>
            <ul>
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Why Us?</a>
              </li>
              <li>
                <a href="#">How It Works</a>
              </li>
              <li>
                <a href="#">Doctors</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li>
                <a href="#">FAQ</a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">Support</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Legal</h4>
            <ul>
              <li>
                <a href="#">Terms of Service</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
            </ul>
          </div>
        </div>

        <hr />
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} AyuMeet. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
