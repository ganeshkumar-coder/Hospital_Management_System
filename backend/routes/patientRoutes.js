const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getPatients, getPatient } = require("../controllers/patientController");

router.get("/",    authMiddleware, getPatients);
router.get("/:id", authMiddleware, getPatient);

module.exports = router;