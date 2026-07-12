import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CreateModal = ({ onClose, onSuccess }) => {
  const [name, setName] = useState("");

  const [guardName, setGuardName] = useState("sanctum");

  const [loading, setLoading] = useState(false);

  const API_URL = "http://192.168.100.39:8000/api/web/roles";

  const headers = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  // ===========================
  // SUBMIT CREATE
  // ===========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Role name is required");

      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        API_URL,

        {
          name: name,
          guard_name: guardName,
        },

        headers,
      );

      if (response.data.success) {
        toast.success("Role created successfully");

        onSuccess();
      }
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Create role failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="role-modal">
        <div className="modal-header">
          <h3>➕ Create Role</h3>

          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Role Name</label>

            <input
              type="text"
              placeholder="Example: Admin"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Guard Name</label>

            <select
              value={guardName}
              onChange={(e) => setGuardName(e.target.value)}
            >
              <option value="sanctum">sanctum</option>

              <option value="web">web</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Saving..." : "Save Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModal;
