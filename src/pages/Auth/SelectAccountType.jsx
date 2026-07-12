import { useNavigate } from "react-router-dom";
import "./auth.css";

const SelectAccountType = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Activate Account</h2>

        <p>Select your account type</p>

        <button
          className="role-button student"
          onClick={() => navigate("/activate/student")}
        >
          🎓 Student
        </button>

        <button
          className="role-button teacher"
          onClick={() => navigate("/activate/teacher")}
        >
          👨‍🏫 Teacher
        </button>

        <div className="auth-footer">
          Already activated?
          <button onClick={() => navigate("/login")}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default SelectAccountType;
