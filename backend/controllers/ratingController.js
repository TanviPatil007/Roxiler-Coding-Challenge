// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Container, Row, Col, Card } from "react-bootstrap";
// import UserNavbar from "../../components/navbar/userNavbar";
// import "../../styles/userDashboard.css";

// const UserDashboard = () => {
//   const [stores, setStores] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");

//   // Get token once at component level
//   const token = localStorage.getItem("token");

//   const bgStyle = {
//     width: "100%",
//     height: "100vh",
//     backgroundImage: "url('/images/bgImg.png')",
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     backgroundRepeat: "no-repeat",
//   };

//   // Fetch stores with average and user ratings
//   useEffect(() => {
//     const fetchStores = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/stores", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setStores(res.data);
//       } catch (err) {
//         console.error("Error fetching stores:", err);
//       }
//     };
//     fetchStores();
//   }, [token]);

//   // Filter stores by search query
//   const filteredStores = stores.filter(
//     (s) =>
//       s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       s.address.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Submit or update rating
//   const handleRatingChange = async (storeId, value) => {
//     const rating = parseInt(value); // convert string to number
//     try {
//       await axios.post(
//         "http://localhost:5000/api/ratings", // full URL ensures backend is called
//         { storeId, rating },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // Update UI instantly
//       setStores((prev) =>
//         prev.map((store) =>
//           store.id === storeId ? { ...store, userRating: rating } : store
//         )
//       );
//     } catch (err) {
//       console.error("Error submitting rating:", err);
//     }
//   };

//   return (
//     <>
//       <UserNavbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
//       <section className="mt-4">
//         <div className="mb-5" style={bgStyle}>
//           <h1 style={{ color: "white", textAlign: "center", paddingTop: "20%" }}>
//             Welcome to My Platform
//           </h1>
//         </div>
//         <Container className="mt-5">
//           <Row className="mt-5">
//             {filteredStores.map((store) => (
//               <Col key={store.id} md={4} className="mb-4">
//                 <Card className="store-card p-3 shadow-sm golden-card">
//                   <h5>{store.name}</h5>
//                   <p className="text-muted">{store.address}</p>

//                   {/* Overall Rating */}
//                   <p>⭐ Overall Rating: {store.avgRating || "No ratings yet"}</p>

//                   {/* User's Rating */}
//                   <p>
//                     Your Rating:{" "}
//                     {store.userRating ? `${store.userRating}/5` : "Not rated yet"}
//                   </p>

//                   {/* Rating Input */}
//                   <select
//                     value={store.userRating || ""}
//                     onChange={(e) =>
//                       handleRatingChange(store.id, e.target.value)
//                     }
//                     className="form-select mt-2"
//                   >
//                     <option value="">Rate this store...</option>
//                     {[1, 2, 3, 4, 5].map((r) => (
//                       <option key={r} value={r}>
//                         {r}
//                       </option>
//                     ))}
//                   </select>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//         </Container>
//       </section>
//     </>
//   );
// };

// export default UserDashboard;


// const db = require("../config/db");

// // Add or Update rating
// exports.addOrUpdateRating = async (req, res) => {
//   try {
//     const { storeId, rating } = req.body;
//     const userId = req.user.id; // extracted from authMiddleware

//     if (!storeId || !rating) {
//       return res.status(400).json({ message: "Store ID and rating are required" });
//     }

//     // Check if rating already exists for this user and store
//     const [existing] = await db.query(
//       "SELECT * FROM ratings WHERE user_id = ? AND store_id = ?",
//       [userId, storeId]
//     );

//     if (existing.length > 0) {
//       // Update existing rating
//       await db.query(
//         "UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?",
//         [rating, userId, storeId]
//       );
//     } else {
//       // Insert new rating
//       await db.query(
//         "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)",
//         [userId, storeId, rating]
//       );
//     }

//     // Optional: Update avgRating in stores table
//     const [avgResult] = await db.query(
//       "SELECT AVG(rating) as avgRating FROM ratings WHERE store_id = ?",
//       [storeId]
//     );
//     const avgRating = avgResult[0].avgRating;

//     await db.query(
//       "UPDATE stores SET avgRating = ? WHERE id = ?",
//       [avgRating, storeId]
//     );

//     res.json({ message: "Rating submitted successfully", avgRating });
//   } catch (err) {
//     console.error("Error adding/updating rating:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


const db = require("../config/db");

// Add or Update rating
exports.addOrUpdateRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id; // extracted from authMiddleware

    if (!storeId || !rating) {
      return res.status(400).json({ message: "Store ID and rating are required" });
    }

    // Check if rating already exists
    const [existing] = await db.query(
      "SELECT * FROM ratings WHERE user_id = ? AND store_id = ?",
      [userId, storeId]
    );

    if (existing.length > 0) {
      // Update existing rating
      await db.query(
        "UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?",
        [rating, userId, storeId]
      );
    } else {
      // Insert new rating
      await db.query(
        "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)",
        [userId, storeId, rating]
      );
    }

    // Calculate updated average rating for this store
    const [avgResult] = await db.query(
      "SELECT ROUND(AVG(rating), 1) as avgRating FROM ratings WHERE store_id = ?",
      [storeId]
    );
    const avgRating = avgResult[0].avgRating || 0;

    res.json({ message: "Rating submitted successfully", avgRating });
  } catch (err) {
    console.error("Error adding/updating rating:", err);
    res.status(500).json({ message: "Server error" });
  }
};
