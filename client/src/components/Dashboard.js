import React from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await logoutUser(refreshToken);
      }
    } catch (err) {
      console.error("Logout request failed", err);
    } finally {
      // always clear local tokens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/login");
    }
  };

  return (
    <div className="dashboard">
      <h2>Welcome to Dashboard 🎉</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
