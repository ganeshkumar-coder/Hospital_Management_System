import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerPatient } from "../../services/api";
import Spinner from "../../components/Spinner";

const Register = () => {
  const navigate  = useNavigate();
  const [form,    setForm]    = useState({ name: "", email: "", password: "", phone: "", city: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerPatient(form);
      navigate("/login", { state: { message: "Registered! Please login." } });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name",     label: "Full Name",  type: "text",     placeholder: "John Doe" },
    { name: "email",    label: "Email",      type: "email",    placeholder: "you@example.com" },
    { name: "password", label: "Password",   type: "password", placeholder: "••••••••" },
    { name: "phone",    label: "Phone",      type: "text",     placeholder: "+91 98765 43210" },
    { name: "city",     label: "City",       type: "text",     placeholder: "Hyderabad" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md fade-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 justify-center">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="font-display text-2xl font-bold text-navy">ClinicFlow</span>
          </Link>
          <p className="text-slate-500 text-sm mt-2">Create your patient account</p>
        </div>

        <div className="card shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
                <input name={name} type={type} required value={form[name]}
                  onChange={handleChange} className="input" placeholder={placeholder} />
              </div>
            ))}

            {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {loading ? <><Spinner size="sm" /> Creating account...</> : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-teal-600 font-medium hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;