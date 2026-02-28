const express  = require("express");
const router   = express.Router();
const auth     = require("../middleware/authMiddleware");
const { getHospitals, getHospital, getHospitalDoctors } = require("../controllers/hospitalController");

// PUBLIC — no token needed to browse hospitals and doctors
router.get("/",            getHospitals);
router.get("/:id",         getHospital);
router.get("/:id/doctors", getHospitalDoctors);

module.exports = router;