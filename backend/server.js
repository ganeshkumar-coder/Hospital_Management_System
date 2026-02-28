require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const app     = express();

// ─── CORS — allow frontend origin ─────────────────────────────
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// ─── DB ───────────────────────────────────────────────────────
const db = require("./config/db");

// ─── ROUTES ───────────────────────────────────────────────────
app.use("/api/auth",         require("./routes/authRoutes"));
app.use("/api/patients",     require("./routes/patientRoutes"));
app.use("/api/doctors",      require("./routes/doctorRoutes"));
app.use("/api/hospitals",    require("./routes/hospitalRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));

// ─── HEALTH CHECK ─────────────────────────────────────────────
app.get("/", async (_req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ success: true, message: "✅ API running & DB connected." });
  } catch (err) {
    res.status(500).json({ success: false, message: "❌ DB not connected.", error: err.message });
  }
});

// ─── 404 ──────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ success: false, message: "Route not found." }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend  → http://localhost:${PORT}`);
  console.log(`🌐 Frontend → http://localhost:5173`);
  console.log(`🔗 CORS     → enabled for http://localhost:5173`);
});