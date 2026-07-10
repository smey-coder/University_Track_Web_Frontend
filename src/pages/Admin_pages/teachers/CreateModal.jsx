import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CreateModal = ({
  departments = [],
  classes = [],
  onClose,
  onSuccess,
}) => {
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    teacher_code: "",
    first_name_english: "",
    last_name_english: "",
    first_name_khmer: "",
    last_name_khmer: "",
    gender: "Male",
    date_of_birth: "",
    phone: "",
    email: "",
    address: "",
    department_id:
      Array.isArray(departments) && departments.length > 0
        ? departments[0].id
        : "",
    class_id: Array.isArray(classes) && classes.length > 0 ? classes[0].id : "",
    hire_date: "",
    status: "Active",
    photo: null,
  });

  /* =====================================
      TOAST STYLES
  ===================================== */
  const toastStyles = {
    success: {
      background: "#22c55e",
      color: "#fff",
      borderRadius: "10px",
      fontWeight: "600",
    },
    error: {
      background: "#ef4444",
      color: "#fff",
      borderRadius: "10px",
      fontWeight: "600",
    },
  };

  /* =====================================
      EVENT HANDLERS
  ===================================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      photo: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== "") {
          data.append(key, formData[key]);
        }
      });

      const response = await axios.post(
        "http://192.168.100.39:8000/api/web/teachers",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        toast.success("🎉 Teacher created successfully!", {
          style: toastStyles.success,
        });
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.log(err.response);
      toast.error(err.response?.data?.message || "Failed to create teacher.", {
        style: toastStyles.error,
      });
    }
  };

  /* =====================================
      RENDER COMPONENT
  ===================================== */
  return (
    <div className="modal-backdrop-overlay">
      <div className="modal-content-card">
        <h3>Enroll New Teacher Profile</h3>

        <form onSubmit={handleSubmit} className="swal-form-grid">
          {/* Teacher Code */}
          <input
            type="text"
            name="teacher_code"
            placeholder="Teacher Code"
            className="swal2-input"
            value={formData.teacher_code}
            onChange={handleChange}
            required
          />

          {/* First Name English */}
          <input
            type="text"
            name="first_name_english"
            placeholder="First Name (English)"
            className="swal2-input"
            value={formData.first_name_english}
            onChange={handleChange}
            required
          />

          {/* Last Name English */}
          <input
            type="text"
            name="last_name_english"
            placeholder="Last Name (English)"
            className="swal2-input"
            value={formData.last_name_english}
            onChange={handleChange}
            required
          />

          {/* First Name Khmer */}
          <input
            type="text"
            name="first_name_khmer"
            placeholder="First Name (Khmer)"
            className="swal2-input"
            value={formData.first_name_khmer}
            onChange={handleChange}
            required
          />

          {/* Last Name Khmer */}
          <input
            type="text"
            name="last_name_khmer"
            placeholder="Last Name (Khmer)"
            className="swal2-input"
            value={formData.last_name_khmer}
            onChange={handleChange}
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="swal2-input"
            value={formData.email}
            onChange={handleChange}
          />

          {/* Phone */}
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            className="swal2-input"
            value={formData.phone}
            onChange={handleChange}
          />

          {/* Date of birth Field Block */}
          <div className="form-control-group">
            <label htmlFor="date_of_birth" className="form-input-label">
             Date of Birth
            </label>
            <input
              id="date_of_birth"
              type="date"
              name="date_of_birth"
              className="swal2-input"
              value={formData.date_of_birth}
              onChange={handleChange}
              required
            />
          </div>

          {/* Enrollment Date Field Block */}
          <div className="form-control-group">
            <label htmlFor="hire_date" className="form-input-label">
              Hire Date
            </label>
            <input
              id="hire_date"
              type="date"
              name="hire_date"
              className="swal2-input"
              value={formData.hire_date}
              onChange={handleChange}
              required
            />
          </div>

          {/* Gender */}
          <select
            name="gender"
            className="swal2-select"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          {/* Department */}
          <select
            name="department_id"
            className="swal2-select"
            value={formData.department_id}
            onChange={handleChange}
          >
            {Array.isArray(departments) &&
              departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.department_name_english}
                </option>
              ))}
          </select>

          {/* Status */}
          <select
            name="status"
            className="swal2-select"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Suspended">Inactive</option>
          </select>

          {/* Address */}
          <textarea
            name="address"
            rows="3"
            placeholder="Address"
            className="swal2-textarea"
            value={formData.address}
            onChange={handleChange}
            style={{ gridColumn: "span 2" }}
          />

          {/* Upload Photo Container */}
          <div className="form-upload-group" style={{ gridColumn: "span 2" }}>
            <label className="form-upload-label">Teacher Photo</label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              className="swal2-file"
              onChange={handleImage}
            />

            {preview && (
              <div
                style={{
                  marginTop: "15px",
                  textAlign: "center",
                }}
              >
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: "140px",
                    height: "140px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid #ddd",
                  }}
                />
              </div>
            )}
          </div>

          {/* Modal Action Controls */}
          <div className="modal-action-row" style={{ gridColumn: "span 2" }}>
            <button
              type="button"
              className="pagination-nav-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="pagination-nav-btn">
              Save Teacher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModal;
