import React, { useState } from "react";
import { Navbar, Nav, Form, FormControl, Dropdown, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UpdatePasswordModal from "../updatePasswordmodal";

const UserNavbar = ({ searchQuery, setSearchQuery, setStores }) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    // Search stores
    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(
                `http://localhost:5000/api/stores?search=${searchQuery}`
            );
            setStores(res.data);
        } catch (err) {
            console.error("Error fetching stores", err);
        }
    };

    return (
        <Navbar bg="light" expand="lg" className="px-4 shadow-sm">
            <Navbar.Brand className="fw-bold">StoreFinder</Navbar.Brand>

            {/* Center Search Bar */}
            <Form className="mx-auto w-50 d-flex" onSubmit={handleSearch}>
                <FormControl
                    type="text"
                    placeholder="Search stores by name or address..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" variant="primary" className="ms-2">
                    Search
                </Button>
            </Form>

            {/* Profile Dropdown */}
            <Dropdown align="end">
                <Dropdown.Toggle variant="light" id="profile-dropdown">
                    👤
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {/* <Dropdown.Item onClick={() => setIsModalOpen(true)}>
                        Update Password
                    </Dropdown.Item>
                    <UpdatePasswordModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    /> */}
                    <Dropdown.Item onClick={() => setIsModalOpen(true)}>Update Password</Dropdown.Item>
                    <UpdatePasswordModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    />
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </Navbar>
    );
};

export default UserNavbar;

