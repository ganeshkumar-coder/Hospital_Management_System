import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing         from "./pages/Landing";
import Login           from "./pages/auth/Login";
import Register        from "./pages/auth/Register";
import PatientDashboard from "./pages/patient/PatientDashboard";
import DoctorDashboard  from "./pages/doctor/DoctorDashboard";
import AdminDashboard   from "./pages/admin/AdminDashboard";
import Hospitals        from "./pages/Hospitals";

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"         element={<Landing />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected — Patient */}
        <Route path="/patient-dashboard" element={
          <ProtectedRoute role="patient"><PatientDashboard /></ProtectedRoute>
        } />

        {/* Protected — Doctor */}
        <Route path="/doctor-dashboard" element={
          <ProtectedRoute role="doctor"><DoctorDashboard /></ProtectedRoute>
        } />

        {/* Protected — Admin */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute><AdminDashboard /></ProtectedRoute>
        } />

        {/* Protected — Hospitals (all logged-in users) */}
        <Route path="/hospitals" element={
          <ProtectedRoute><Hospitals /></ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;