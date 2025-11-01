import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    if (!email || !password) {
      setMsg("Enter email and password");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMsg("Invalid email format");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const result = await loginUser({ email, password });
    console.log("Login successful:", result);

    // ✅ Call onLogin only after success
    onLogin();
  } catch (err) {
    console.error("Login error:", err.message);
    alert("Login failed! Please check your email or password.");
  }
};


  return (
    <div className="form-container">
      <h2>Welcome back</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>

      <p className="error">{msg}</p>

      <p style={{ marginTop: 12 }}>
        Don't have an account?{" "}
        <span className="link" onClick={() => navigate("/register")}>
          Register
        </span>
      </p>
    </div>
  );
};

export default Login;
