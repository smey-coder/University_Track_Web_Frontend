import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateModal = ({
  teacher = {},
  departments = [],
  classes = [],
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    teacher_code: teacher?.teacher_code || "",
    first_name_english: teacher?.first_name_english || "",
    last_name_english: teacher?.last_name_english || "",
    first_name_khmer: teacher?.first_name_khmer || "",
    last_name_khmer: teacher?.last_name_khmer || "",
    gender: teacher?.gender || "Male",
    date_of_birth: teacher?.date_of_birth || "",
    phone: teacher?.phone || "",
    email: teacher?.email || "",
    address: teacher?.address || "",
    department_id: teacher?.department_id || "",
    class_id: teacher?.class_id || "",
    hire_date: teacher?.hire_date || "",
    status: teacher?.status || "Active",
    photo: null,
  });

  const [preview, setPreview] = useState(teacher?.photo_url || null);

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

      data.append("_method", "PUT");

      const response = await axios.post(
        `http://192.168.100.39:8000/api/web/teachers/${teacher.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("🎉 Teacher updated successfully!", {
          style: toastStyles.success,
        });
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.log(error.response);
      toast.error(error.response?.data?.message || "Update teacher failed", {
        style: toastStyles.error,
      });
    }
  };

  return (
    <div className="modal-backdrop-overlay">
      <div className="modal-content-card">
        <h3>Modify Teacher Details</h3>

        <form onSubmit={handleSubmit} className="swal-form-grid">
          <input
            name="teacher_code"
            value={formData.teacher_code}
            onChange={handleChange}
            className="swal2-input"
            placeholder="Teacher Code"
            required
          />

          <input
            name="first_name_english"
            value={formData.first_name_english}
            onChange={handleChange}
            className="swal2-input"
            placeholder="First Name English"
            required
          />

          <input
            name="last_name_english"
            value={formData.last_name_english}
            onChange={handleChange}
            className="swal2-input"
            placeholder="Last Name English"
            required
          />

          <input
            name="first_name_khmer"
            value={formData.first_name_khmer}
            onChange={handleChange}
            className="swal2-input"
            placeholder="First Name Khmer"
            required
          />

          <input
            name="last_name_khmer"
            value={formData.last_name_khmer}
            onChange={handleChange}
            className="swal2-input"
            placeholder="Last Name Khmer"
            required
          />

          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="swal2-input"
            placeholder="Email Address"
          />

          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="swal2-input"
            placeholder="Phone Number"
          />

          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className="swal2-input"
          />

          <input
            type="date"
            name="hire_date"
            value={formData.hire_date}
            onChange={handleChange}
            className="swal2-input"
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="swal2-select"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <select
            name="department_id"
            value={formData.department_id}
            onChange={handleChange}
            className="swal2-select"
          >
            <option value="" disabled>
              Select Department
            </option>
            {Array.isArray(departments) &&
              departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.department_name_english}
                </option>
              ))}
          </select>

          <select
            name="class_id"
            value={formData.class_id}
            onChange={handleChange}
            className="swal2-select"
          >
            <option value="" disabled>
              Select Class
            </option>
            {Array.isArray(classes) &&
              classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.class_name}
                </option>
              ))}
          </select>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="swal2-select"
          >
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>

          <textarea
            name="address"
            rows="3"
            value={formData.address}
            onChange={handleChange}
            className="swal2-textarea"
            placeholder="Address"
            style={{ gridColumn: "span 2" }}
          />

          <div className="form-upload-group" style={{ gridColumn: "span 2" }}>
            <label className="form-upload-label">Teacher Photo</label>
            <input
              type="file"
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

          <div className="modal-action-row" style={{ gridColumn: "span 2" }}>
            <button type="button" onClick={onClose} className="pagination-nav-btn">
              Cancel
            </button>
            <button type="submit" className="row-edit-action-btn" style={{ backgroundColor: "#3b82f6", color: "#fff" }}>
              Apply Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;
