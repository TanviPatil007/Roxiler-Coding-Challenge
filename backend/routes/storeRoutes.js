// const express = require("express");
// const router = express.Router();
// const { getAllStores, searchStores } = require("../controllers/storeController");
// const { addOrUpdateRating } = require("../controllers/ratingController");
// const { authMiddleware } = require("../middleware/authMiddleware"); 

// // GET all stores with average rating
// router.get("/", authMiddleware, getAllStores);

// // Get ratings for a specific store
// router.get("/:id/ratings", authMiddleware, getStoreRatings);

// // Submit or update rating
// router.post("/:id/rating", authMiddleware, addOrUpdateRating);

// // Search stores
// router.get("/search", searchStores);

// module.exports = router;

const express = require("express");
const router = express.Router();
const { getAllStores, searchStores } = require("../controllers/storeController");
const { addOrUpdateRating } = require("../controllers/ratingController");
const { authMiddleware } = require("../middleware/authMiddleware");

// GET all stores with average rating
router.get("/", authMiddleware, getAllStores);

// Search stores
router.get("/search", authMiddleware, searchStores);

// Submit or update rating for a store
router.post("/:id/rating", authMiddleware, addOrUpdateRating);

module.exports = router;
