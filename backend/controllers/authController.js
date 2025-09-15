// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress,
} = require("../utils/validators");

exports.signup = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    // required fields
    if (!name || !email || !password || !address) {
      return res.status(400).json({ message: "All fields (name, email, password, address) are required." });
    }

    // validations
    if (!validateName(name)) {
      return res.status(400).json({ message: "Name must be between 20 and 60 characters." });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({
        message: "Password must be 8-16 characters, include at least one uppercase letter and one special character."
      });
    }
    if (!validateAddress(address)) {
      return res.status(400).json({ message: "Address must be at most 400 characters." });
    }

    // check existing email
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email.trim().toLowerCase()]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // insert user as normal 'user' role
    await pool.query(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [name.trim(), email.trim().toLowerCase(), hashed, address.trim(), "user"]
    );

    return res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error. Try again later." });
  }
};


// login


// ✅ Login (All roles: admin, user, store_owner)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    // if (!validateEmail(email)) {
    //   return res.status(400).json({ message: "Invalid email format." });
    // }

    // check if user exists
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email.trim().toLowerCase()]);
    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = users[0];

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }   // valid for 1 day
    );

    // success response
    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error. Try again later." });
  }
};
