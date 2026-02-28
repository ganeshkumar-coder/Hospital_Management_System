const { getAllHospitals, getHospitalById, getDoctorsByHospital } = require("../models/hospitalModel");

const getHospitals = async (req, res) => {
  try {
    return res.status(200).json({ success: true, data: await getAllHospitals() });
  } catch (err) {
    console.error("getHospitals:", err.message);
    return res.status(400).json({ success: false, message: "Failed to fetch hospitals." });
  }
};

const getHospital = async (req, res) => {
  try {
    const h = await getHospitalById(req.params.id);
    if (!h) return res.status(404).json({ success: false, message: "Hospital not found." });
    return res.status(200).json({ success: true, data: h });
  } catch (err) {
    console.error("getHospital:", err.message);
    return res.status(400).json({ success: false, message: "Failed to fetch hospital." });
  }
};

const getHospitalDoctors = async (req, res) => {
  try {
    return res.status(200).json({ success: true, data: await getDoctorsByHospital(req.params.id) });
  } catch (err) {
    console.error("getHospitalDoctors:", err.message);
    return res.status(400).json({ success: false, message: "Failed to fetch doctors." });
  }
};

module.exports = { getHospitals, getHospital, getHospitalDoctors };