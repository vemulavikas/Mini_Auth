import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [strength, setStrength] = useState({ score: 0, text: "" });
  const navigate = useNavigate();

  const checkStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[@$!%*?&]/.test(pwd)) score++;

    let text = "Very Weak";
    if (score <= 2) text = "Weak";
    else if (score === 3) text = "Fair";
    else if (score === 4) text = "Good";
    else if (score === 5) text = "Strong";
    return { score, text };
  };

  const validateForm = () => {
    if (!email || !password) {
      setMsg("Please enter email and password");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMsg("Invalid email format");
      return false;
    }
    if (password.length < 8) {
      setMsg("Password must be at least 8 characters");
      return false;
    }
    return true;
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setStrength(checkStrength(val));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!validateForm()) return;

    const res = await registerUser({ email, password });
    if (res.msg === "User registered successfully") {
      setMsg("Registered! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    } else {
      setMsg(res.msg || "Registration failed");
    }
  };

  return (
    <div className="form-container">
      <h2>Create account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password (min 8 chars)"
          value={password}
          onChange={handlePasswordChange}
          required
        />

        {/* Password strength bar */}
        {password && (
          <>
            <div className="password-strength">
              <div
                style={{
                  width: `${(strength.score / 5) * 100}%`,
                  background:
                    strength.score <= 2
                      ? "#ff6b6b"
                      : strength.score === 3
                      ? "#ffb86b"
                      : strength.score === 4
                      ? "#ffd76b"
                      : "#7efc8d",
                }}
              />
            </div>
            <div className="strength-text">{strength.text}</div>
          </>
        )}

        <button type="submit">Register</button>
      </form>

      <p className={msg && msg.startsWith("Registered") ? "success" : "error"}>{msg}</p>

      <p style={{ marginTop: 12 }}>
        Already have an account?{" "}
        <span className="link" onClick={() => navigate("/login")}>
          Login
        </span>
      </p>
    </div>
  );
};

export default Register;
