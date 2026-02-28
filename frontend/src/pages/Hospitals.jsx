import { useEffect, useState } from "react";
import { getHospitals, getHospitalDoctors, getDoctorSlots, bookAppointment } from "../services/api";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";

const Hospitals = () => {
  const navigate = useNavigate();
  const [hospitals,   setHospitals]   = useState([]);
  const [doctors,     setDoctors]     = useState([]);
  const [slots,       setSlots]       = useState([]);
  const [selected,    setSelected]    = useState({ hospital: null, doctor: null, slot: null });
  const [date,        setDate]        = useState(new Date().toISOString().slice(0, 10));
  const [isEmergency, setIsEmergency] = useState(false);
  const [loading,     setLoading]     = useState({ hospitals: true, doctors: false, slots: false, booking: false });
  const [error,       setError]       = useState("");
  const [success,     setSuccess]     = useState("");

  // Load hospitals
  useEffect(() => {
    (async () => {
      try {
        const res = await getHospitals();
        setHospitals(res.data.data);
      } catch { setError("Failed to load hospitals."); }
      finally { setLoading(p => ({ ...p, hospitals: false })); }
    })();
  }, []);

  // Load doctors when hospital selected
  const selectHospital = async (h) => {
    setSelected({ hospital: h, doctor: null, slot: null });
    setSlots([]);
    setLoading(p => ({ ...p, doctors: true }));
    try {
      const res = await getHospitalDoctors(h.id);
      setDoctors(res.data.data);
    } catch { setError("Failed to load doctors."); }
    finally { setLoading(p => ({ ...p, doctors: false })); }
  };

  // Load slots when doctor + date selected
  const selectDoctor = async (d) => {
    setSelected(p => ({ ...p, doctor: d, slot: null }));
    setSlots([]);
    setLoading(p => ({ ...p, slots: true }));
    try {
      const res = await getDoctorSlots(d.id, date);
      setSlots(res.data.data);
    } catch { setError("Failed to load slots."); }
    finally { setLoading(p => ({ ...p, slots: false })); }
  };

  const handleDateChange = async (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    if (selected.doctor) {
      setLoading(p => ({ ...p, slots: true }));
      try {
        const res = await getDoctorSlots(selected.doctor.id, newDate);
        setSlots(res.data.data);
      } catch { setError("Failed to load slots."); }
      finally { setLoading(p => ({ ...p, slots: false })); }
    }
  };

  const handleBook = async () => {
    if (!selected.hospital || !selected.doctor || !selected.slot) {
      setError("Please select a hospital, doctor, and time slot.");
      return;
    }
    setError(""); setSuccess("");
    setLoading(p => ({ ...p, booking: true }));
    try {
      await bookAppointment({
        doctor_id:    selected.doctor.id,
        hospital_id:  selected.hospital.id,
        time_slot_id: selected.slot.id,
        is_emergency: isEmergency,
      });
      setSuccess("Appointment booked successfully! 🎉");
      setTimeout(() => navigate("/patient-dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed.");
    } finally {
      setLoading(p => ({ ...p, booking: false }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10 fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-bold text-slate-900">Book an Appointment</h1>
          <p className="text-slate-500 text-sm mt-1">Select a hospital, doctor, and available time slot</p>
        </div>

        {error   && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-lg mb-6">{error}</p>}
        {success && <p className="text-green-600 text-sm bg-green-50 px-4 py-3 rounded-lg mb-6">{success}</p>}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Step 1 — Hospitals */}
          <div className="card">
            <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-teal-600 text-white rounded-full text-xs flex items-center justify-center">1</span>
              Choose Hospital
            </h2>
            {loading.hospitals ? <div className="flex justify-center py-6"><Spinner /></div> : (
              <div className="space-y-2">
                {hospitals.map((h) => (
                  <button key={h.id} onClick={() => selectHospital(h)}
                    className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${
                      selected.hospital?.id === h.id
                        ? "border-teal-500 bg-teal-50 text-teal-700"
                        : "border-slate-200 hover:border-teal-300 hover:bg-slate-50"
                    }`}>
                    <p className="font-medium">{h.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">📍 {h.city}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Step 2 — Doctors */}
          <div className="card">
            <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-teal-600 text-white rounded-full text-xs flex items-center justify-center">2</span>
              Choose Doctor
            </h2>
            {!selected.hospital ? (
              <p className="text-sm text-slate-400 text-center py-8">← Select a hospital first</p>
            ) : loading.doctors ? <div className="flex justify-center py-6"><Spinner /></div> : (
              <div className="space-y-2">
                {doctors.length === 0 && <p className="text-sm text-slate-400 text-center py-6">No doctors available.</p>}
                {doctors.map((d) => (
                  <button key={d.id} onClick={() => selectDoctor(d)}
                    className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${
                      selected.doctor?.id === d.id
                        ? "border-teal-500 bg-teal-50 text-teal-700"
                        : "border-slate-200 hover:border-teal-300"
                    }`}>
                    <p className="font-medium">Dr. {d.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{d.specialization}</p>
                    <span className={`text-xs mt-1 inline-block ${d.is_available_today ? "text-green-600" : "text-red-400"}`}>
                      {d.is_available_today ? "✅ Available Today" : "❌ Unavailable Today"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Step 3 — Slots */}
          <div className="card">
            <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-teal-600 text-white rounded-full text-xs flex items-center justify-center">3</span>
              Choose Slot
            </h2>
            {!selected.doctor ? (
              <p className="text-sm text-slate-400 text-center py-8">← Select a doctor first</p>
            ) : (
              <>
                <input type="date" value={date} onChange={handleDateChange}
                  min={new Date().toISOString().slice(0, 10)}
                  className="input text-sm mb-4" />
                {loading.slots ? <div className="flex justify-center py-4"><Spinner /></div> : (
                  <div className="grid grid-cols-2 gap-2">
                    {slots.length === 0 && <p className="col-span-2 text-sm text-slate-400 text-center py-4">No available slots.</p>}
                    {slots.map((s) => (
                      <button key={s.id} onClick={() => setSelected(p => ({ ...p, slot: s }))}
                        className={`p-2 rounded-lg border text-xs font-medium transition-all ${
                          selected.slot?.id === s.id
                            ? "border-teal-500 bg-teal-50 text-teal-700"
                            : "border-slate-200 hover:border-teal-300"
                        }`}>
                        {s.start_time.slice(0, 5)} – {s.end_time.slice(0, 5)}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Booking summary */}
        {selected.hospital && selected.doctor && selected.slot && (
          <div className="card mt-6 border-teal-200 bg-teal-50 fade-in">
            <h3 className="font-semibold text-teal-800 mb-3">Booking Summary</h3>
            <div className="grid sm:grid-cols-4 gap-4 text-sm text-teal-700 mb-4">
              <div><p className="text-xs text-teal-500 font-medium">Hospital</p><p>{selected.hospital.name}</p></div>
              <div><p className="text-xs text-teal-500 font-medium">Doctor</p><p>Dr. {selected.doctor.name}</p></div>
              <div><p className="text-xs text-teal-500 font-medium">Date</p><p>{date}</p></div>
              <div><p className="text-xs text-teal-500 font-medium">Time</p><p>{selected.slot.start_time.slice(0,5)} – {selected.slot.end_time.slice(0,5)}</p></div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-teal-700 cursor-pointer">
                <input type="checkbox" checked={isEmergency} onChange={(e) => setIsEmergency(e.target.checked)}
                  className="w-4 h-4 accent-teal-600" />
                🚨 Mark as Emergency
              </label>
              <button onClick={handleBook} disabled={loading.booking}
                className="ml-auto btn-primary flex items-center gap-2">
                {loading.booking ? <><Spinner size="sm" /> Booking...</> : "Confirm Appointment"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hospitals;