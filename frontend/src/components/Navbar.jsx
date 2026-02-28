import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const dashboardLink =
    user?.role === "doctor" ? "/doctor-dashboard" :
    user?.role === "admin"  ? "/admin-dashboard"  :
    "/patient-dashboard";

  return (
    <nav className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">C</span>
          </div>
          <span className="text-xl font-bold text-teal-700">ClinicFlow</span>
        </Link>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link to={dashboardLink} className="text-sm text-slate-600 hover:text-teal-600 transition font-medium">
                Dashboard
              </Link>
              <Link to="/hospitals" className="text-sm text-slate-600 hover:text-teal-600 transition font-medium">
                Hospitals
              </Link>
              <div className="flex items-center gap-3 ml-2">
                <div className="w-8 h-8 bg-teal-50 rounded-full flex items-center justify-center">
                  <span className="text-teal-700 text-xs font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-slate-700 font-medium hidden md:block">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-500 hover:text-red-700 font-medium transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login"    className="text-sm border border-teal-600 text-teal-600 hover:bg-teal-50 font-medium px-4 py-2 rounded-lg transition">Login</Link>
              <Link to="/register" className="text-sm bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded-lg transition">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;