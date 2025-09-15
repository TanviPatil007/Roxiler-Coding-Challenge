const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { authMiddleware } = require("../middleware/authMiddleware");
const db = require("../config/db"); // your MySQL connection

// router.put("/update-password", async (req, res) => {
//     const { email, oldPassword, newPassword } = req.body;

//     if (!email || !oldPassword || !newPassword) {
//         return res.status(400).json({ message: "All fields are required" });
//     }

//     try {
//         // Fetch the student from DB
//         const [rows] = await db.promise().query("SELECT * FROM students WHERE email = ?", [email]);
//         if (rows.length === 0) return res.status(404).json({ message: "Student not found" });

//         const student = rows[0];

//         // Compare old password
//         const validPassword = await bcrypt.compare(oldPassword, student.password);
//         if (!validPassword) return res.status(401).json({ message: "Incorrect old password" });

//         // Hash new password and update
//         const hashedPassword = await bcrypt.hash(newPassword, 10);
//         await db.promise().query("UPDATE students SET password = ? WHERE email = ?", [hashedPassword, email]);

//         res.status(200).json({ message: "Password updated successfully" });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Server error" });
//     }
// });

router.put("/update-password", authMiddleware, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id; // from JWT

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Both old and new passwords are required" });
    }

    try {
        // Fetch current hashed password from DB
        const [rows] = await db.promise().query("SELECT password FROM students WHERE id = ?", [userId]);
        if (rows.length === 0) return res.status(404).json({ message: "User not found" });

        const hashedPassword = rows[0].password;

        // Compare old password
        const isMatch = await bcrypt.compare(oldPassword, hashedPassword);
        if (!isMatch) return res.status(401).json({ message: "Incorrect old password" });

        // Hash new password
        const newHashed = await bcrypt.hash(newPassword, 10);

        // Update password in DB
        await db.promise().query("UPDATE students SET password = ? WHERE id = ?", [newHashed, userId]);

        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
