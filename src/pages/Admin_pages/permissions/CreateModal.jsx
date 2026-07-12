import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./permissions.css";

const CreateModal = ({
  onClose,
  onSuccess,
  toastStyles,
}) => {
  // ===============================
  // API
  // ===============================

  const API_URL =
    "http://192.168.100.39:8000/api/web/permissions";

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
  // VALIDATE
  // ===============================

  const validate = () => {
    const validationErrors = {};

    if (!formData.name.trim()) {
      validationErrors.name =
        "Permission name is required.";
    }

    if (!formData.guard_name.trim()) {
      validationErrors.guard_name =
        "Guard name is required.";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  // ===============================
  // SUBMIT
  // ===============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        API_URL,
        formData,
        getHeaders()
      );

      if (response.data.success) {
        toast.success(
          response.data.message ||
            "Permission created successfully.",
          {
            style: toastStyles?.success,
          }
        );

        if (onSuccess) {
          onSuccess();
        }

        if (onClose) {
          onClose();
        }
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 422
      ) {
        setErrors(error.response.data.errors || {});
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to create permission.",
          {
            style: toastStyles?.error,
          }
        );
      }
    } finally {
      setLoading(false);
    }
  };
    return (
    <div className="permission-modal-overlay">

      <div className="permission-modal-card">

        {/* ===============================
            HEADER
        =============================== */}
        <div className="permission-modal-header">

          <div>
            <h3>
              🔐 Create Permission
            </h3>

            <p>
              Add a new system permission.
            </p>
          </div>

          <button
            className="permission-close-btn"
            onClick={onClose}
          >
            ✕
          </button>

        </div>


        {/* ===============================
            FORM
        =============================== */}
        <form
          onSubmit={handleSubmit}
          className="permission-form"
        >


          {/* Permission Name */}
          <div className="form-group">

            <label>
              Permission Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Example: student.view"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              required
            />


            {errors.name && (
              <span className="form-error">
                {errors.name}
              </span>
            )}

          </div>



          {/* Guard Name */}
          <div className="form-group">

            <label>
              Guard Name
            </label>


            <select
              name="guard_name"
              value={formData.guard_name}
              onChange={handleChange}
              disabled={loading}
            >

              <option value="sanctum">
                Sanctum
              </option>

              <option value="web">
                Web
              </option>

            </select>


            {errors.guard_name && (
              <span className="form-error">
                {errors.guard_name}
              </span>
            )}

          </div>




          {/* ===============================
              BUTTON ACTION
          =============================== */}

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
                  Saving...
                </>
              ) : (
                <>
                  💾 Save Permission
                </>
              )}

            </button>


          </div>


        </form>


      </div>

    </div>
  );
};

export default CreateModal;