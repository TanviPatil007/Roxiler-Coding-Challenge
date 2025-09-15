import React from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="text-center">
          <Col>
            <h1 className="display-4 fw-bold mb-3">⭐ Store Rating Platform</h1>
            <p className="lead mb-4">
              Rate stores, view ratings, and manage users & stores with role-based access.
            </p>
            <Button variant="primary" size="lg" className="me-3 golden-btn" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button variant="outline-primary" size="lg golden-btn" onClick={() => navigate("/signup")}>
              Signup
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LandingPage;
