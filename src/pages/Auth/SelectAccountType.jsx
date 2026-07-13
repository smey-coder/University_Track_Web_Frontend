import { useNavigate } from "react-router-dom";
import "../../styles/SelectStyle.css";

const SelectAccountType = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="activate-container">
        {/* LEFT SIDE: WELCOME PANEL (Keeps UI consistent) */}
        <div className="welcome-section">
          <h1>Welcome</h1>
          <p>
            Welcome to University Track
            <br />
            Smart University Management System
          </p>
          <img src="/images/animation_university.png" alt="University" />
        </div>

        {/* RIGHT SIDE: CARD SECTION */}
        <div className="form-section">
          <div className="auth-card1 selection-card">
            <h2>Activate Account</h2>
            <p className="subtitle">Select your account type to proceed</p>

            <div className="role-options-container">
              <button
                className="role-button student"
                onClick={() => navigate("/activate/student")}
              >
                <span className="role-emoji">🎓</span>
                <span className="role-text">Student</span>
              </button>

              <button
                className="role-button teacher"
                onClick={() => navigate("/activate/teacher")}
              >
                <span className="role-emoji">👨‍🏫</span>
                <span className="role-text">Teacher</span>
              </button>
            </div>

            <div className="auth-footer">
              Already activated?{" "}
              <button
                className="footer-login-btn"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectAccountType;
