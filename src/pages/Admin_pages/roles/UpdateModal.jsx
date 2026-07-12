import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateModal = ({ role, onClose, onSuccess }) => {
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);

  const API_URL = "http://192.168.100.39:8000/api/web/roles";

  const headers = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  // ===========================
  // LOAD ROLE DATA
  // ===========================

  useEffect(() => {
    if (role) {
      setName(role.name || "");
    }
  }, [role]);

  // ===========================
  // UPDATE ROLE
  // ===========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Role name is required");

      return;
    }

    try {
      setLoading(true);

      const response = await axios.put(
        `${API_URL}/${role.id}`,

        {
          name: name,
        },

        headers,
      );

      if (response.data.success) {
        toast.success("Role updated successfully");

        onSuccess();
      }
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Update role failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="role-modal">
        <div className="modal-header">
          <h3>✏ Update Role</h3>

          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Role Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Role name"
            />
          </div>

          <div className="form-group">
            <label>Guard Name</label>

            <input type="text" value={role?.guard_name || "sanctum"} disabled />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Updating..." : "Update Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;
