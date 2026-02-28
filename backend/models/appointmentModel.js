const db = require("../config/db");

const getByPatient = async (patient_id) => {
  const [rows] = await db.query(
    `SELECT a.id, a.is_emergency, a.status, a.created_at,
            d.name AS doctor_name, d.specialization,
            h.name AS hospital_name, h.city,
            ts.start_time, ts.end_time, da.date
     FROM appointments a
     JOIN doctors d              ON d.id  = a.doctor_id
     JOIN hospitals h            ON h.id  = a.hospital_id
     JOIN time_slots ts          ON ts.id = a.time_slot_id
     JOIN doctor_availability da ON da.id = ts.availability_id
     WHERE a.patient_id = ? ORDER BY a.created_at DESC`,
    [patient_id]
  );
  return rows;
};

const getByDoctor = async (doctor_id) => {
  const [rows] = await db.query(
    `SELECT a.id, a.is_emergency, a.status, a.created_at,
            p.name AS patient_name, p.phone, p.email,
            ts.start_time, ts.end_time, da.date
     FROM appointments a
     JOIN patients p             ON p.id  = a.patient_id
     JOIN time_slots ts          ON ts.id = a.time_slot_id
     JOIN doctor_availability da ON da.id = ts.availability_id
     WHERE a.doctor_id = ? ORDER BY da.date ASC, ts.start_time ASC`,
    [doctor_id]
  );
  return rows;
};

const book = async (conn, { patient_id, doctor_id, hospital_id, time_slot_id, is_emergency }) => {
  const [slot] = await conn.query(
    "SELECT * FROM time_slots WHERE id = ? FOR UPDATE", [time_slot_id]
  );
  if (!slot.length)      throw { status: 400, message: "Time slot not found." };
  if (slot[0].is_booked) throw { status: 400, message: "Time slot is already booked." };

  const [avail] = await conn.query(
    `SELECT da.id FROM doctor_availability da
     JOIN time_slots ts ON ts.availability_id = da.id
     WHERE ts.id = ? AND da.doctor_id = ?`,
    [time_slot_id, doctor_id]
  );
  if (!avail.length) throw { status: 400, message: "Doctor is not available for this slot." };

  const [result] = await conn.query(
    `INSERT INTO appointments (patient_id, doctor_id, hospital_id, time_slot_id, is_emergency, status, created_at)
     VALUES (?, ?, ?, ?, ?, 'pending', NOW())`,
    [patient_id, doctor_id, hospital_id, time_slot_id, is_emergency ?? false]
  );

  await conn.query("UPDATE time_slots SET is_booked = true WHERE id = ?", [time_slot_id]);
  return result.insertId;
};

const updateStatus = async (id, status) => {
  const [result] = await db.query(
    "UPDATE appointments SET status = ? WHERE id = ?", [status, id]
  );
  return result.affectedRows;
};

module.exports = { getByPatient, getByDoctor, book, updateStatus };