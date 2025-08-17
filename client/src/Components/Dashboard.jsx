import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

const API_BASE = "https://amrutam-sf8x.onrender.com/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = getToken();
      if (!token) return;
      setLoading(true);
      try {
        const res = await axios.get(
          `${API_BASE}/appointments/my-appointments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Fetched appointments:", res.data);
        setAppointments(res.data);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const getToken = () => localStorage.getItem("token") || null;

  const fetchAppointments = async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/appointments/my-appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (location.state?.refresh) {
      fetchAppointments();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const getCurrentAppointments = () => {
    return appointments.filter((a) => {
      if (activeTab === "upcoming") return a.status === "Confirmed";
      if (activeTab === "completed") return a.status === "Completed";
      if (activeTab === "cancelled") return a.status === "Cancelled";
      return true;
    });
  };

  const getTabCount = (tab) => {
    return appointments.filter((a) => {
      if (tab === "upcoming") return a.status === "Confirmed";
      if (tab === "completed") return a.status === "Completed";
      if (tab === "cancelled") return a.status === "Cancelled";
      return true;
    }).length;
  };

  const handleViewDetails = (appointmentId) => {
    navigate(`/appointment/${appointmentId}`, { state: { appointmentId } });
  };

  const handleDelete = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?"))
      return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to cancel");
        return;
      }

      await axios.post(
        `${API_BASE}/appointments/${appointmentId}/cancel`,
        { reason: "Cancelled by user" }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Appointment cancelled successfully!");

      
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === appointmentId ? { ...appt, status: "Cancelled" } : appt
        )
      );
    } catch (err) {
      console.error("Failed to cancel:", err);
      alert(err.response?.data?.message || "Failed to cancel appointment");
    }
  };

  const handleBackToMain = () => navigate("/");

  return (
    <div className="dashboard-container">
     
      <div className="sidebar">
        <div className="logo">
          <span role="img" aria-label="leaf">
            &#127811;
          </span>
          <span>AyuMeet</span>
        </div>

        <nav className="nav-menu">
          <div className="nav-item active">
            <span>My Appointments</span>
          </div>
          <div className="nav-item">
            <span>Doctor Dashboard</span>
          </div>
          <div className="nav-item">
            <span>Admin Dashboard</span>
          </div>
        </nav>

        <div className="back-to-main" onClick={handleBackToMain}>
          <span>Back to Main Site</span>
        </div>
      </div>


      <div className="main-content">
        <div className="dashboard-header">
          <h1>My Appointments</h1>
          <p>Manage your consultations and view your wellness journey.</p>
        </div>

        
        <div className="filter-tabs">
          <button
            className={`filter-tab ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming ({getTabCount("upcoming")})
          </button>
          <button
            className={`filter-tab ${
              activeTab === "completed" ? "active" : ""
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Completed ({getTabCount("completed")})
          </button>
          <button
            className={`filter-tab ${
              activeTab === "cancelled" ? "active" : ""
            }`}
            onClick={() => setActiveTab("cancelled")}
          >
            Cancelled ({getTabCount("cancelled")})
          </button>
        </div>

       
        <div className="appointments-grid">
          {loading ? (
            <p>Loading appointments...</p>
          ) : getCurrentAppointments().length > 0 ? (
            getCurrentAppointments().map((appointment) => (
              <div key={appointment._id} className="appointment-card">
                <div className="appointment-header">
                  <h3>{appointment.doctorId?.name}</h3>
                  <span className={`status ${activeTab}`}>
                    {appointment.status}
                  </span>
                </div>

                <div className="appointment-details">
                  <div className="detail-item">
                    <span className="icon">&#128137;</span>
                    <span className="text">
                      {appointment.doctorId?.specialization}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="icon">&#128197;</span>
                    <span className="text">
                      {new Date(appointment.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="icon">&#128336;</span> 
                    <span className="text">{appointment.startTime}</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="action-btn"
                    onClick={() => handleViewDetails(appointment._id)}
                  >
                    View Details
                  </button>
                  {activeTab === "upcoming" && (
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(appointment._id)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-appointments">
              <span>&#128197;</span>
              <p>No {activeTab} appointments found</p>
              <p>Book your first consultation to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
