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
      // Call Login API
      const data = await login(email, password);

      // Save Token
      localStorage.setItem("token", data.token);

      // Save User
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
          toast.error("No role assigned.", {
            style: errorStyle,
          });

          localStorage.removeItem("token");
          localStorage.removeItem("user");

          setIsSubmitting(false);
        }
      }, 1200);
    } catch (err) {
      toast.dismiss(loadingToast);

      setIsSubmitting(false);

      const message =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";

      toast.error(`❌ ${message}`, {
        style: errorStyle,
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h2 className="auth-title">
          Welcome Back
        </h2>

        <p className="auth-subtitle">
          Sign in to University Track
        </p>

        <form onSubmit={handleSubmit}>

          <div className="auth-input-group">

            <label className="auth-label">
              Email Address
            </label>

            <input
              type="email"
              className="auth-input"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
            />

          </div>

          <div className="auth-input-group">

            <label className="auth-label">
              Password
            </label>

            <input
              type="password"
              className="auth-input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              required
            />

          </div>

          <button
            type="submit"
            className="auth-primary-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>

        </form>

        <p className="auth-footer-text">
          Don't have an account?{" "}
          <Link to="/activate" className="auth-link">
            Activate Account
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;