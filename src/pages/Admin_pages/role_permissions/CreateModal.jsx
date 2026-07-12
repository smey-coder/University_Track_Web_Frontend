import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CreateModal = ({ role, onClose, onSuccess }) => {
  const [permissions, setPermissions] = useState([]);

  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [loading, setLoading] = useState(false);

  const API_URL = "http://192.168.100.39:8000/api/web";

  const headers = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  // ===============================
  // LOAD ALL PERMISSIONS
  // ===============================

  const fetchPermissions = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/permissions`,

        headers,
      );

      if (response.data.success) {
        setPermissions(response.data.data.data);
      }
    } catch (error) {
      toast.error("Failed loading permissions");
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  // ===============================
  // CHECKBOX
  // ===============================

  const handleCheckbox = (permission) => {
    if (selectedPermissions.includes(permission)) {
      setSelectedPermissions(
        selectedPermissions.filter((item) => item !== permission),
      );
    } else {
      setSelectedPermissions([...selectedPermissions, permission]);
    }
  };

  // ===============================
  // SAVE
  // ===============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedPermissions.length === 0) {
      toast.error("Please select permission");

      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/roles/${role.id}/permissions`,

        {
          permissions: selectedPermissions,
        },

        headers,
      );

      if (response.data.success) {
        toast.success("Permissions assigned successfully");

        onSuccess();
      }
    } catch (error) {
      console.error(error);

      toast.error("Assign permission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="permission-modal">
        <div className="modal-header">
          <h3>🔐 Assign Permission</h3>

          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        <div className="role-selected">
          Role:
          <strong>{role?.name}</strong>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="permission-list">
            {permissions.map((permission) => (
              <label key={permission.id} className="permission-item">
                <input
                  type="checkbox"
                  value={permission.name}
                  checked={selectedPermissions.includes(permission.name)}
                  onChange={() => handleCheckbox(permission.name)}
                />

                <span>{permission.name}</span>
              </label>
            ))}
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Saving..." : "Assign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModal;
