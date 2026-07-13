import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "../../styles/activateAccStudent.css";

const ActivateAccStudent = () => {
  const navigate = useNavigate();
  const API_URL = "http://192.168.100.39:8000/api/web";

  const [form, setForm] = useState({
    student_code: "",
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

  // Load Departments
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

  // Input Change Handler
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    // Remove targeted error message while typing
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  // Frontend Validation Logic
  const validate = () => {
    let newErrors = {};

    if (!form.student_code) newErrors.student_code = "Student ID is required";
    if (!form.first_name_english) newErrors.first_name_english = "Student first name is required";
    if (!form.last_name_english) newErrors.last_name_english = "Student last name is required";
    if (!form.department_id) newErrors.department_id = "Please select department";
    if (!form.date_of_birth) newErrors.date_of_birth = "Date of birth is required";
    if (!form.phone) newErrors.phone = "Phone number is required";
    if (!form.email) newErrors.email = "Phone email is required";
    
    
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (form.password !== form.password_confirmation) {
      newErrors.password_confirmation = "Password confirmation does not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const submit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please check your information");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/activate/student`, form);

      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      console.log(error.response);
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else if (error.response?.status === 404) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 500) {
        toast.error(error.response.data.error || "Server error");
      } else {
        toast.error("Activation failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Toaster position="top-right" />

      <div className="activate-container">
        {/* LEFT SIDE: WELCOME SECTION */}
        <div className="welcome-section">
          <h1>Welcome</h1>
          <p>
            Welcome to University Track
            <br />
            Smart University Management System
          </p>
          <img src="/images/student_university.jpg" alt="University" />
        </div>

        {/* RIGHT SIDE: FORM SECTION */}
        <div className="form-section">
          <div className="activate-card-student">
            <h2>Activate Student Account</h2>
            <form onSubmit={submit}>
              {/* Student ID */}
              <div className="input-group">
                <label>Student ID *</label>
                <div className={`input-box ${errors.student_code ? "error" : ""}`}>
                  <span className="input-icon">🆔</span> 
                  <input
                    name="student_code"
                    placeholder="Enter Student ID"
                    value={form.student_code}
                    onChange={handleChange}
                  />
                </div>
                {errors.student_code && <span className="error-text">{errors.student_code}</span>}
              </div>
              {/* Student first name */}
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

              {/* Student last name */}
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

              {/* Department Option */}
              <div className="input-group">
                <label>Department *</label>
                <div className={`input-box ${errors.department_id ? "error" : ""}`}>
                  <span className="input-icon">🏫</span>
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
                {errors.department_id && <span className="error-text">{errors.department_id}</span>}
              </div>

              {/* Date of Birth */}
              <div className="input-group">
                <label>Date of Birth *</label>
                <div className={`input-box ${errors.date_of_birth ? "error" : ""}`}>
                  <span className="input-icon">📅</span>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={form.date_of_birth}
                    onChange={handleChange}
                  />
                </div>
                {errors.date_of_birth && <span className="error-text">{errors.date_of_birth}</span>}
              </div>

              {/* Phone */}
              <div className="input-group">
                <label>Phone *</label>
                <div className={`input-box ${errors.phone ? "error" : ""}`}>
                  <span className="input-icon">📞</span>
                  <input
                    name="phone"
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>

              {/* Email */}
              <div className="input-group">
                <label>Email</label>
                <div className={`input-box ${errors.email ? "error" : ""}`}>
                  <span className="input-icon">✉️</span>
                  <input
                    name="email"
                    placeholder="Optional email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              {/* Password */}
              <div className="input-group">
                <label>Password *</label>
                <div className={`input-box ${errors.password ? "error" : ""}`}>
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              {/* Confirm Password */}
              <div className="input-group">
                <label>Confirm Password *</label>
                <div className={`input-box ${errors.password_confirmation ? "error" : ""}`}>
                  <span className="input-icon">🔄</span>
                  <input
                    type="password"
                    name="password_confirmation"
                    placeholder="Confirm password"
                    value={form.password_confirmation}
                    onChange={handleChange}
                  />
                </div>
                {errors.password_confirmation && (
                  <span className="error-text">{errors.password_confirmation}</span>
                )}
              </div>

              {/* Action Buttons */}
              <button type="submit" className="submit-btn" disabled={loading}>
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

export default ActivateAccStudent;