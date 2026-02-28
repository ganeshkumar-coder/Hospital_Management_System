const db = require("../config/db");

const getAllPatients = async () => {
  const [rows] = await db.query(
    "SELECT id, name, email, phone, city, role, created_at FROM patients"
  );
  return rows;
};

const getPatientById = async (id) => {
  const [rows] = await db.query(
    "SELECT id, name, email, phone, city, role, created_at FROM patients WHERE id = ?",
    [id]
  );
  return rows[0] || null;
};

module.exports = { getAllPatients, getPatientById };