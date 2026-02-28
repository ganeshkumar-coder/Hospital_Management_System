import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyAppointments } from "../../services/api";
import Navbar from "../../components/Navbar";
import Spinner from "../../components/Spinner";
import { Link } from "react-router-dom";

const statusColors = {
  pending:   "bg-yellow-50 text-yellow-700",
  confirmed: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
  completed: "bg-slate-100 text-slate-600",
};

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyAppointments();
        setAppointments(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = [
    { label: "Total",     value: appointments.length,                                   color: "text-slate-900" },
    { label: "Upcoming",  value: appointments.filter(a => a.status === "confirmed").length, color: "text-teal-600" },
    { label: "Pending",   value: appointments.filter(a => a.status === "pending").length,   color: "text-yellow-600" },
    { label: "Completed", value: appointments.filter(a => a.status === "completed").length, color: "text-slate-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10 fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-bold text-slate-900">
              Welcome, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-slate-500 text-sm mt-1">Here's your appointment overview</p>
          </div>
          <Link to="/hospitals" className="btn-primary text-sm">+ Book Appointment</Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="card text-center">
              <p className={`text-3xl font-bold font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Appointments */}
        <div className="card">
          <h2 className="text-lg font-bold font-bold text-slate-900 mb-5">My Appointments</h2>

          {loading && (
            <div className="flex justify-center py-10"><Spinner size="lg" /></div>
          )}

          {error && (
            <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-lg">{error}</p>
          )}

          {!loading && !error && appointments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">📅</p>
              <p className="text-slate-500">No appointments yet.</p>
              <Link to="/hospitals" className="btn-primary inline-block mt-4 text-sm">Book Your First Appointment</Link>
            </div>
          )}

          {!loading && appointments.length > 0 && (
            <div className="space-y-3">
              {appointments.map((a) => (
                <div key={a.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-teal-200 transition">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 font-semibold text-sm shrink-0">
                      {a.doctor_name?.charAt(4) || "D"}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">Dr. {a.doctor_name}</p>
                      <p className="text-xs text-slate-400">{a.specialization} · {a.hospital_name}, {a.city}</p>
                      <p className="text-xs text-slate-500 mt-1">{a.date} · {a.start_time} – {a.end_time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 sm:mt-0">
                    {a.is_emergency && (
                      <span className="badge bg-red-50 text-red-600">🚨 Emergency</span>
                    )}
                    <span className={`badge ${statusColors[a.status] || "bg-slate-100 text-slate-500"}`}>
                      {a.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;