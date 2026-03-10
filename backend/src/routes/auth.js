const express = require("express");
const router = express.Router();
const { registerClinic, loginDoctor, getMe, inviteDoctor, acceptInvite, getClinicDoctors, toggleAI } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/register", registerClinic);
router.post("/login", loginDoctor);
router.get("/me", protect, getMe);
router.get("/clinic-doctors", protect, getClinicDoctors);
router.post("/invite", protect, inviteDoctor);
router.post("/accept-invite", acceptInvite);
router.put("/toggle-ai", protect, toggleAI);

module.exports = router;
