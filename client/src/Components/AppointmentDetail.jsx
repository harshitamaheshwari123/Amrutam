import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const AppointmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem("token") || null;

  useEffect(() => {
    const fetchAppointment = async () => {
      const token = getToken();
        if (!token) return navigate("/login");
        console.log("Fetching appointment ID:", id);
      try {
        const res = await axios.get(`${API_BASE}/appointments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Appointment details:", res.data);
        setAppointment(res.data);
      } catch (err) {
        console.error(err);
         alert(
           err.response?.data?.message || "Failed to fetch appointment details."
         );
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [id, navigate]);

  if (loading) return <p>Loading appointment details...</p>;
  if (!appointment) return <p>Appointment not found</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Appointment Details</h2>
      <p>
        <strong>Doctor:</strong> {appointment.doctorId?.name}
      </p>
      <p>
        <strong>Specialization:</strong> {appointment.doctorId?.specialization}
      </p>
      <p>
        <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}
      </p>
      <p>
        <strong>Time:</strong> {appointment.startTime}
      </p>
      <p>
        <strong>Status:</strong> {appointment.status}
      </p>
      <p>
        <strong>Mode:</strong> {appointment.mode}
      </p>
      <p>
        <strong>Notes:</strong> {appointment.notes || "-"}
      </p>
      <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
    </div>
  );
};

export default AppointmentDetail;
