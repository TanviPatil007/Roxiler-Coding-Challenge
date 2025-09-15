const express = require("express");
const router = express.Router();
const { addUser } = require("../controllers/adminController");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");
const { getDashboardStats } = require("../controllers/adminController");
const { addStore } = require("../controllers/adminController")
const { getUsers } = require("../controllers/adminController");
const { getStores } = require("../controllers/adminController");

// Only Admin can add users
router.post("/users", authMiddleware, authorizeRoles("admin"), addUser);

router.get("/dashboard", authMiddleware, authorizeRoles("admin"), getDashboardStats);
router.post("/stores", authMiddleware, authorizeRoles("admin"), addStore);
router.get("/users", authMiddleware, authorizeRoles("admin"), getUsers);
router.get("/stores", authMiddleware, authorizeRoles("admin"), getStores);

module.exports = router;
