const express = require("express");
const router = express.Router();
const { registerClinic, loginDoctor, getMe, inviteMember, acceptInvite, getClinicMembers, toggleAI, removeMember } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/register", registerClinic);
router.post("/login", loginDoctor);
router.get("/me", protect, getMe);
router.get("/clinic-members", protect, getClinicMembers);
router.post("/invite", protect, inviteMember);
router.post("/accept-invite", acceptInvite);
router.put("/toggle-ai", protect, toggleAI);
router.delete("/members/:id", protect, removeMember);

module.exports = router;
