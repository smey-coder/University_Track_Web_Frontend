import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateModal = ({ permission, onClose, onSuccess, toastStyles }) => {
  // ===============================
  // API
  // ===============================

  const API_URL = "http://192.168.100.39:8000/api/web/permissions";

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
  });

  // ===============================
  // STATE
  // ===============================

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    guard_name: "sanctum",
  });

  const [errors, setErrors] = useState({});

  // ===============================
  // LOAD DATA
  // ===============================

  useEffect(() => {
    if (permission) {
      setFormData({
        name: permission.name || "",

        guard_name: permission.guard_name || "sanctum",
      });
    }
  }, [permission]);

  // ===============================
  // HANDLE CHANGE
  // ===============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,

      [name]: "",
    }));
  };

  // ===============================
  // VALIDATION
  // ===============================

  const validate = () => {
    let validationErrors = {};

    if (!formData.name.trim()) {
      validationErrors.name = "Permission name is required.";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  // ===============================
  // UPDATE
  // ===============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(
        `${API_URL}/${permission.id}`,

        formData,

        getHeaders(),
      );

      if (response.data.success) {
        toast.success(
          response.data.message || "Permission updated successfully.",

          {
            style: toastStyles?.success,
          },
        );

        onSuccess();

        onClose();
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        toast.error(
          error.response?.data?.message || "Failed to update permission.",

          {
            style: toastStyles?.error,
          },
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="permission-modal-overlay">
      <div className="permission-modal-card">
        {/* HEADER */}

        <div className="permission-modal-header">
          <div>
            <h3>✏️ Update Permission</h3>

            <p>Modify existing permission.</p>
          </div>

          <button className="permission-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit} className="permission-form">
          <div className="form-group">
            <label>Permission Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              placeholder="student.view"
            />

            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Guard Name</label>

            <select
              name="guard_name"
              value={formData.guard_name}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="sanctum">Sanctum</option>

              <option value="web">Web</option>
            </select>
          </div>

          {/* FOOTER BUTTON */}

          <div className="permission-modal-footer">
            <button
              type="button"
              className="permission-cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Updating...
                </>
              ) : (
                <>💾 Update Permission</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;
