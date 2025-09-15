const db = require("../config/db");

// Get store ratings for logged-in store owner
exports.getStoreRatings = async (req, res) => {
    try {
        const ownerId = req.user.id; // coming from authMiddleware
        console.log("Logged-in ownerId:", ownerId);

        // 1️⃣ Get the store owned by this user
        const [storeResult] = await db.query(
            "SELECT id, name FROM stores WHERE owner_id = ?",
            [ownerId]
        );
        console.log("Store Result:", storeResult);

        if (storeResult.length === 0) {
            return res.status(404).json({ message: "No store found for this owner." });
        }

        const store = storeResult[0];

        // 2️⃣ Get all user ratings for this store
        const [ratings] = await db.query(
            `SELECT u.name AS userName, u.email AS userEmail, r.rating, r.created_at AS date
   FROM ratings r
   JOIN users u ON r.user_id = u.id
   WHERE r.store_id = ?`,
            [store.id]
        );

        // 3️⃣ Calculate average rating for this store
        const [avgResult] = await db.query(
            "SELECT ROUND(AVG(rating), 1) AS avgRating FROM ratings WHERE store_id = ?",
            [store.id]
        );
        const avgRating = avgResult[0].avgRating || 0;

        // 4️⃣ Send response
        res.json({
            store: { ...store, avgRating },
            ratings
        });

    } catch (err) {
        console.error("Error fetching store ratings:", err);
        res.status(500).json({ message: "Server error" });
    }
};
