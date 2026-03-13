const express = require("express");
const router = express.Router();
const { registerClinic, loginDoctor, getMe, inviteMember, acceptInvite, getClinicMembers, toggleAI, removeMember, getSystemStatus, updateUser, updateClinicDetails } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.get("/status", getSystemStatus);
router.post("/register", registerClinic);
router.post("/login", loginDoctor);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateUser);
router.put("/clinic", protect, updateClinicDetails);
router.get("/clinic-members", protect, getClinicMembers);
router.post("/invite", protect, inviteMember);
router.post("/accept-invite", acceptInvite);
router.put("/toggle-ai", protect, toggleAI);
router.delete("/members/:id", protect, removeMember);

module.exports = router;
