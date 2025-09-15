// import React, { useState } from "react";
// import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const SignupPage = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [address, setAddress] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     try {
//       const res = await axios.post("http://localhost:5000/api/auth/signup", {
//         name,
//         email,
//         password,
//         address,
//       });

//       setSuccess(res.data.message);
//       setTimeout(() => navigate("/login"), 1500); // redirect after success
//     } catch (err) {
//       setError(err.response?.data?.message || "Signup failed");
//     }
//   };

//   return (
//     <Container className="d-flex justify-content-center align-items-center min-vh-100">
//       <Row>
//         <Col>
//           <Card className="p-4 shadow-lg">
//             <h2 className="text-center mb-4">Signup</h2>
//             {error && <p className="text-danger">{error}</p>}
//             {success && <p className="text-success">{success}</p>}

//             <Form onSubmit={handleSubmit}>
//               <Form.Group className="mb-3" controlId="formName">
//                 <Form.Label>Full Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder="Enter full name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3" controlId="formEmail">
//                 <Form.Label>Email address</Form.Label>
//                 <Form.Control
//                   type="email"
//                   placeholder="Enter email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3" controlId="formPassword">
//                 <Form.Label>Password</Form.Label>
//                 <Form.Control
//                   type="password"
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3" controlId="formAddress">
//                 <Form.Label>Address</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={2}
//                   placeholder="Enter address"
//                   value={address}
//                   onChange={(e) => setAddress(e.target.value)}
//                   required
//                 />
//               </Form.Group>

//               <Button variant="primary" type="submit" className="w-100">
//                 Signup
//               </Button>
//             </Form>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default SignupPage;

import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/signup.css";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
        address,
      });

      setSuccess(res.data.message);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="signup-container">
      {/* Left Side (Welcome / Login) */}
      <div className="signup-left">
        <h2>Welcome Back!</h2>
        <p>To keep connected with us please login with your personal info</p>
        <Button variant="outline-light" className="btn-login" onClick={() => navigate("/login")}>
          Login
        </Button>
      </div>

      {/* Right Side (Signup Form) */}
      <div className="signup-right">
        <h2 className="signup-title">Signup</h2>
        <div className="social-icons">
          <i className="fab fa-google"></i>
          <i className="fab fa-facebook"></i>
          <i className="fab fa-linkedin"></i>
        </div>
        <p className="small-text">or use your email for registration</p>

        {error && <p className="text-danger">{error}</p>}
        {success && <p className="text-success">{success}</p>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" className="btn-signup">
            Sign Up
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default SignupPage;