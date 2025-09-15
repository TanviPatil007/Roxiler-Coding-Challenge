const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress
} = require("../utils/validators");
const db = require("../config/db");

// ✅ Add User (by Admin)
exports.addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // required fields
    if (!name || !email || !password || !address || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // validations
    if (!validateName(name)) {
      return res.status(400).json({ message: "Name must be 20–60 characters long." });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({
        message: "Password must be 8–16 chars, include at least one uppercase & one special character."
      });
    }
    if (!validateAddress(address)) {
      return res.status(400).json({ message: "Address cannot exceed 400 characters." });
    }
    if (!["admin", "user", "store_owner"].includes(role)) {
      return res.status(400).json({ message: "Invalid role provided." });
    }

    // check if email already exists
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email.trim().toLowerCase()]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert user
    await pool.query(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [name.trim(), email.trim().toLowerCase(), hashedPassword, address.trim(), role]
    );

    return res.status(201).json({ message: "User created successfully." });
  } catch (err) {
    console.error("Add User error:", err);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};


// Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const [[usersCount]] = await pool.query("SELECT COUNT(*) AS totalUsers FROM users");
    const [[storesCount]] = await pool.query("SELECT COUNT(*) AS totalStores FROM stores");
    const [[ratingsCount]] = await pool.query("SELECT COUNT(*) AS totalRatings FROM ratings");

    // console.log("Users:", usersCount);
    // console.log("Stores:", storesCount);
    // console.log("Ratings:", ratingsCount);

    return res.json({
      totalUsers: usersCount.totalUsers,
      totalStores: storesCount.totalStores,
      totalRatings: ratingsCount.totalRatings,
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    return res.status(500).json({ message: "Server error fetching dashboard stats." });
  }
};

// Add Store (by Admin)
// exports.addStore = async (req, res) => {
//     try {
//         const { name, email, address, owner_id } = req.body;

//         if (!name || !address) {
//             return res.status(400).json({ message: "Name and address are required." });
//         }

//         // Optional: check if store email already exists
//         if (email) {
//             const [existing] = await pool.query("SELECT * FROM stores WHERE email = ?", [email]);
//             if (existing.length > 0) {
//                 return res.status(400).json({ message: "Store with this email already exists." });
//             }
//         }

//         // Insert store
//         const [result] = await pool.query(
//             "INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)",
//             [name, email || null, address, owner_id || null]
//         );

//         res.status(201).json({
//             message: "Store added successfully",
//             store: { id: result.insertId, name, email, address, owner_id }
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Server error" });
//     }
// };
exports.addStore = async (req, res) => {
  try {
    const { name, ownerEmail, address } = req.body;

    // ✅ Validate input
    if (!name || !ownerEmail || !address) {
      return res.status(400).json({ message: "Name, owner email, and address are required." });
    }

    console.log("Owner Email from request:", ownerEmail);

    // 1️⃣ Find the store owner by email
    const [ownerRows] = await db.query(
      "SELECT id FROM users WHERE email = ? AND role = 'store_owner'",
      [ownerEmail.trim()]
    );

    if (ownerRows.length === 0) {
      return res.status(400).json({ message: "No store owner found with this email" });
    }

    const ownerId = ownerRows[0].id;

    // 2️⃣ Optional: check if store email already exists
    const [existingStore] = await db.query(
      "SELECT id FROM stores WHERE email = ?",
      [ownerEmail.trim()]
    );

    if (existingStore.length > 0) {
      return res.status(400).json({ message: "A store with this email already exists." });
    }

    // 3️⃣ Insert the new store
    const [insertResult] = await db.query(
      "INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)",
      [name.trim(), ownerEmail.trim(), address.trim(), ownerId]
    );

    // 4️⃣ Send response with new store ID
    res.status(201).json({
      message: "Store added successfully!",
      storeId: insertResult.insertId
    });

  } catch (err) {
    console.error("Error adding store:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch all normal, admin, and store owner users with rating for store owners
exports.getUsers = async (req, res) => {
  try {
    const [users] = await pool.query(`
            SELECT 
                u.id, 
                u.name, 
                u.email, 
                u.address, 
                u.role,
                IF(u.role = 'store_owner', 
                   IFNULL(ROUND(AVG(r.rating), 1), '-'), 
                   '-') AS rating
            FROM users u
            LEFT JOIN stores s ON u.id = s.owner_id
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE u.role IN ('user', 'admin', 'store_owner')
            GROUP BY u.id
        `);

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/adminController.js
// exports.getUsers = async (req, res) => {
//   try {
//     const { name, email, address, role } = req.query;

//     let query = `
//       SELECT id, name, email, address, role, created_at
//       FROM users
//       WHERE 1=1
//     `;
//     const params = [];

//     if (name) {
//       query += " AND name LIKE ?";
//       params.push(`%${name}%`);
//     }
//     if (email) {
//       query += " AND email LIKE ?";
//       params.push(`%${email}%`);
//     }
//     if (address) {
//       query += " AND address LIKE ?";
//       params.push(`%${address}%`);
//     }
//     if (role) {
//       query += " AND role = ?";
//       params.push(role);
//     }

//     const [rows] = await pool.query(query, params);
//     res.json(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


//getting all stores
exports.getStores = async (req, res) => {
  try {
    const [stores] = await pool.query(`
            SELECT 
                s.id, 
                s.name, 
                s.email, 
                s.address, 
                IFNULL(ROUND(AVG(r.rating), 1), '-') AS rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            GROUP BY s.id
        `);

    res.status(200).json(stores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};




