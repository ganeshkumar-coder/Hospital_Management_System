import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyAppointments } from "../../services/api";
import Navbar from "../../components/Navbar";
import Spinner from "../../components/Spinner";
import { updateAppointmentStatus } from "../../services/api";

const statusColors = {
  pending:   "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed: "bg-green-50  text-green-700  border-green-200",
  cancelled: "bg-red-50    text-red-700    border-red-200",
  completed: "bg-slate-100 text-slate-600  border-slate-200",
};

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [updating,     setUpdating]     = useState(null);

  const fetchAppointments = async () => {
    try {
      const res = await getMyAppointments();
      setAppointments(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleStatusChange = async (id, status) => {
    setUpdating(id);
    try {
      await updateAppointmentStatus(id, status);
      setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    } finally {
      setUpdating(null);
    }
  };

  const today = appointments.filter((a) => a.date === new Date().toISOString().slice(0, 10));

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10 fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-bold text-slate-900">
            Dr. {user?.name?.split(" ")[0]}'s Dashboard 🩺
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage your patient appointments</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Today",      value: today.length,                                             color: "text-teal-600" },
            { label: "Total",      value: appointments.length,                                       color: "text-slate-900" },
            { label: "Pending",    value: appointments.filter(a => a.status === "pending").length,   color: "text-yellow-600" },
            { label: "Completed",  value: appointments.filter(a => a.status === "completed").length, color: "text-slate-500" },
          ].map((s, i) => (
            <div key={i} className="card text-center">
              <p className={`text-3xl font-bold font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Appointments table */}
        <div className="card">
          <h2 className="text-lg font-bold font-bold text-slate-900 mb-5">All Appointments</h2>

          {loading && <div className="flex justify-center py-10"><Spinner size="lg" /></div>}
          {error   && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-lg">{error}</p>}

          {!loading && appointments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">🗓️</p>
              <p className="text-slate-500">No appointments scheduled yet.</p>
            </div>
          )}

          {!loading && appointments.length > 0 && (
            <div className="space-y-3">
              {appointments.map((a) => (
                <div key={a.id} className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${statusColors[a.status] || "bg-slate-50 border-slate-200"}`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900 text-sm">{a.patient_name}</p>
                      {a.is_emergency && <span className="badge bg-red-100 text-red-600 text-xs">🚨 Emergency</span>}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{a.email} · {a.phone}</p>
                    <p className="text-xs text-slate-500 mt-0.5">📅 {a.date} · ⏰ {a.start_time} – {a.end_time}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={a.status}
                      disabled={updating === a.id}
                      onChange={(e) => handleStatusChange(a.id, e.target.value)}
                      className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                    >
                      {["pending", "confirmed", "cancelled", "completed"].map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                    {updating === a.id && <Spinner size="sm" />}
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

export default DoctorDashboard;