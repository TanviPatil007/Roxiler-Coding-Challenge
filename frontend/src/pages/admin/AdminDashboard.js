import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Nav, Table, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/admin.css";

const AdminDashboard = () => {
    const navigate = useNavigate();

    // Dashboard stats
    const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });

    // Users
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "user"
    });
    const [message, setMessage] = useState("");

    // Stores
    const [stores, setStores] = useState([]);
    // const [newStore, setNewStore] = useState({
    //     name: "",
    //     email: "",
    //     address: "",
    // });
    const [newStore, setNewStore] = useState({
        name: "",
        ownerEmail: "",  // match backend
        address: "",
    });
    const [storeMessage, setStoreMessage] = useState("");

    // Filters
    const [filterName, setFilterName] = useState("");
    const [filterEmail, setFilterEmail] = useState("");
    const [filterAddress, setFilterAddress] = useState("");
    const [filterRole, setFilterRole] = useState("");

    const fetchFilteredUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/admin/users", {
                params: {
                    name: filterName,
                    email: filterEmail,
                    address: filterAddress,
                    role: filterRole,
                },
            });
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchFilteredUsers(); // load users when component mounts
    }, []);


    // Fetch stats and dummy data
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:5000/api/admin/dashboard", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data);
            } catch (err) {
                console.error("Error fetching stats:", err);
            }
        };

        fetchStats();
    }, []);
    //fetching all users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:5000/api/admin/users", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(res.data);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };

        fetchUsers();
    }, []);

    //fetching all stores
    useEffect(() => {
        const fetchStores = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:5000/api/admin/stores", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStores(res.data);
            } catch (err) {
                console.error("Error fetching stores:", err);
            }
        };

        fetchStores();
    }, []);



    // Handle input change
    const handleChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const handleStoreChange = (e) => {
        setNewStore({ ...newStore, [e.target.name]: e.target.value });
    };
    const handleLogout = () => {
        localStorage.removeItem("token"); // remove JWT token
        navigate("/login"); // redirect to login page
    };


    // Add new user
    const handleAddUser = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const token = localStorage.getItem("token");
            const res = await axios.post("http://localhost:5000/api/admin/users", newUser, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage(res.data.message || "User created successfully.");
            setUsers([...users, { ...newUser, id: users.length + 1 }]);
            setNewUser({ name: "", email: "", password: "", address: "", role: "user" });
        } catch (err) {
            setMessage(err.response?.data?.message || "Error creating user.");
        }
    };

    // Add new store
    const handleAddStore = async (e) => {
        e.preventDefault();
        setStoreMessage("");

        try {
            const token = localStorage.getItem("token");
            const res = await axios.post("http://localhost:5000/api/admin/stores", newStore, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setStoreMessage(res.data.message || "Store created successfully.");
            setStores([...stores, { ...newStore, id: stores.length + 1 }]);
            // setNewStore({ name: "", email: "", address: "", rating: 0 });
            setNewStore({ name: "", ownerEmail: "", address: "", rating: 0 });

        } catch (err) {
            setStoreMessage(err.response?.data?.message || "Error creating store.");
        }
    };

    return (
        <Container fluid className="min-vh-100">
            <Row>
                {/* Sidebar */}
                <Col md={2} className="sidebar-dark text-white p-3">
                    <div className="text-center mb-4">
                        <h5>System Administrator</h5>
                    </div>
                    <Nav className="flex-column">
                        <Nav.Link className="text-white" onClick={() => navigate("/admin/dashboard")}>
                            📊 Dashboard
                        </Nav.Link>
                        <Nav.Link className="text-white" onClick={() => navigate("/admin/dashboard")}>
                            👥 Manage Users
                        </Nav.Link>
                        <Nav.Link className="text-white" onClick={() => navigate("/admin/dashboard")}>
                            🏬 Manage Stores
                        </Nav.Link>
                        <Nav.Link className="text-white mt-4" onClick={handleLogout}>
                            🚪 Logout
                        </Nav.Link>
                    </Nav>
                </Col>

                {/* Main Content */}
                <Col md={10} className="p-4 bg-light">
                    {/* Dashboard Stats */}
                    <Row className="mb-4">
                        <Col md={4}>
                            <Card className="golden-card text-center p-3">
                                <h5>Total Users</h5>
                                <h3 className="fw-bold">{stats.totalUsers}</h3>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="golden-card text-center p-3">
                                <h5>Total Stores</h5>
                                <h3 className="fw-bold">{stats.totalStores}</h3>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="golden-card text-center p-3">
                                <h5>Total Ratings</h5>
                                <h3 className="fw-bold">{stats.totalRatings}</h3>
                            </Card>
                        </Col>
                    </Row>

                    {/* Add User Form */}
                    <Card className="p-4 golden-card mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5>Add New User</h5>
                            <Button className="golden-btn" onClick={handleAddUser}>
                                Add User
                            </Button>
                        </div>
                        {message && <p className={message.includes("success") ? "text-success" : "text-danger"}>{message}</p>}
                        <Form>
                            <Row>
                                <Col md={3}>
                                    <Form.Control name="name" placeholder="Name" value={newUser.name} onChange={handleChange} />
                                </Col>
                                <Col md={3}>
                                    <Form.Control name="email" type="email" placeholder="Email" value={newUser.email} onChange={handleChange} />
                                </Col>
                                <Col md={3}>
                                    <Form.Control name="password" type="password" placeholder="Password" value={newUser.password} onChange={handleChange} />
                                </Col>
                                <Col md={3}>
                                    <Form.Control name="address" placeholder="Address" value={newUser.address} onChange={handleChange} />
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col md={3}>
                                    <Form.Select name="role" value={newUser.role} onChange={handleChange}>
                                        <option value="user">Normal User</option>
                                        <option value="store_owner">Store Owner</option>
                                        <option value="admin">Admin User</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                        </Form>
                    </Card>

                    {/* Add Store Form */}
                    <Card className="p-4 golden-card mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5>Add New Store</h5>
                            <Button className="golden-btn" onClick={handleAddStore}>
                                Add Store
                            </Button>
                        </div>
                        {storeMessage && <p className={storeMessage.includes("success") ? "text-success" : "text-danger"}>{storeMessage}</p>}
                        <Form>
                            <Row>
                                <Col md={3}>
                                    <Form.Control name="name" placeholder="Store Name" value={newStore.name} onChange={handleStoreChange} />
                                </Col>
                                <Col md={3}>
                                    {/* <Form.Control name="email" type="email" placeholder="Owner Email" value={newStore.email} onChange={handleStoreChange} /> */}
                                    <Form.Control
                                        name="ownerEmail"   // ✅ not "email"
                                        type="email"
                                        placeholder="Owner Email"
                                        value={newStore.ownerEmail}
                                        onChange={handleStoreChange}
                                    />

                                </Col>
                                <Col md={3}>
                                    <Form.Control name="address" placeholder="Address" value={newStore.address} onChange={handleStoreChange} />
                                </Col>
                            </Row>
                        </Form>
                    </Card>


                    {/* Filters */}
                    <Card className="p-3 golden-card mb-4">
                        <h5 className="mb-3">Apply Filters</h5>
                        <Row>
                            <Col md={3}>
                                <Form.Control
                                    placeholder="Filter by Name"
                                    value={filterName}
                                    onChange={(e) => setFilterName(e.target.value)}
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Control
                                    placeholder="Filter by Email"
                                    value={filterEmail}
                                    onChange={(e) => setFilterEmail(e.target.value)}
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Control
                                    placeholder="Filter by Address"
                                    value={filterAddress}
                                    onChange={(e) => setFilterAddress(e.target.value)}
                                />
                            </Col>
                            <Col md={3}>
                                <Form.Select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                                    <option value="">All Roles</option>
                                    <option value="user">Normal User</option>
                                    <option value="store_owner">Store Owner</option>
                                    <option value="admin">Admin User</option>
                                </Form.Select>
                            </Col>
                        </Row>
                        <div className="mt-3">
                            <Button className="golden-btn " onClick={fetchFilteredUsers}>Apply Filters</Button>
                        </div>
                    </Card>

                    {/* Users Table */}
                    <Card className="p-3 golden-card mb-4">
                        <h5 className="mb-3">List of Users</h5>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <th>Role</th>
                                    <th>Rating (if Store Owner)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id}>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td>{u.address}</td>
                                        <td>{u.role}</td>
                                        <td>{u.role === "store_owner" ? u.rating : "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card>

                    {/* Stores Table */}
                    <Card className="p-3 golden-card">
                        <h5 className="mb-3">List of Stores</h5>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <th>Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stores.map((s) => (
                                    <tr key={s.id}>
                                        <td>{s.name}</td>
                                        <td>{s.email}</td>
                                        <td>{s.address}</td>
                                        <td>{s.rating}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminDashboard;

