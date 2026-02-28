import { useEffect, useState } from "react";
import { getPatients, getDoctors, getHospitals, registerPatient } from "../../services/api";
import Navbar from "../../components/Navbar";
import Spinner from "../../components/Spinner";

const tabs = ["Patients", "Doctors", "Hospitals", "Add Patient"];

const AdminDashboard = () => {
  const [activeTab,  setActiveTab]  = useState("Patients");
  const [patients,   setPatients]   = useState([]);
  const [doctors,    setDoctors]    = useState([]);
  const [hospitals,  setHospitals]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState("");
  const [form,       setForm]       = useState({ name: "", email: "", password: "", phone: "", city: "" });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [p, d, h] = await Promise.all([getPatients(), getDoctors(), getHospitals()]);
        setPatients(p.data.data);
        setDoctors(d.data.data);
        setHospitals(h.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAddPatient = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setFormLoading(true);
    try {
      await registerPatient(form);
      setSuccess("Patient added successfully!");
      setForm({ name: "", email: "", password: "", phone: "", city: "" });
      const res = await getPatients();
      setPatients(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add patient.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10 fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Manage patients, doctors, and hospitals</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Patients",  value: patients.length,  icon: "🧑" },
            { label: "Total Doctors",   value: doctors.length,   icon: "👨‍⚕️" },
            { label: "Total Hospitals", value: hospitals.length, icon: "🏥" },
          ].map((s, i) => (
            <div key={i} className="card text-center">
              <p className="text-3xl mb-1">{s.icon}</p>
              <p className="text-3xl font-bold font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 w-fit">
          {tabs.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === t ? "bg-white shadow text-teal-600" : "text-slate-500 hover:text-slate-700"
              }`}>
              {t}
            </button>
          ))}
        </div>

        {error   && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-lg mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm bg-green-50 px-4 py-3 rounded-lg mb-4">{success}</p>}

        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : (
          <>
            {/* Patients tab */}
            {activeTab === "Patients" && (
              <div className="card overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-xs text-slate-400 uppercase border-b border-slate-100">
                    {["ID", "Name", "Email", "Phone", "City", "Joined"].map(h => <th key={h} className="pb-3 pr-4 font-medium">{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {patients.map((p) => (
                      <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                        <td className="py-3 pr-4 text-slate-400">#{p.id}</td>
                        <td className="py-3 pr-4 font-medium text-slate-900">{p.name}</td>
                        <td className="py-3 pr-4 text-slate-500">{p.email}</td>
                        <td className="py-3 pr-4 text-slate-500">{p.phone}</td>
                        <td className="py-3 pr-4 text-slate-500">{p.city}</td>
                        <td className="py-3 text-slate-400">{new Date(p.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {patients.length === 0 && <p className="text-center text-slate-400 py-8">No patients yet.</p>}
              </div>
            )}

            {/* Doctors tab */}
            {activeTab === "Doctors" && (
              <div className="card overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-xs text-slate-400 uppercase border-b border-slate-100">
                    {["ID", "Name", "Email", "Specialization", "Hospital", "City", "Available"].map(h => <th key={h} className="pb-3 pr-4 font-medium">{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {doctors.map((d) => (
                      <tr key={d.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                        <td className="py-3 pr-4 text-slate-400">#{d.id}</td>
                        <td className="py-3 pr-4 font-medium text-slate-900">Dr. {d.name}</td>
                        <td className="py-3 pr-4 text-slate-500">{d.email}</td>
                        <td className="py-3 pr-4 text-slate-500">{d.specialization}</td>
                        <td className="py-3 pr-4 text-slate-500">{d.hospital_name}</td>
                        <td className="py-3 pr-4 text-slate-500">{d.city}</td>
                        <td className="py-3">{d.is_available_today ? "✅" : "❌"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {doctors.length === 0 && <p className="text-center text-slate-400 py-8">No doctors yet.</p>}
              </div>
            )}

            {/* Hospitals tab */}
            {activeTab === "Hospitals" && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {hospitals.map((h) => (
                  <div key={h.id} className="card hover:shadow-md transition">
                    <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-xl mb-3">🏥</div>
                    <h3 className="font-semibold text-slate-900">{h.name}</h3>
                    <p className="text-sm text-slate-400 mt-1">📍 {h.city}</p>
                  </div>
                ))}
                {hospitals.length === 0 && <p className="text-slate-400 text-sm">No hospitals yet.</p>}
              </div>
            )}

            {/* Add Patient tab */}
            {activeTab === "Add Patient" && (
              <div className="card max-w-lg">
                <h2 className="text-lg font-bold font-bold text-slate-900 mb-5">Add New Patient</h2>
                <form onSubmit={handleAddPatient} className="space-y-4">
                  {[
                    { name: "name",     label: "Full Name", type: "text",     placeholder: "John Doe" },
                    { name: "email",    label: "Email",     type: "email",    placeholder: "john@example.com" },
                    { name: "password", label: "Password",  type: "password", placeholder: "••••••••" },
                    { name: "phone",    label: "Phone",     type: "text",     placeholder: "+91 98765 43210" },
                    { name: "city",     label: "City",      type: "text",     placeholder: "Hyderabad" },
                  ].map(({ name, label, type, placeholder }) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
                      <input name={name} type={type} required value={form[name]}
                        onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
                        className="input" placeholder={placeholder} />
                    </div>
                  ))}
                  <button type="submit" disabled={formLoading}
                    className="btn-primary w-full flex items-center justify-center gap-2">
                    {formLoading ? <><Spinner size="sm" /> Adding...</> : "Add Patient"}
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;