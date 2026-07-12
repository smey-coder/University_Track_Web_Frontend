import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CreateModal = ({ roles, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const normalizeRoles = (value) => {
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
      if (Array.isArray(value.data)) return value.data;
      if (Array.isArray(value.roles)) return value.roles;
    }
    return [];
  };

  const normalizedRoles = normalizeRoles(roles);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    is_active: true,
  });

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,

      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post(
        "http://192.168.100.39:8000/api/web/users",

        formData,

        getHeaders(),
      );

      if (response.data.success) {
        toast.success("User created successfully", {
          style: {
            background: "#22c55e",
            color: "#fff",
            borderRadius: "10px",
          },
        });

        onSuccess();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Create user failed",

        {
          style: {
            background: "#ef4444",
            color: "#fff",
            borderRadius: "10px",
          },
        },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Create New User</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter username"
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
            />
          </div>

          <div className="form-group">
            <label>Role</label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Role --</option>

              {normalizedRoles.map((role, index) => {
                const roleName = typeof role === "string" ? role : role?.name;
                const roleKey =
                  typeof role === "string" ? role : role?.id || roleName;

                return (
                  <option
                    key={`${roleKey || "role"}-${index}`}
                    value={roleName || ""}
                  >
                    {roleName || ""}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              Active User
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Saving..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModal;
