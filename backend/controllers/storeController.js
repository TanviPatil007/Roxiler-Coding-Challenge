const db = require("../config/db"); 

// Get all stores with average rating
exports.getAllStores = async (req, res) => {
    try {
        const userId = req.user.id; // coming from JWT middleware

        const query = `
            SELECT 
                s.id, 
                s.name, 
                s.address, 
                COALESCE(AVG(r.rating), 0) AS avgRating,
                (SELECT r2.rating 
                 FROM ratings r2 
                 WHERE r2.store_id = s.id AND r2.user_id = ?) AS userRating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            GROUP BY s.id;
        `;

        const [results] = await db.query(query, [userId]);
        res.json(results);
    } catch (err) {
        console.error("Error fetching stores:", err);
        res.status(500).json({ error: "Database error" });
    }
};

// Search stores
exports.searchStores = async (req, res) => {
    try {
        const { search } = req.query;

        const [rows] = await db.query(
            `SELECT s.id, s.name, s.address,
             ROUND(AVG(r.rating),1) AS overall_rating
             FROM stores s
             LEFT JOIN ratings r ON s.id = r.store_id
             WHERE s.name LIKE ? OR s.address LIKE ?
             GROUP BY s.id
             ORDER BY overall_rating DESC`,
            [`%${search}%`, `%${search}%`]
        );

        res.json(rows);
    } catch (error) {
        console.error("Error searching stores:", error);
        res.status(500).json({ error: "Server error while searching stores" });
    }
};


