import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import UserDashboard from "./pages/user/userDashboard";
import StoreDashboard from "./pages/storeOwner/storeDashboard";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
         <Route path="/login" element={<LoginPage />} />
         <Route path="/signup" element={<SignupPage />} />
         {/* <Route path="/dashboard" element={<UserDashboard />} /> */}

         {/*admin*/ }
          <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
        />

        {/* User Protected Route */}
        <Route path="/dashboard" element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/store/dashboard" element={
            <ProtectedRoute role="storeOwner">
              <StoreDashboard />
            </ProtectedRoute>
          }
        />
          
        {/* later we’ll add /login, /signup, /admin/dashboard, etc. */}
      </Routes>
    </Router>
  );
}

export default App;
