// import React, { useState } from "react";
// import axios from "axios";

// const UpdatePasswordModal = ({ isOpen, onClose }) => {
//   const [oldPass, setOldPass] = useState("");
//   const [newPass, setNewPass] = useState("");

//   if (!isOpen) return null; // modal hidden when isOpen is false

//   const handleUpdate = async () => {
//     try {
//       const email = localStorage.getItem("studentEmail"); // or from context
//       const res = await axios.put("/update-password", {
//         email,
//         oldPassword: oldPass,
//         newPassword: newPass,
//       });
//       alert(res.data.message);
//       setOldPass("");
//       setNewPass("");
//       onClose(); // close modal after success
//     } catch (err) {
//       alert(err.response?.data?.message || "Error updating password");
//     }
//   };

//   return (
//     <div style={modalOverlayStyle}>
//       <div style={modalContentStyle}>
//         <h2>Update Password</h2>
//         <input
//           type="password"
//           placeholder="Old Password"
//           value={oldPass}
//           onChange={(e) => setOldPass(e.target.value)}
//           style={inputStyle}
//         />
//         <input
//           type="password"
//           placeholder="New Password"
//           value={newPass}
//           onChange={(e) => setNewPass(e.target.value)}
//           style={inputStyle}
//         />
//         <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
//           <button onClick={handleUpdate} style={buttonStyle}>Update</button>
//           <button onClick={onClose} style={buttonStyle}>Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Inline styles
// const modalOverlayStyle = {
//   position: "fixed",
//   top: 0,
//   left: 0,
//   width: "100vw",
//   height: "100vh",
//   backgroundColor: "rgba(0,0,0,0.5)",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   zIndex: 1000,
// };

// const modalContentStyle = {
//   backgroundColor: "#fff",
//   padding: "20px",
//   borderRadius: "8px",
//   width: "300px",
//   boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
// };

// const inputStyle = {
//   width: "100%",
//   padding: "8px",
//   marginBottom: "10px",
// };

// const buttonStyle = {
//   padding: "8px 12px",
// };

// export default UpdatePasswordModal;
import React, { useState } from "react";
import axios from "axios";

const UpdatePasswordModal = ({ isOpen, onClose }) => {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpdate = async () => {
    if (!oldPass || !newPass) {
      alert("Please fill in both fields");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.put(
        "http://localhost:5000/api/users/update-password",
        { oldPassword: oldPass, newPassword: newPass },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message);
      setOldPass("");
      setNewPass("");
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h2>Update Password</h2>
        <input
          type="password"
          placeholder="Old Password"
          value={oldPass}
          onChange={(e) => setOldPass(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          style={inputStyle}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
          <button onClick={handleUpdate} style={buttonStyle} disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </button>
          <button onClick={onClose} style={buttonStyle} disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Inline styles
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "300px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
};

const buttonStyle = {
  padding: "8px 12px",
};

export default UpdatePasswordModal;
