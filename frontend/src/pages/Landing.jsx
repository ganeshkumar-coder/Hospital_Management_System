import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const features = [
  { icon: "🏥", title: "Multi-Hospital Support", desc: "Manage appointments across multiple hospitals from one place." },
  { icon: "👨‍⚕️", title: "Doctor Availability",   desc: "Real-time slot booking based on doctor schedules." },
  { icon: "📋", title: "Patient Records",         desc: "Secure patient profiles and appointment history." },
  { icon: "🚨", title: "Emergency Booking",       desc: "Priority slots for emergency cases." },
];

const Landing = () => (
  <div className="min-h-screen bg-slate-50">
    <Navbar />

    {/* Hero */}
    <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 fade-in">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="badge bg-teal-50 text-teal-700 mb-4">Healthcare Management</span>
          <h1 className="text-5xl font-bold font-bold text-slate-900 leading-tight mb-6">
            Clinic Management, <span className="text-teal-600">Simplified.</span>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed mb-8">
            Book appointments, manage doctors, and streamline patient care — all in one elegant platform built for modern clinics.
          </p>
          <div className="flex gap-4">
            <Link to="/register" className="btn-primary">Get Started</Link>
            <Link to="/login"    className="btn-outline">Login</Link>
          </div>
        </div>

        {/* Visual card */}
        <div className="relative hidden md:block">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-teal-50 rounded-3xl" />
          <div className="relative card shadow-lg border-0 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white text-lg">🏥</div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">City General Hospital</p>
                <p className="text-xs text-slate-400">Hyderabad</p>
              </div>
              <span className="ml-auto badge bg-green-50 text-green-600">Open</span>
            </div>
            {["Dr. Aisha Rahman – Cardiology", "Dr. Ravi Kumar – Orthopedics", "Dr. Priya Mehta – Pediatrics"].map((d, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600">
                  {d.charAt(4)}
                </div>
                <span className="text-sm text-slate-600">{d}</span>
                <span className="ml-auto text-xs text-teal-600 font-medium">Available</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold font-bold text-slate-900 text-center mb-12">Everything You Need</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="card hover:shadow-md transition-shadow duration-200 text-center">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-slate-900 text-base mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="text-center py-8 text-sm text-slate-400 border-t border-slate-100">
      © 2026 ClinicFlow · Built for Hackathon 2026
    </footer>
  </div>
);

export default Landing;