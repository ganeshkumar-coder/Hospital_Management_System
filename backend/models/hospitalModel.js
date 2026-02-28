const db = require("../config/db");

const getAllHospitals = async () => {
  const [rows] = await db.query("SELECT * FROM hospitals");
  return rows;
};

const getHospitalById = async (id) => {
  const [rows] = await db.query("SELECT * FROM hospitals WHERE id = ?", [id]);
  return rows[0] || null;
};

const getDoctorsByHospital = async (hospital_id) => {
  const [rows] = await db.query(
    `SELECT id, name, email, specialization, is_available_today, role, created_at
     FROM doctors WHERE hospital_id = ?`,
    [hospital_id]
  );
  return rows;
};

module.exports = { getAllHospitals, getHospitalById, getDoctorsByHospital };