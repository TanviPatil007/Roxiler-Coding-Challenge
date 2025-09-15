// const express = require("express");
// const router = express.Router();
// const { getStoreRatings } = require("../controllers/storeOwnerController");
// const { authMiddleware } = require("../middleware/authMiddleware");

// // GET /api/store/ratings
// router.get("/ratings", authMiddleware, getStoreRatings);

// module.exports = router;


const express = require("express");
const router = express.Router();
const { getStoreRatings } = require("../controllers/storeOwnerController");
const { authMiddleware } = require("../middleware/authMiddleware");

// GET all ratings for the store owned by logged-in store owner
router.get("/ratings", authMiddleware, getStoreRatings);


module.exports = router;
