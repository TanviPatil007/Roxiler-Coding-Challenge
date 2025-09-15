// import React, { useState } from "react";
// import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const LoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const res = await axios.post("http://localhost:5000/api/auth/login", {
//         email,
//         password,
//       });

//       const { token, user } = res.data;
//       localStorage.setItem("token", token);
//       localStorage.setItem("role", user.role);

//       // redirect based on role
//       if (user.role === "admin") {
//         navigate("/admin/dashboard");
//       } else if (user.role === "store_owner") {
//         navigate("/store/dashboard");
//       } else {
//         navigate("/dashboard");
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <Container className="d-flex justify-content-center align-items-center min-vh-100">
//       <Row>
//         <Col>
//           <Card className="p-4 shadow-lg">
//             <h2 className="text-center mb-4">Login</h2>
//             {error && <p className="text-danger">{error}</p>}
//             <Form onSubmit={handleSubmit}>
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

//               <Button variant="primary" type="submit" className="w-100">
//                 Login
//               </Button>
//             </Form>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default LoginPage;

import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
 

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "store_owner") {
        navigate("/store/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      {/* Left Side (Login Form) */}
      <div className="login-left">
        <h2 className="login-title">Login</h2>
        <div className="social-icons">
          <i className="fab fa-google"></i>
          <i className="fab fa-facebook"></i>
          <i className="fab fa-linkedin"></i>
        </div>
        <p className="small-text">or use your email account</p>

        {error && <p className="text-danger">{error}</p>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              placeholder="Email"
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

          <p className="forgot-password">Forgot your password?</p>

          <Button type="submit" className="btn-login">
            Sign In
          </Button>
        </Form>
      </div>

      {/* Right Side (Welcome / Signup) */}
      <div className="login-right">
        <h2>Hello, Friend!</h2>
        <p>Enter your personal details to start your journey</p>
        <Button variant="outline-light" className="btn-signup" onClick={() => navigate("/signup")}>
          Sign Up
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;