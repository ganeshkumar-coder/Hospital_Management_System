const db = require("../config/db");

const findPatientByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM patients WHERE email = ?", [email]);
  return rows[0] || null;
};

const findDoctorByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM doctors WHERE email = ?", [email]);
  return rows[0] || null;
};

const createPatient = async ({ name, email, hashedPassword, phone, city }) => {
  const [result] = await db.query(
    `INSERT INTO patients (name, email, password, phone, city, role, created_at)
     VALUES (?, ?, ?, ?, ?, 'patient', NOW())`,
    [name, email, hashedPassword, phone, city]
  );
  return result.insertId;
};

module.exports = { findPatientByEmail, findDoctorByEmail, createPatient };