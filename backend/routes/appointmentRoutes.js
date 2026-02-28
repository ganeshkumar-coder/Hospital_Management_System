const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getMyAppointments, createAppointment, patchStatus } = require("../controllers/appointmentController");

router.get("/my",           authMiddleware, getMyAppointments);
router.post("/book",        authMiddleware, createAppointment);
router.patch("/:id/status", authMiddleware, patchStatus);

module.exports = router;