const bcrypt = require("bcryptjs");
const { getAllDoctors, getDoctorById, getAvailableSlots, insertDoctor } = require("../models/doctorModel");

const getDoctors = async (req, res) => {
  try {
    return res.status(200).json({ success: true, data: await getAllDoctors() });
  } catch (err) {
    console.error("getDoctors:", err.message);
    return res.status(400).json({ success: false, message: "Failed to fetch doctors." });
  }
};

const getDoctor = async (req, res) => {
  try {
    const doc = await getDoctorById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: "Doctor not found." });
    return res.status(200).json({ success: true, data: doc });
  } catch (err) {
    console.error("getDoctor:", err.message);
    return res.status(400).json({ success: false, message: "Failed to fetch doctor." });
  }
};

const getSlots = async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ success: false, message: "date query param required (YYYY-MM-DD)." });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ success: false, message: "Invalid date format. Use YYYY-MM-DD." });
  try {
    const slots = await getAvailableSlots(req.params.id, date);
    return res.status(200).json({ success: true, data: slots });
  } catch (err) {
    console.error("getSlots:", err.message);
    return res.status(400).json({ success: false, message: "Failed to fetch slots." });
  }
};

const bulkSeedDoctors = async (req, res) => {
  const { doctors } = req.body;
  if (!Array.isArray(doctors) || doctors.length === 0)
    return res.status(400).json({ success: false, message: "doctors array is required." });

  const results = { inserted: [], skipped: [], errors: [] };

  for (const doc of doctors) {
    const { hospital_id, name, email, password, specialization, is_available_today } = doc;
    if (!hospital_id || !name || !email || !password || !specialization) {
      results.errors.push({ email, reason: "Missing required fields." });
      continue;
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const id = await insertDoctor({
        hospital_id, name, email, hashedPassword,
        specialization, is_available_today: is_available_today ?? true
      });
      results.inserted.push({ id, name, email });
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        results.skipped.push({ email, reason: "Email already exists." });
      } else {
        console.error("bulkSeedDoctors:", err.message);
        results.errors.push({ email, reason: err.message });
      }
    }
  }

  return res.status(201).json({
    success: true,
    message: `Inserted: ${results.inserted.length}, Skipped: ${results.skipped.length}, Errors: ${results.errors.length}`,
    results,
  });
};

module.exports = { getDoctors, getDoctor, getSlots, bulkSeedDoctors };