import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateModal = ({
  student,
  departments,
  classes,
  onClose,
  onSuccess,
  toastStyles,
}) => {
  const [formData, setFormData] = useState({
    student_code: student.student_code || "",
    first_name_english: student.first_name_english || "",
    last_name_english: student.last_name_english || "",

    first_name_khmer: student.first_name_khmer || "",
    last_name_khmer: student.last_name_khmer || "",

    gender: student.gender || "Male",

    date_of_birth: student.date_of_birth || "",

    phone: student.phone || "",

    email: student.email || "",

    address: student.address || "",

    department_id: student.department_id || "",

    class_id: student.class_id || "",

    enrollment_date: student.enrollment_date || "",

    status: student.status || "Active",

    photo: null,
  });

  const [preview, setPreview] = useState(
    student.photo_url ? student.photo_url : null,
  );

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: value,
    }));
  };

  // Handle image upload
  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,

      photo: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== "") {
          data.append(key, formData[key]);
        }
      });

      // Laravel method spoofing
      data.append("_method", "PUT");

      const response = await axios.post(
        `http://192.168.100.39:8000/api/web/students/${student.id}`,

        data,

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        toast.success(
          "🎉 Student updated successfully!",

          {
            style: toastStyles.success,
          },
        );

        onSuccess();

        onClose();
      }
    } catch (error) {
      console.log(error.response);

      toast.error(
        error.response?.data?.message || "Update student failed",

        {
          style: toastStyles.error,
        },
      );
    }
  };

  return (
    <div className="modal-backdrop-overlay">
      <div className="modal-content-card">
        <h3>Modify Student Details</h3>

        <form onSubmit={handleSubmit} className="swal-form-grid">
          <input
            name="student_code"
            value={formData.student_code}
            onChange={handleChange}
            className="swal2-input"
            placeholder="Student Code"
          />

          <input
            name="first_name_english"
            value={formData.first_name_english}
            onChange={handleChange}
            className="swal2-input"
            placeholder="First Name English"
          />

          <input
            name="last_name_english"
            value={formData.last_name_english}
            onChange={handleChange}
            className="swal2-input"
            placeholder="Last Name English"
          />

          <input
            name="first_name_khmer"
            value={formData.first_name_khmer}
            onChange={handleChange}
            className="swal2-input"
            placeholder="First Name Khmer"
          />

          <input
            name="last_name_khmer"
            value={formData.last_name_khmer}
            onChange={handleChange}
            className="swal2-input"
            placeholder="Last Name Khmer"
          />

          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="swal2-input"
            placeholder="Email"
          />

          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="swal2-input"
            placeholder="Phone"
          />

           {/* Date of Date */}
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
            />
          </div>

           {/* Enrollment Date */}
          <div className="form-control-group">
            <label htmlFor="enrollment_date" className="form-input-label">
              Enrollment Date
            </label>
            <input
              id="enrollment_date"
              type="date"
              name="enrollment_date"
              className="swal2-input"
              value={formData.enrollment_date}
              onChange={handleChange}
            />
          </div>

          {/* Gender */}
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="swal2-select"
          >
            <option value="Male">Male</option>

            <option value="Female">Female</option>
          </select>

          {/* Department */}
          <select
            name="department_id"
            value={formData.department_id}
            onChange={handleChange}
            className="swal2-select"
          >
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.department_name_english}
              </option>
            ))}
          </select>

          {/* Class */}
          <select
            name="class_id"
            value={formData.class_id}
            onChange={handleChange}
            className="swal2-select"
          >
            <option value="">
                No Class Assigned
            </option>
            {classes.map((item) => (
              <option key={item.id} value={item.id}>
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
            value={formData.address}
            onChange={handleChange}
            className="swal2-textarea"
            placeholder="Address"
            style={{
              gridColumn: "span 2",
            }}
          />

          {/* Photo Upload */}
          <div
            style={{
              gridColumn: "span 2",
            }}
          >
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
                  alt="Student Preview"
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
          {/* Buttons */}

          <div
            className="modal-action-row"
            style={{
              gridColumn: "span 2",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="pagination-nav-btn"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="row-edit-action-btn"
              style={{
                backgroundColor: "#3b82f6",

                color: "#fff",
              }}
            >
              Apply Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;
