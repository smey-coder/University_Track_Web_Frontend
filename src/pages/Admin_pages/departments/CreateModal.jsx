import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
const CreateModal = ({ onClose, onSuccess, toastStyles }) => {
  const API_URL = "http://192.168.100.39:8000/api/web/departments";
  const [form, setForm] = useState({
    department_code: "",
    department_name_khmer: "",
    department_name_english: "",
    description: "",
    status: "Active",
  });
  const [loading, setLoading] = useState(false);
  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(API_URL, form, getHeaders());
      if (response.data.success) {
        toast.success("🏢 Department created successfully", {
          style: toastStyles.success,
        });
        onSuccess();
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 422) {
        toast.error("❌ Please check your input data", {
          style: toastStyles.error,
        });
      } else {
        toast.error("❌ Create department failed", {
          style: toastStyles.error,
        });
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="modal-overlay">
      <div className="department-modal">
        <div className="modal-header">
          <h3>➕ Create Department</h3>
          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>
        <form onSubmit={handleSubmit} className="department-form">
          <div className="form-group">
            <label>Department Code</label>
            <input
              type="text"
              name="department_code"
              placeholder="Example: CS001"
              value={form.department_code}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Khmer Name</label>
            <input
              type="text"
              name="department_name_khmer"
              placeholder="Computer Science"
              value={form.department_name_khmer}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>English Name</label>
            <input
              type="text"
              name="department_name_english"
              placeholder="Computer Science Department"
              value={form.department_name_english}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Enter description..."
              value={form.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Saving..." : "Save Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModal;
