import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateModal = ({ user, roles, onClose, onSuccess }) => {
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
    username: user?.username || "",

    email: user?.email || "",

    password: "",

    role: user?.roles?.[0]?.name || "",

    is_active: user?.is_active ?? false,
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
      const response = await axios.put(
        `http://192.168.100.39:8000/api/web/users/${user.id}`,

        formData,

        getHeaders(),
      );

      if (response.data.success) {
        toast.success(
          "User updated successfully",

          {
            style: {
              background: "#22c55e",

              color: "#fff",

              borderRadius: "10px",
            },
          },
        );

        onSuccess();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Update user failed",

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
        <h2>Update User</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
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
            />
          </div>

          <div className="form-group">
            <label>New Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave empty to keep old password"
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
              {loading ? "Updating..." : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;
