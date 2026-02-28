const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const { findPatientByEmail, createPatient, findDoctorByEmail } = require("../models/authModel");

const register = async (req, res) => {
  const { name, email, password, phone, city } = req.body;
  if (!name || !email || !password || !phone || !city)
    return res.status(400).json({ success: false, message: "All fields are required." });
  try {
    if (await findPatientByEmail(email))
      return res.status(400).json({ success: false, message: "Email already registered." });
    const hashedPassword = await bcrypt.hash(password, 10);
    const patient_id = await createPatient({ name, email, hashedPassword, phone, city });
    return res.status(201).json({ success: true, message: "Registered successfully.", patient_id });
  } catch (err) {
    console.error("register:", err.message);
    return res.status(400).json({ success: false, message: "Registration failed." });
  }
};

const login = async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role)
    return res.status(400).json({ success: false, message: "email, password and role are required." });
  try {
    const user = role === "patient" ? await findPatientByEmail(email)
               : role === "doctor"  ? await findDoctorByEmail(email)
               : null;
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials." });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ success: false, message: "Invalid credentials." });
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    return res.status(200).json({
      success: true, token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("login:", err.message);
    return res.status(400).json({ success: false, message: "Login failed." });
  }
};

module.exports = { register, login };