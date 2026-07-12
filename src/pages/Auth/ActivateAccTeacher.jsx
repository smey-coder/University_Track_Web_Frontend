import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import "./auth.css";

const ActivateAccTeacher = () => {
  const navigate = useNavigate();

  const API_URL = "http://192.168.100.39:8000/api/web";

  const [form, setForm] = useState({
    teacher_code: "",
    department_id: "",
    date_of_birth: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/activate/teacher`,

        form,
      );

      if (response.data.success) {
        toast.success("Teacher account activated");

        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Activation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Activate Teacher Account</h2>

        <form onSubmit={submit}>
          <input
            name="teacher_code"
            placeholder="Teacher ID"
            value={form.teacher_code}
            onChange={handleChange}
          />

          <input
            name="department_id"
            placeholder="Department ID"
            value={form.department_id}
            onChange={handleChange}
          />

          <input
            type="date"
            name="date_of_birth"
            value={form.date_of_birth}
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Email (Optional)"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password_confirmation"
            placeholder="Confirm Password"
            value={form.password_confirmation}
            onChange={handleChange}
          />

          <button disabled={loading}>
            {loading ? "Activating..." : "Activate Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ActivateAccTeacher;
