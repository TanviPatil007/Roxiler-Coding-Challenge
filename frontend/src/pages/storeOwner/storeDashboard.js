// import React, { useEffect, useState } from "react";
// import { Container, Row, Col, Card, Table, Button, Dropdown, Form, Image } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "../../styles/admin.css"; // reuse same theme

// const StoreOwnerDashboard = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const [storeData, setStoreData] = useState({
//     avgRating: 0,
//     ratings: [] // { userName, userEmail, rating, date }
//   });

//   const [showPasswordForm, setShowPasswordForm] = useState(false);
//   const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
//   const [message, setMessage] = useState("");

//   // Fetch ratings for this store
//   useEffect(() => {
//     const fetchRatings = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/storeOwner/ratings", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setStoreData({
//           avgRating: res.data.store.avgRating,
//           ratings: res.data.ratings,
//         });
//       } catch (err) {
//         console.error("Error fetching store ratings:", err);
//       }
//     };
//     fetchRatings();
//   }, [token]);

//   // Handle password form change
//   const handlePasswordChange = (e) => {
//     setPasswords({ ...passwords, [e.target.name]: e.target.value });
//   };

//   // Update password
//   const handleUpdatePassword = async () => {
//     setMessage("");
//     if (passwords.newPassword !== passwords.confirmPassword) {
//       setMessage("New passwords do not match");
//       return;
//     }
//     try {
//       const res = await axios.put(
//         "http://localhost:5000/api/store/update-password",
//         passwords,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setMessage(res.data.message);
//       setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
//       setShowPasswordForm(false);
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Error updating password");
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <Container fluid className="min-vh-100">
//       <Row>
//         {/* Sidebar */}
//         <Col md={2} className="sidebar-dark text-white p-3">
//           <div className="text-center mb-4">
//             <h5>Store Owner</h5>
//           </div>
//           <Dropdown className="mb-4 text-center">
//             <Dropdown.Toggle variant="light" id="dropdown-basic">
//               <Image src="/images/profile.png" roundedCircle width={50} />
//             </Dropdown.Toggle>
//             <Dropdown.Menu>
//               <Dropdown.Item onClick={() => setShowPasswordForm(!showPasswordForm)}>
//                 Update Password
//               </Dropdown.Item>
//               <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
//             </Dropdown.Menu>
//           </Dropdown>
//         </Col>

//         {/* Store Average Rating */}
//         <Card className="p-3 golden-card mb-4 text-center">
//           <h5>Average Rating</h5>
//           <h2>{storeData.avgRating || "No ratings yet"}</h2>
//         </Card>

//         {/* Users Ratings Table */}
//         <Card className="p-3 golden-card">
//           <h5 className="mb-3">Users Who Rated Your Store</h5>
//           <Table striped bordered hover responsive>
//             <thead>
//               <tr>
//                 <th>User Name</th>
//                 <th>Email</th>
//                 <th>Rating</th>
//                 <th>Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {storeData.ratings.length > 0 ? (
//                 storeData.ratings.map((r, index) => (
//                   <tr key={index}>
//                     <td>{r.userName}</td>
//                     <td>{r.userEmail}</td>
//                     <td>{r.rating}</td>
//                     <td>{new Date(r.date).toLocaleString()}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={4} className="text-center">No ratings yet</td>
//                 </tr>
//               )}
//             </tbody>
//           </Table>
//         </Card>
//       </Col>
//     </Row>
//     </Container >
//   );
// };

// export default StoreOwnerDashboard;


import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Table, Button, Dropdown, Form, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/admin.css"; 
import UpdatePasswordModal from "../../components/updatePasswordmodal";


const StoreOwnerDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [storeData, setStoreData] = useState({
    avgRating: 0,
    ratings: [] // { userName, userEmail, rating, date }
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState("");

  // Fetch ratings for this store
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/storeOwner/ratings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStoreData({
          avgRating: res.data.store.avgRating,
          ratings: res.data.ratings,
        });
      } catch (err) {
        console.error("Error fetching store ratings:", err);
      }
    };
    fetchRatings();
  }, [token]);

  // Handle password form change
  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // Update password
  const handleUpdatePassword = async () => {
    setMessage("");
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage("New passwords do not match");
      return;
    }
    try {
      const res = await axios.put(
        "http://localhost:5000/api/store/update-password",
        passwords,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordForm(false);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error updating password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Container fluid className="min-vh-100">
      <Row>
        {/* Sidebar */}
        <Col md={2} className="sidebar-dark text-white p-3">
          <div className="text-center mb-4">
            <h5>Store Owner</h5>
          </div>
          <Dropdown className="mb-4 text-center">
            <Dropdown.Toggle variant="light" id="dropdown-basic">
              <Image src="/images/profile.png" roundedCircle width={50} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setIsModalOpen(true)}>Update Password</Dropdown.Item>
              <UpdatePasswordModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              />
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>

        {/* Main Content */}
        <Col md={10} className="p-4 bg-light">
          {/* Store Average Rating */}
          <Card className="p-3 golden-card mb-4 text-center">
            <h5>Average Rating</h5>
            <h2>{storeData.avgRating || "No ratings yet"}</h2>
          </Card>

          {/* Users Ratings Table */}
          <Card className="p-3 golden-card">
            <h5 className="mb-3">Users Who Rated Your Store</h5>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Rating</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {storeData.ratings.length > 0 ? (
                  storeData.ratings.map((r, index) => (
                    <tr key={index}>
                      <td>{r.userName}</td>
                      <td>{r.userEmail}</td>
                      <td>{r.rating}</td>
                      <td>{new Date(r.date).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center">No ratings yet</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StoreOwnerDashboard;
