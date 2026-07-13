import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "../../styles/activateAccTeacher.css";

const ActivateAccTeacher = () => {
  const navigate = useNavigate();

  const API_URL = "http://192.168.100.39:8000/api/web";

  const [form, setForm] = useState({
    teacher_code: "",
    first_name_english: "",
    last_name_english: "",
    department_id: "",
    date_of_birth: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [departments, setDepartments] = useState([]);

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const response = await axios.get(`${API_URL}/departments/dropdown`);

      if (response.data.success) {
        setDepartments(response.data.data);
      }
    } catch (error) {
      toast.error("Cannot load departments");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,

      [e.target.name]: "",
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!form.teacher_code) {
      newErrors.teacher_code = "Teacher ID is required";
    }

    if (!form.first_name_english) newErrors.first_name_english = "Teacher first name is required";
    if (!form.last_name_english) newErrors.last_name_english = "Teacher last name is required";

    if (!form.department_id) {
      newErrors.department_id = "Please select department";
    }

    if (!form.date_of_birth) {
      newErrors.date_of_birth = "Date of birth is required";
    }

    if (!form.phone) {
      newErrors.phone = "Phone number is required";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password minimum 6 characters";
    }

    if (form.password !== form.password_confirmation) {
      newErrors.password_confirmation = "Password confirmation not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please check your information");

      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/activate/teacher`,
        form,
      );

      if (response.data.success) {
        toast.success(response.data.message);

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        toast.error(error.response?.data?.message || "Activation failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Toaster position="top-right" />

      <div className="activate-container">
        {/* LEFT */}

        <div className="welcome-section">
          <h1>Welcome Teacher</h1>

          <p>
            University Track
            <br />
            Smart University Management System
          </p>

          <img src="/images/teacher.jpg" alt="University" />
        </div>

        {/* RIGHT */}

        <div className="form-section">
          <div className="activate-card-teacher">
            <h2>Activate Teacher Account</h2>

            <form onSubmit={submit}>
              <div className="input-group">
                <label>Teacher ID *</label>

                <div className="input-box">
                  <span className="input-icon">👨‍🏫</span>

                  <input
                    name="teacher_code"
                    placeholder="Enter Teacher ID"
                    value={form.teacher_code}
                    onChange={handleChange}
                  />
                </div>

                <small className="error-text">{errors.teacher_code}</small>
              </div>
              {/* Tacher first name */}
              <div className="input-group">
                <label>First Name English*</label>
                <div className={`input-box ${errors.first_name_english ? "error" : ""}`}>
                  <span className="input-icon">👤</span> 
                  <input
                    name="first_name_english"
                    placeholder="Enter first name"
                    value={form.first_name_english}
                    onChange={handleChange}
                  />
                </div>
                {errors.first_name_english && <span className="error-text">{errors.first_name_english}</span>}
              </div>

              {/* Teacher last name */}
              <div className="input-group">
                <label>Last Name English *</label>
                <div className={`input-box ${errors.last_name_english ? "error" : ""}`}>
                  <span className="input-icon">🧑</span> 
                  <input
                    name="last_name_english"
                    placeholder="Enter last name"
                    value={form.last_name_english}
                    onChange={handleChange}
                  />
                </div>
                {errors.last_name_english && <span className="error-text">{errors.last_name_english}</span>}
              </div>

              <div className="input-group">
                <label>Department *</label>

                <div className="input-box">
                  <span className="input-icon">🏢</span>

                  <select
                    name="department_id"
                    value={form.department_id}
                    onChange={handleChange}
                  >
                    <option value="">Select Department</option>

                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.department_name_english}
                      </option>
                    ))}
                  </select>
                </div>

                <small className="error-text">{errors.department_id}</small>
              </div>

              <div className="input-group">
                <label>Date of Birth *</label>

                <div className="input-box">
                  <span className="input-icon">📅</span>

                  <input
                    type="date"
                    name="date_of_birth"
                    value={form.date_of_birth}
                    onChange={handleChange}
                  />
                </div>

                <small className="error-text">{errors.date_of_birth}</small>
              </div>

              <div className="input-group">
                <label>Phone *</label>

                <div className="input-box">
                  <span className="input-icon">📱</span>

                  <input
                    name="phone"
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                <small className="error-text">{errors.phone}</small>
              </div>

              <div className="input-group">
                <label>Email</label>

                <div className="input-box">
                  <span className="input-icon">✉️</span>

                  <input
                    name="email"
                    placeholder="Optional email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Password *</label>

                <div className="input-box">
                  <span className="input-icon">🔒</span>

                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>

                <small className="error-text">{errors.password}</small>
              </div>

              <div className="input-group">
                <label>Confirm Password *</label>

                <div className="input-box">
                  <span className="input-icon">🔐</span>

                  <input
                    type="password"
                    name="password_confirmation"
                    placeholder="Confirm password"
                    value={form.password_confirmation}
                    onChange={handleChange}
                  />
                </div>

                <small className="error-text">
                  {errors.password_confirmation}
                </small>
              </div>

              <button className="submit-btn" disabled={loading}>
                {loading ? "Activating..." : "Activate Account"}
              </button>

              <div className="back-link">
                <button
                  type="button"
                  className="back-btn"
                  onClick={() => navigate("/activate")}
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivateAccTeacher;
