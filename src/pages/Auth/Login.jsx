import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "../../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. Trigger informational loading notification
    const loadingToast = toast.loading("ℹ️ Loading data...", {
      style: {
        background: "#3b82f6",
        color: "#fff",
        fontWeight: "500",
        borderRadius: "10px",
      },
    });

    try {
      const data = await login(email, password);
      const user = data.user || {};
      const userRole = user.role;
      const userName = user.username || user.name || "User";

      // 2. Dismiss loading and fire your exact customized success toast layout 🎉
      toast.dismiss(loadingToast);
      toast.success(`🎉 Welcome back, ${userName}!`, {
        style: {
          background: "#22c55e",
          color: "#fff",
          fontWeight: "500",
          borderRadius: "10px",
        },
        autoClose: 2000,
      });

      // 3. Forward to the dashboard after a short delay
      setTimeout(() => {
        if (userRole === "admin") {
          navigate("/admin/dashboard");
        } else if (userRole === "teacher") {
          navigate("/teacher/dashboard");
        } else {
          toast.error("❌ Unauthorized role allocation access.", {
            style: {
              background: "#ef4444",
              color: "#fff",
              fontWeight: "500",
              borderRadius: "10px",
            },
          });
          setIsSubmitting(false);
        }
      }, 1200);
    } catch (err) {
      setIsSubmitting(false);
      toast.dismiss(loadingToast);

      const errorMsg =
        err.response?.data?.message || "Invalid validation details";

      // 4. Fire your custom error layout ❌
      toast.error(`❌ ${errorMsg}`, {
        style: {
          background: "#ef4444",
          color: "#fff",
          fontWeight: "500",
          borderRadius: "10px",
        },
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your dashboard</p>

        <form onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <label className="auth-label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
              placeholder="name@example.com"
              disabled={isSubmitting}
            />
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
              placeholder="••••••••"
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            className="auth-primary-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Verifying..." : "Sign In"}
          </button>
        </form>

        <p className="auth-footer-text">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
