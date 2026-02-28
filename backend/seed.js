/**
 * seed.js — Final version matching YOUR exact tables
 * hospitals      : id, name, city
 * doctors        : id, hospital_id, name, email, password, specialization, is_available_today, role
 * patients       : id, name, email, password, phone, city, role
 * time_slots     : SKIPPED (requires availability_id from doctor_availability)
 *
 * Place in Backend/ → run: node seed.js
 */

const bcrypt = require("bcryptjs");
const mysql  = require("mysql2/promise");
require("dotenv").config();

async function seed() {
  const db = await mysql.createConnection({
    host:     process.env.DB_HOST     || "localhost",
    port:     Number(process.env.DB_PORT) || 3306,
    user:     process.env.DB_USER     || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME     || "clinic_db",
  });

  console.log("✅ Connected to MySQL\n");

  // ── 1. Hospitals (id, name, city) ─────────────────────────
  await db.query(`
    INSERT IGNORE INTO hospitals (id, name, city) VALUES
      (1, 'Osmania General Hospital', 'Hyderabad'),
      (2, 'Apollo Hospitals',         'Hyderabad'),
      (3, 'CARE Hospitals',           'Hyderabad'),
      (4, 'NIMS',                     'Hyderabad')
  `);
  console.log("✅ Hospitals inserted");

  // ── 2. Doctors ─────────────────────────────────────────────
  const docHash = await bcrypt.hash("doctor123", 10);
  await db.query(
    `INSERT IGNORE INTO doctors
       (id, hospital_id, name, email, password, specialization, is_available_today, role)
     VALUES
       (1, 1, 'Dr. Ravi Kumar',   'ravi@clinic.com',   ?, 'General Physician', 1, 'doctor'),
       (2, 2, 'Dr. Priya Sharma', 'priya@clinic.com',  ?, 'Cardiologist',      1, 'doctor'),
       (3, 3, 'Dr. Arun Patel',   'arun@clinic.com',   ?, 'Orthopedist',       0, 'doctor'),
       (4, 4, 'Dr. Sunita Rao',   'sunita@clinic.com', ?, 'Pediatrician',      1, 'doctor')`,
    [docHash, docHash, docHash, docHash]
  );
  console.log("✅ Doctors inserted");

  // ── 3. Patients ────────────────────────────────────────────
  const patHash = await bcrypt.hash("patient123", 10);
  await db.query(
    `INSERT IGNORE INTO patients
       (id, name, email, password, phone, city, role)
     VALUES
       (1, 'Ganesh Reddy', 'ganesh@gmail.com', ?, '9876543210', 'Hyderabad',    'patient'),
       (2, 'Anjali Singh', 'anjali@gmail.com', ?, '9123456780', 'Secunderabad', 'patient')`,
    [patHash, patHash]
  );
  console.log("✅ Patients inserted");

  // ── 4. Doctor Availability (if table exists) ───────────────
  const [daCheck] = await db.query(
    `SELECT TABLE_NAME FROM information_schema.TABLES
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'doctor_availability'`,
    [process.env.DB_NAME || "clinic_db"]
  );

  if (daCheck.length > 0) {
    // Detect columns of doctor_availability
    const [daCols] = await db.query(
      `SELECT COLUMN_NAME FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'doctor_availability'`,
      [process.env.DB_NAME || "clinic_db"]
    );
    const daColNames = daCols.map((c) => c.COLUMN_NAME);
    console.log("📋 doctor_availability columns:", daColNames.join(", "));

    const today    = new Date().toISOString().slice(0, 10);
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

    // Common column patterns
    const hasDocId      = daColNames.includes("doctor_id");
    const hasDate       = daColNames.includes("date");
    const hasAvailDate  = daColNames.includes("availability_date");
    const hasSlotDate   = daColNames.includes("slot_date");
    const hasStart      = daColNames.includes("start_time");
    const hasEnd        = daColNames.includes("end_time");

    const dateCol = hasDate ? "date" : hasAvailDate ? "availability_date" : hasSlotDate ? "slot_date" : null;

    if (hasDocId && dateCol && hasStart && hasEnd) {
      const [daResult1] = await db.query(
        `INSERT IGNORE INTO doctor_availability
           (doctor_id, ${dateCol}, start_time, end_time)
         VALUES (1, ?, '09:00:00', '12:00:00')`,
        [today]
      );
      const [daResult2] = await db.query(
        `INSERT IGNORE INTO doctor_availability
           (doctor_id, ${dateCol}, start_time, end_time)
         VALUES (2, ?, '10:00:00', '13:00:00')`,
        [today]
      );
      const [daResult3] = await db.query(
        `INSERT IGNORE INTO doctor_availability
           (doctor_id, ${dateCol}, start_time, end_time)
         VALUES (4, ?, '14:00:00', '17:00:00')`,
        [tomorrow]
      );
      console.log("✅ Doctor availability inserted");

      // Now insert time_slots using the availability IDs
      const avail1Id = daResult1.insertId;
      const avail2Id = daResult2.insertId;
      const avail3Id = daResult3.insertId;

      if (avail1Id) {
        await db.query(
          `INSERT IGNORE INTO time_slots (availability_id, start_time, end_time, is_booked) VALUES
             (?, '09:00:00', '09:30:00', 0),
             (?, '09:30:00', '10:00:00', 0),
             (?, '10:00:00', '10:30:00', 0),
             (?, '10:30:00', '11:00:00', 0),
             (?, '11:00:00', '11:30:00', 0),
             (?, '11:30:00', '12:00:00', 0)`,
          [avail1Id, avail1Id, avail1Id, avail1Id, avail1Id, avail1Id]
        );
      }
      if (avail2Id) {
        await db.query(
          `INSERT IGNORE INTO time_slots (availability_id, start_time, end_time, is_booked) VALUES
             (?, '10:00:00', '10:30:00', 0),
             (?, '10:30:00', '11:00:00', 0),
             (?, '11:00:00', '11:30:00', 0),
             (?, '11:30:00', '12:00:00', 0)`,
          [avail2Id, avail2Id, avail2Id, avail2Id]
        );
      }
      if (avail3Id) {
        await db.query(
          `INSERT IGNORE INTO time_slots (availability_id, start_time, end_time, is_booked) VALUES
             (?, '14:00:00', '14:30:00', 0),
             (?, '14:30:00', '15:00:00', 0),
             (?, '15:00:00', '15:30:00', 0)`,
          [avail3Id, avail3Id, avail3Id]
        );
      }
      console.log("✅ Time slots inserted");
    } else {
      console.log("⚠️  doctor_availability columns not matching expected pattern — skipping slots");
    }
  } else {
    console.log("⚠️  doctor_availability table not found — skipping availability & slots");
  }

  console.log(`
╔══════════════════════════════════════════════════════╗
║   🎉  SEED COMPLETE                                  ║
╠══════════════════════════════════════════════════════╣
║   DOCTOR LOGIN         password: doctor123           ║
║   ravi@clinic.com    ← use this to test login        ║
║   priya@clinic.com                                   ║
║   arun@clinic.com                                    ║
║   sunita@clinic.com                                  ║
╠══════════════════════════════════════════════════════╣
║   PATIENT LOGIN        password: patient123          ║
║   ganesh@gmail.com   ← use this to test login        ║
║   anjali@gmail.com                                   ║
╚══════════════════════════════════════════════════════╝
`);

  await db.end();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});