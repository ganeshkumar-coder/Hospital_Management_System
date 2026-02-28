const db = require("../config/db");
const { getByPatient, getByDoctor, book, updateStatus } = require("../models/appointmentModel");

const getMyAppointments = async (req, res) => {
  const { id, role } = req.user;
  try {
    const data = role === "patient" ? await getByPatient(id)
               : role === "doctor"  ? await getByDoctor(id)
               : null;
    if (!data) return res.status(400).json({ success: false, message: "Invalid role." });
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("getMyAppointments:", err.message);
    return res.status(400).json({ success: false, message: "Failed to fetch appointments." });
  }
};

const createAppointment = async (req, res) => {
  const patient_id = req.user.id;
  const { doctor_id, hospital_id, time_slot_id, is_emergency } = req.body;
  if (!doctor_id || !hospital_id || !time_slot_id)
    return res.status(400).json({ success: false, message: "doctor_id, hospital_id, and time_slot_id are required." });
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const appointment_id = await book(conn, { patient_id, doctor_id, hospital_id, time_slot_id, is_emergency });
    await conn.commit();
    return res.status(201).json({ success: true, message: "Appointment booked successfully.", appointment_id });
  } catch (err) {
    await conn.rollback();
    console.error("createAppointment:", err.message || err);
    return res.status(err.status || 400).json({ success: false, message: err.message || "Booking failed." });
  } finally {
    conn.release();
  }
};

const patchStatus = async (req, res) => {
  const valid = ["pending", "confirmed", "cancelled", "completed"];
  const { status } = req.body;
  if (!valid.includes(status))
    return res.status(400).json({ success: false, message: `status must be one of: ${valid.join(", ")}` });
  try {
    const affected = await updateStatus(req.params.id, status);
    if (!affected) return res.status(404).json({ success: false, message: "Appointment not found." });
    return res.status(200).json({ success: true, message: "Status updated." });
  } catch (err) {
    console.error("patchStatus:", err.message);
    return res.status(400).json({ success: false, message: "Failed to update status." });
  }
};

module.exports = { getMyAppointments, createAppointment, patchStatus };