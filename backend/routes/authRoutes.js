// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");


router.post("/signup", signup);
router.post("/login", login);


// Test protected route (only logged-in users can access)
router.get("/me", authMiddleware, (req, res) => {
  res.json({ message: "Welcome! You are authenticated.", user: req.user });
});

// Example of role-based route (only admins)
router.get("/admin-only", authMiddleware, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin! You have access." });
});

module.exports = router;




