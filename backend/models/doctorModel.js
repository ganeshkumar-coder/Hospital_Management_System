const db = require("../config/db");

const getAllDoctors = async () => {
  const [rows] = await db.query(
    `SELECT d.id, d.name, d.email, d.specialization, d.is_available_today,
            d.role, d.created_at, h.name AS hospital_name, h.city
     FROM doctors d LEFT JOIN hospitals h ON h.id = d.hospital_id`
  );
  return rows;
};

const getDoctorById = async (id) => {
  const [rows] = await db.query(
    `SELECT d.id, d.name, d.email, d.specialization, d.is_available_today,
            d.role, d.created_at, h.name AS hospital_name, h.city
     FROM doctors d LEFT JOIN hospitals h ON h.id = d.hospital_id
     WHERE d.id = ?`,
    [id]
  );
  return rows[0] || null;
};

const getAvailableSlots = async (doctor_id, date) => {
  const [rows] = await db.query(
    `SELECT ts.id, ts.start_time, ts.end_time, ts.is_booked
     FROM time_slots ts
     JOIN doctor_availability da ON da.id = ts.availability_id
     WHERE da.doctor_id = ? AND da.date = ? AND ts.is_booked = false`,
    [doctor_id, date]
  );
  return rows;
};

module.exports = { getAllDoctors, getDoctorById, getAvailableSlots };

const insertDoctor = async ({ hospital_id, name, email, hashedPassword, specialization, is_available_today }) => {
  const [result] = await db.query(
    `INSERT INTO doctors (hospital_id, name, email, password, specialization, is_available_today, role, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 'doctor', NOW())`,
    [hospital_id, name, email, hashedPassword, specialization, is_available_today]
  );
  return result.insertId;
};

module.exports = { getAllDoctors, getDoctorById, getAvailableSlots, insertDoctor };