import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card } from "react-bootstrap";
import UserNavbar from "../../components/navbar/userNavbar";
import Footer from "../../components/footer"
import "../../styles/userDashboard.css";

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Get token once at component level
  const token = localStorage.getItem("token");

  const bgStyle = {
    width: "100%",
    height: "100vh",
    backgroundImage: "url('/images/bgImg.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  // Fetch stores with average and user ratings
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/stores", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStores(res.data);
      } catch (err) {
        console.error("Error fetching stores:", err);
      }
    };
    fetchStores();
  }, [token]);

  // Filter stores by search query
  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Submit or update rating
//   const handleRatingChange = async (storeId, value) => {
//   const rating = parseInt(value); // convert string to number
//   try {
//     // POST request to backend to save rating
//     const res = await axios.post(
//       "http://localhost:5000/api/ratings",
//       { storeId, rating },
//       { headers: { Authorization: `Bearer ${token}` } } // include JWT token
//     );

//     // Update UI instantly
//     setStores(prev =>
//       prev.map(store =>
//         store.id === storeId
//           ? { ...store, userRating: rating, avgRating: res.data.avgRating }
//           : store
//       )
//     );
//   } catch (err) {
//     console.error("Error submitting rating:", err);
//   }
// };
const handleRatingChange = async (storeId, value) => {
  const rating = parseInt(value);
  if (!rating) return; // ignore invalid rating

  try {
    const res = await axios.post(
      "http://localhost:5000/api/ratings",
      { storeId, rating },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Update UI immediately
    setStores(prev =>
      prev.map(store =>
        store.id === storeId
          ? { ...store, userRating: rating, avgRating: res.data.avgRating }
          : store
      )
    );
  } catch (err) {
    console.error("Error submitting rating:", err);
  }
};


  return (
    <>
      <UserNavbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <section className="mt-4 mb-5">
        <div className="mb-5" style={bgStyle}>
          <h1 style={{ color: "white", textAlign: "center", paddingTop: "20%",fontWeight: 'bold', fontSize: '3rem' }}>
            Welcome to StoreFinder Platform
          </h1>
        </div>
        <Container className="mt-5">
          <Row className="mt-5">
            {filteredStores.map((store) => (
              <Col key={store.id} md={4} className="mb-4">
                <Card className="store-card p-3 shadow-sm golden-card">
                  <h5>{store.name}</h5>
                  <p className="text-muted">{store.address}</p>

                  {/* Overall Rating */}
                  <p>⭐ Overall Rating: {store.avgRating || "No ratings yet"}</p>

                  {/* User's Rating */}
                  <p>
                    Your Rating:{" "}
                    {store.userRating ? `${store.userRating}/5` : "Not rated yet"}
                  </p>

                  {/* Rating Input */}
                  <select
                    value={store.userRating || ""}
                    onChange={(e) =>
                      handleRatingChange(store.id, e.target.value)
                    }
                    className="form-select mt-2"
                  >
                    <option value="">Rate this store...</option>
                    {[1, 2, 3, 4, 5].map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      <Footer className="mt-5" />
    </>
  );
};


export default UserDashboard;
