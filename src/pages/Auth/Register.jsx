import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const data = await register(username, email, password);
      const userRole = data.user.role;
      setSuccessMessage(
        "Registration successful! Redirecting to your dashboard...",
      );

      setTimeout(() => {
        if (userRole === "admin") {
          navigate("/admin/dashboard");
        } else if (userRole === "teacher") {
          navigate("/teacher/dashboard");
        } else {
          setError("Registration successful, but role is not supported.");
          setSuccessMessage("");
        }
      }, 1500);
    } catch (err) {
      const response = err.response?.data;
      const apiMessage = response?.message || response?.error;
      const validationErrors =
        response?.errors && Object.values(response.errors).flat().join(" ");
      setError(
        apiMessage ||
          validationErrors ||
          err.message ||
          "Registration failed. Please try again.",
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Get started with your new profile</p>

        {error && <div className="auth-error-alert">{error}</div>}
        {successMessage && (
          <div className="auth-success-alert">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <label className="auth-label">Full Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="auth-input"
              placeholder="John Doe"
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
              placeholder="john@example.com"
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="auth-input"
              placeholder="Min. 6 characters"
            />
          </div>

          <button type="submit" className="auth-primary-button">
            Sign Up
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
