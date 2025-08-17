import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        🍃 AyuMeet
      </div>
      <div className="nav-links">
        <a href="/about">About Us</a>
        <a href="/dashboard">Dashboard</a>
      </div>
      <div className="auth-buttons">
        <button className="login" onClick={() => navigate("/login")}>
          Login
        </button>
        <button className="signup" onClick={() => navigate("/signup")}>
          Sign Up
        </button>
      </div>
    </nav>
  );
}
