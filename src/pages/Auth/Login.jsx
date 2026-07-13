import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const toastStyle = {
    background: "#22c55e",
    color: "#fff",
    fontWeight: "500",
    borderRadius: "10px",
  };

  const errorStyle = {
    background: "#ef4444",
    color: "#fff",
    fontWeight: "500",
    borderRadius: "10px",
  };

  const loadingStyle = {
    background: "#3b82f6",
    color: "#fff",
    fontWeight: "500",
    borderRadius: "10px",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const loadingToast = toast.loading("Loading account...", {
      style: loadingStyle,
    });

    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      const user = data.user;
      const userName = user.username;
      const roles = user.roles || [];

      toast.dismiss(loadingToast);

      toast.success(`🎉 Welcome back, ${userName}!`, {
        style: toastStyle,
        autoClose: 2000,
      });

      setTimeout(() => {
        if (roles.includes("Admin")) {
          navigate("/admin/dashboard");
        } else if (roles.includes("Teacher")) {
          navigate("/teacher/dashboard");
        } else if (roles.includes("Student")) {
          navigate("/student/dashboard");
        } else {
          toast.error("No role assigned.", { style: errorStyle });
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsSubmitting(false);
        }
      }, 1200);
    } catch (err) {
      toast.dismiss(loadingToast);
      setIsSubmitting(false);

      const message = err.response?.data?.message || "Login failed. Please check your credentials.";
      toast.error(`❌ ${message}`, { style: errorStyle });
    }
  };

  return (
    <div className="auth-page">
      <div className="activate-container">
        
        {/* LEFT SIDE: WELCOME PANEL */}
        <div className="welcome-section">
          <h1>Welcome</h1>
          <p>
            Welcome to University Track
            <br />
            Smart University Management System
          </p>
          <img src="/images/animation_university.png" alt="University" />
        </div>

        {/* RIGHT SIDE: FORM CARD */}
        <div className="form-section">
          <div className="auth-card">
            <h2>Welcome Back</h2>
            <p className="subtitle">Sign in to University Track</p>

            <form onSubmit={handleSubmit}>
              
              {/* Email Input */}
              <div className="input-group">
                <label>Email Address</label>
                <div className="input-box">
                  <span className="input-icon">✉️</span>
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="input-group">
                <label>Password</label>
                <div className="input-box">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>

            </form>

            <div className="auth-footer">
              Don't have an account?{" "}
              <Link to="/activate" className="footer-link">
                Activate Account
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;