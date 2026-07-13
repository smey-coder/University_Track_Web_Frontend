import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CreateModal = ({
  departments,
  classes,
  onClose,
  onSuccess,
  toastStyles,
}) => {
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    student_code: "",
    first_name_english: "",
    last_name_english: "",
    first_name_khmer: "",
    last_name_khmer: "",
    gender: "Male",
    date_of_birth: "",
    phone: "",
    email: "",
    address: "",
    department_id: departments?.[0]?.id || "",
    class_id: classes?.[0]?.id || "",
    enrollment_date: "",
    status: "Active",
    photo: null,
  });

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
        "http://192.168.100.39:8000/api/web/students",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("🎉 Student created successfully!", {
          style: toastStyles.success,
        });

        onSuccess();
        onClose();
      }
    } catch (err) {
      console.log(err.response);

      toast.error(
        err.response?.data?.message ||
          "Failed to create student.",
        {
          style: toastStyles.error,
        }
      );
    }
  };
    return (
    <div className="modal-backdrop-overlay">
      <div className="modal-content-card">
        <h3>Enroll New Student Profile</h3>

        <form onSubmit={handleSubmit} className="swal-form-grid">

          {/* Student Code */}
          <input
            type="text"
            name="student_code"
            placeholder="Student Code"
            className="swal2-input"
            value={formData.student_code}
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
            placeholder="Email"
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

          {/* Date of Birth */}
          <input
            type="date"
            name="date_of_birth"
            className="swal2-input"
            value={formData.date_of_birth}
            onChange={handleChange}
          />

          {/* Enrollment Date */}
          <input
            type="date"
            name="enrollment_date"
            className="swal2-input"
            value={formData.enrollment_date}
            onChange={handleChange}
          />

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
            {departments.map((department) => (
              <option
                key={department.id}
                value={department.id}
              >
                {department.department_name_english}
              </option>
            ))}
          </select>

          {/* Class */}
          <select
            name="class_id"
            className="swal2-select"
            value={formData.class_id}
            onChange={handleChange}
          >
            {classes.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.class_name}
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
            <option value="Pending">Pending</option>
            <option value="Active">Active</option>
            <option value="Graduated">Graduated</option>
            <option value="Suspended">Suspended</option>
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

          {/* Upload Photo */}
          <div style={{ gridColumn: "span 2" }}>
            <label
              style={{
                display: "block",
                marginBottom: "10px",
                fontWeight: "bold",
              }}
            >
              Student Photo
            </label>

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

          <div
            className="modal-action-row"
            style={{ gridColumn: "span 2" }}
          >
            <button
              type="button"
              className="pagination-nav-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="add-student-master-btn"
            >
              Save Student
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
export default CreateModal;