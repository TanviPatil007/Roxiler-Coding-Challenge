const express = require("express");
const { addOrUpdateRating } = require("../controllers/ratingController");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");

// POST /api/ratings
router.post("/", authMiddleware, addOrUpdateRating);

module.exports = router;
