import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./DoctorDetail.css";

const API_BASE = "https://amrutam-sf8x.onrender.com/api";

export default function DoctorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [error, setError] = useState("");

  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedMode, setSelectedMode] = useState("Online");
  const [notes, setNotes] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  const getToken = () => {
    return (
      localStorage.getItem("token") || localStorage.getItem("authToken") || null
    );
  };

  const looksLikeObjectId = (s) => /^[a-fA-F0-9]{24}$/.test(s);

  useEffect(() => {
    if (!id) return;
    if (!looksLikeObjectId(id)) {
      setError("Invalid doctor id in URL. Open the doctor from the Home page.");
      setLoadingDoctor(false);
      return;
    }

    const fetchDoctor = async () => {
      try {
        setLoadingDoctor(true);
        const res = await axios.get(`${API_BASE}/doctors/${id}`);
        setDoctor(res.data);
        if (res.data?.modes?.length) setSelectedMode(res.data.modes[0]);
      } catch (err) {
        console.error("Error fetching doctor:", err);
        setError(
          err.response?.data?.message || "Failed to fetch doctor details"
        );
      } finally {
        setLoadingDoctor(false);
      }
    };

    fetchDoctor();
  }, [id]);

  useEffect(() => {
    if (!selectedDate) return;
    fetchAvailableSlots();
  }, [selectedDate]);

  const fetchAvailableSlots = async () => {
    try {
      const res = await axios.get(`${API_BASE}/doctors/${id}/slots`, {
        params: { date: selectedDate },
      });
      setAvailableSlots(res.data || []);
    } catch (err) {
      console.error("Failed to fetch slots:", err);
      setError(
        err.response?.data?.message || "Failed to fetch available slots"
      );
    }
  };

  const handleBooking = async () => {
    setError("");
    const token = getToken();
    if (!token) {
      if (window.confirm("You must be logged in to book. Go to login page?")) {
        navigate("/login");
      }
      return;
    }
    if (!selectedSlot) {
      setError("Please select a time slot.");
      return;
    }
    setBookingLoading(true);
    try {
      const token = getToken();
      const res = await axios.post(
        `${API_BASE}/appointments/book`,
        {
          doctorId: id,
          timeSlotId: selectedSlot._id,
          mode: selectedMode,
          notes,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const demoOtp = res.data?.otp;
      const appointmentId = res.data?.appointmentId;

      if (demoOtp && appointmentId) {
        const input = prompt(`Enter OTP: ${demoOtp} (demo)`);
        if (!input) {
          setError("OTP entry cancelled.");
          setBookingLoading(false);
          return;
        }
        await axios.post(
          `${API_BASE}/appointments/confirm`,
          { appointmentId, otp: input },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Appointment booked successfully!");
        navigate("/dashboard");
      } else {
        alert(
          res.data?.message ||
            "Booking initiated. Please check your messages for OTP."
        );
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Booking failed:", err);
      if (err?.response?.status === 401) {
        const msg =
          err.response?.data?.message || "Unauthorized (401). Please login.";
        setError(msg + " You may need to login again.");
      } else if (!err?.response) {
        setError(
          "Network error or server unreachable. Check backend is running."
        );
      } else {
        setError(err.response?.data?.message || "Booking failed");
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const getNextDays = (n = 7) => {
    const days = [];
    for (let i = 1; i <= n; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const tokenPresent = !!getToken();

  if (loadingDoctor) return <div style={{ padding: 20 }}>Loading doctor…</div>;
  if (error)
    return (
      <div style={{ padding: 20 }}>
        <div style={{ color: "crimson", marginBottom: 8 }}>{error}</div>
        {error.toLowerCase().includes("login") && (
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              background: "#2563eb",
              color: "#fff",
              border: "none",
            }}
          >
            Go to Login
          </button>
        )}
      </div>
    );
  if (!doctor) return <div style={{ padding: 20 }}>Doctor not found.</div>;

  return (
    <div className="doctor-detail">
      <div className="container">
        <div className="doctor-header">
          <div className="doctor-avatar">{doctor.name?.charAt(0)}</div>
          <div className="doctor-info">
            <h1>{doctor.name}</h1>
            <span className="specialization">
              {doctor.specialization} · {doctor.experience}
            </span>
            <div className="doctor-stats">
              <span>&#11088; {doctor.rating ?? "4.5"}</span>
              <span>&#128101; {doctor.patients ?? 0} patients</span>
            </div>
            <p className="description" style={{ marginTop: 10 }}>
              {doctor.description}
            </p>
          </div>
        </div>

        <div className="booking-section">
          <h2>Book Consultation</h2>

          <div className="booking-form">
            <div className="form-group">
              <label>Select Date</label>
              <div className="date-picker">
                {getNextDays().map((d) => {
                  const iso = d.toISOString().split("T")[0];
                  const active = selectedDate === iso;
                  return (
                    <button
                      key={iso}
                      className={`date-btn ${active ? "active" : ""}`}
                      onClick={() => {
                        setSelectedDate(iso);
                        setSelectedSlot(null);
                        setAvailableSlots([]);
                      }}
                      type="button"
                    >
                      <span className="day">
                        {d.toLocaleDateString(undefined, { weekday: "short" })}
                      </span>
                      <span className="date">{d.getDate()}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedDate && (
              <>
                <div className="form-group">
                  <label>Available Time Slots</label>
                  <div className="time-slots">
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot) => {
                        const selected = selectedSlot?._id === slot._id;
                        return (
                          <button
                            key={slot._id}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={`time-slot ${
                              selected ? "selected" : ""
                            }`}
                          >
                            {slot.startTime} - {slot.endTime}
                          </button>
                        );
                      })
                    ) : (
                      <p>No available slots for this date.</p>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Mode</label>
                  <select
                    value={selectedMode}
                    onChange={(e) => setSelectedMode(e.target.value)}
                  >
                    {doctor.modes?.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <button
                  className="book-btn"
                  onClick={handleBooking}
                  disabled={bookingLoading || !tokenPresent}
                  type="button"
                >
                  {bookingLoading
                    ? "Processing..."
                    : !tokenPresent
                    ? "Login to Book"
                    : `Book Consultation - ₹${doctor.consultationFee ?? "—"}`}
                </button>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="error-message" role="alert">
            {error}
            {error.toLowerCase().includes("login") && (
              <div style={{ marginTop: 8 }}>
                <button onClick={() => navigate("/login")} className="view-btn">
                  Go to Login
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
