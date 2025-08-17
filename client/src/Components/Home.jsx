
import React, { useEffect, useState } from "react";
import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


const demoDoctorData = [
  {
    name: "Dr. Anjali Sharma",
    specialization: "General Ayurveda",
    description:
      "With over 15 years of experience, Dr. Sharma provides holistic Ayurvedic care for a balanced life.",
    modes: ["Online", "In-person"],
  },
  {
    name: "Dr. Vikram Singh",
    specialization: "Panchakarma",
    description:
      "Dr. Singh is a renowned specialist in Panchakarma detoxification and rejuvenation therapies.",
    modes: ["In-person"],
  },
  {
    name: "Dr. Priya Desai",
    specialization: "Ayurvedic Nutrition",
    description:
      "Dr. Desai helps patients achieve optimal health through personalized Ayurvedic dietary plans.",
    modes: ["Online"],
  },
  {
    name: "Dr. Rohan Verma",
    specialization: "Skin & Beauty",
    description:
      "Expert in natural, Ayurvedic solutions for skin health and timeless beauty.",
    modes: ["Online", "In-person"],
  },
];

const API_BASE = "http://localhost:5000/api"; 

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [specialization, setSpecialization] = useState("All");
  const [mode, setMode] = useState("All");

  const [doctors, setDoctors] = useState(demoDoctorData);
  const [loading, setLoading] = useState(true);
  const [backendAvailable, setBackendAvailable] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
   
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`${API_BASE}/doctors`, { timeout: 3000 });
        if (Array.isArray(res.data) && res.data.length > 0) {
          setDoctors(res.data);
          setBackendAvailable(true);
        } else {
       
          setDoctors(demoDoctorData);
        }
      } catch (err) {
        
        console.warn(
          "Could not fetch doctors from backend, using demo data.",
          err.message
        );
        setDoctors(demoDoctorData);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doc) => {
    const matchesName = doc.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSpecialization =
      specialization === "All" || doc.specialization === specialization;
    const matchesMode =
      mode === "All" || (doc.modes && doc.modes.includes(mode));
    return matchesName && matchesSpecialization && matchesMode;
  });

  const uniqueSpecializations = [
    ...new Set(doctors.map((doc) => doc.specialization).filter(Boolean)),
  ];

  
  const hasValidId = (doc) =>
    !!doc?._id && /^[a-fA-F0-9]{24}$/.test(String(doc._id));

  if (loading)
    return (
      <div className="homepage" style={{ padding: 20 }}>
        Loading doctors…
      </div>
    );

  return (
    <div className="homepage">
      <nav className="navbar">
        <div className="logo">&#127811; AyuMeet</div>
        <div className="nav-links">
          <a href="/about">About Us</a>
          <Link to="/dashboard">Dashboard</Link>
        </div>
        <div className="auth-buttons">
          <Link to="/login" className="login">
            Login
          </Link>
          <Link to="/signup" className="signup">
            Sign Up
          </Link>
        </div>
      </nav>

      <section className="hero">
        <h1>Find Your Ayurvedic Healer</h1>
        <p>
          Discover and book consultations with top Ayurvedic doctors, tailored
          to your wellness needs.
        </p>
        <button
          className="get-started"
          onClick={() => {
            navigate("/signup");
          }}
        >
          Get Started
        </button>
      </section>

      <section className="practitioners">
        <h2>Our Practitioners</h2>
        <p>Select a specialist that aligns with your wellness goals.</p>

        <div className="search-filter">
          <input
            type="text"
            placeholder="Search by doctor's name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          >
            <option value="All">All Specializations</option>
            {uniqueSpecializations.map((spec, i) => (
              <option key={i} value={spec}>
                {spec}
              </option>
            ))}
          </select>

          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="All">All Modes</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Home Visit">Home Visit</option>
            <option value="In-person">In-person</option>
          </select>
        </div>

        <div className="doctor-list">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doc, index) => (
              <div className="doctor-card" key={doc._id ?? `demo-${index}`}>
                <div className="avatar"></div>
                <h3>{doc.name}</h3>
                <div className="specialization">{doc.specialization}</div>
                <p>{doc.description}</p>
                <div className="modes">
                  {doc.modes?.map((mode) => (
                    <span className="mode" key={mode}>
                      {mode === "Online" && "\u{1F4BB} Online"} 
                      {mode === "Offline" && "\u{1F3EB} Offline"} 
                      {mode === "Home Visit" && "\u{1F3E0} Home Visit"}{" "}
                     
                      {mode === "In-person" && "\u{1F3EB} In-person"} 
                    </span>
                  ))}
                </div>

                {hasValidId(doc) ? (
                  <button
                    className="view-button"
                    onClick={() => {
                      const token =
                        localStorage.getItem("token") ||
                        localStorage.getItem("authToken");
                      if (!token) {
                        alert("You must register/login first!");
                        navigate("/signup");
                      } else {
                        navigate(`/doctor/${doc._id}`);
                      }
                    }}
                  >
                    &#128197; View Availability
                  </button>
                ) : (
                  <button
                    className="view-button disabled"
                    onClick={() => {
                      alert(
                        "This is demo data. To view real doctor details, seed the backend with doctor records (so each doctor has a MongoDB _id)."
                      );
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    &#128197; View Availability
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="no-doctors">No doctors available.</div>
          )}
        </div>
      </section>

      <div className="why-choose">
        <h2>Why Choose AyuMeet?</h2>
        <div className="why-grid">
          <div className="why-card">
            <div className="why-icon">&#127811;</div>
            <h3>Holistic Approach</h3>
            <p>
              We believe in treating the whole person—mind, body, and spirit— to
              achieve true, lasting wellness.
            </p>
          </div>
          <div className="why-card">
            <div className="why-icon">&#128104;</div>
            <h3>Expert Practitioners</h3>
            <p>
              Our certified Ayurvedic doctors have years of experience in
              providing authentic and personalized care.
            </p>
          </div>
          <div className="why-card">
            <div className="why-icon">&#128737;</div>
            <h3>Personalized Care</h3>
            <p>
              Receive wellness plans and treatments that are tailored
              specifically to your unique constitution and health needs.
            </p>
          </div>
        </div>
      </div>

      <div className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step-card">
            <div className="step-icon">&#128269;</div>
            <h3>1. Find Your Doctor</h3>
            <p>
              Browse through our list of expert Ayurvedic practitioners and
              filter by specialization to find the right match for you.
            </p>
          </div>
          <div className="step-card">
            <div className="step-icon">&#128197;</div>
            <h3>2. Book a Slot</h3>
            <p>
              View the doctor’s availability and select a convenient time slot
              for your online consultation.
            </p>
          </div>
          <div className="step-card">
            <div className="step-icon">&#128214;</div>
            <h3>3. Get Consultation</h3>
            <p>
              Connect with your doctor for a one-on-one consultation and receive
              a personalized wellness plan.
            </p>
          </div>
        </div>
      </div>

      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <details>
          <summary>What is Ayurveda?</summary>
          <p>
            Ayurveda is an ancient holistic healing system from India focused on
            balance between mind, body, and spirit using natural methods.
          </p>
        </details>
        <details>
          <summary>Is online consultation effective?</summary>
          <p>
            Yes, online consultations allow you to receive personalized advice
            from Ayurvedic doctors at your convenience.
          </p>
        </details>
        <details>
          <summary>How do I choose the right doctor?</summary>
          <p>
            You can search by name, specialization, or availability mode to find
            the best match for your wellness goals.
          </p>
        </details>
      </div>

      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-column brand">
            <div className="footer-logo">
              <span role="img" aria-label="leaf">
                &#127811;
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
