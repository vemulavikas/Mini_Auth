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
    setMsg("");
    if (!validate()) return;

    const res = await loginUser({ email, password });
    if (res.accessToken) {
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);
      navigate("/dashboard");
    } else {
      setMsg(res.msg || "Login failed");
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
