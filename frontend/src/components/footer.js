import React from 'react';
import '../styles/footer.css';
import { useNavigate } from "react-router-dom";



const Footer = () => {
    const navigate = useNavigate();
    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-section">
                    <h4 className="footer-heading">System Administrator</h4>
                    <p className="footer-text">
                        Simplifying management for users and stores.
                    </p>
                </div>
                <div className="footer-section">
                    <h4 className="footer-heading">Quick Links</h4>
                    <ul className="footer-links">
                        <li><a href="/dashboard" className="footer-link">Dashboard</a></li>
                        <li><a onClick={handleLogout} className="footer-link">Logout</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4 className="footer-heading">Contact</h4>
                    <p className="footer-text">
                        Email: <a href="mailto:contact@example.com" className="footer-link">contact@example.com</a>
                    </p>
                    <p className="footer-text">
                        Phone: <a href="tel:+1234567890" className="footer-link">+1 (234) 567-890</a>
                    </p>
                </div>
            </div>
            <div className="footer-bottom">
                <p className="footer-text">&copy; {new Date().getFullYear()} System Administrator. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;