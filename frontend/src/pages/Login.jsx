// Login.jsx — user login page
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config.js";

function Login({ onLogin }) {
  const navigate = useNavigate();

  // Controlled form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      setLoading(true);
      const dataToSend = { email, password };
      console.log("Logging in:", dataToSend);

      const res = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const data = await res.json();

      if (data.success) {
        // Save token and user name in App state + localStorage
        onLogin(data.token, data.result.name);
        navigate("/");
      } else {
        setErrorMsg(data.message || "Invalid credentials");
      }
    } catch (err) {
      setErrorMsg("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="auth-page">
        <h1>Welcome Back</h1>

        {errorMsg && <div className="error-msg">{errorMsg}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="auth-link">
          Don’t have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </main>
  );
}

export default Login;
