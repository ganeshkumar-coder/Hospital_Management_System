const express = require("express");
const router  = express.Router();
const auth    = require("../middleware/authMiddleware");
const { getDoctors, getDoctor, getSlots, bulkSeedDoctors } = require("../controllers/doctorController");

// PUBLIC
router.get("/",           getDoctors);
router.get("/:id",        getDoctor);
router.get("/:id/slots",  getSlots);

// SEED — hackathon only, no auth needed
router.post("/seed", bulkSeedDoctors);

module.exports = router;