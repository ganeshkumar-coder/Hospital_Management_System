const { getAllPatients, getPatientById } = require("../models/patientModel");

const getPatients = async (req, res) => {
  try {
    const data = await getAllPatients();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("getPatients:", err.message);
    return res.status(400).json({ success: false, message: "Failed to fetch patients." });
  }
};

const getPatient = async (req, res) => {
  try {
    const patient = await getPatientById(req.params.id);
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found." });
    return res.status(200).json({ success: true, data: patient });
  } catch (err) {
    console.error("getPatient:", err.message);
    return res.status(400).json({ success: false, message: "Failed to fetch patient." });
  }
};

module.exports = { getPatients, getPatient };