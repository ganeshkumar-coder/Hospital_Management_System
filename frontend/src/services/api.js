import axios from "axios";

const API = axios.create({ baseURL: "/api" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// AUTH
export const registerPatient = (data) => API.post("/auth/register", data);
export const loginUser       = (data) => API.post("/auth/login", data);

// PATIENTS
export const getPatients    = ()   => API.get("/patients");
export const getPatientById = (id) => API.get(`/patients/${id}`);

// DOCTORS
export const getDoctors     = ()         => API.get("/doctors");
export const getDoctorById  = (id)       => API.get(`/doctors/${id}`);
export const getDoctorSlots = (id, date) => API.get(`/doctors/${id}/slots?date=${date}`);

// HOSPITALS
export const getHospitals       = ()   => API.get("/hospitals");
export const getHospitalById    = (id) => API.get(`/hospitals/${id}`);
export const getHospitalDoctors = (id) => API.get(`/hospitals/${id}/doctors`);

// APPOINTMENTS
export const getMyAppointments       = ()           => API.get("/appointments/my");
export const bookAppointment         = (data)       => API.post("/appointments/book", data);
export const updateAppointmentStatus = (id, status) => API.patch(`/appointments/${id}/status`, { status });