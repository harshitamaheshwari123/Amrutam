import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Components/Home";
import AboutPage from "./Components/About";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Dashboard from "./Components/Dashboard";
import DoctorDetail from "./Components/DoctorDetail";
import AppointmentDetail from "./Components/AppointmentDetail";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/appointment/:id" element={<AppointmentDetail />} />
        <Route path="/doctor/:id" element={<DoctorDetail />} />
      </Routes>
    </Router>
  );
}
