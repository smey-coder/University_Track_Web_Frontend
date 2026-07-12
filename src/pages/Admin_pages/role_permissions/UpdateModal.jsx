import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateModal = ({ role, onClose, onSuccess }) => {
  const [permissions, setPermissions] = useState([]);

  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [loading, setLoading] = useState(false);

  const API_URL = "http://192.168.100.39:8000/api/web";

  const headers = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  // =====================================
  // LOAD ALL PERMISSIONS
  // AND CURRENT ROLE PERMISSIONS
  // =====================================

  const loadData = async () => {
    try {
      const allPermission = await axios.get(
        `${API_URL}/permissions?all=true`,
        headers
      );

      const rolePermission = await axios.get(
        `${API_URL}/roles/${role.id}/permissions`,
        headers
      );

      if (allPermission.data.success) {
        setPermissions(allPermission.data.data);
      }

      if (rolePermission.data.success) {
        setSelectedPermissions(rolePermission.data.data.permissions);
      }
    } catch (error) {
      console.error(error);
      toast.error("Cannot load permissions");
    }
  };

  useEffect(() => {
    if (role) {
      loadData();
    }
  }, [role]);

  // =====================================
  // CHECKBOX CHANGE
  // =====================================

  const handleCheckbox = (permission) => {
    if (selectedPermissions.includes(permission)) {
      setSelectedPermissions(
        selectedPermissions.filter((item) => item !== permission),
      );
    } else {
      setSelectedPermissions([...selectedPermissions, permission]);
    }
  };

  // =====================================
  // UPDATE
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        toast.success("Role permissions updated");

        onSuccess();
      }
    } catch (error) {
      console.error(error);

      toast.error("Update permission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="permission-modal">
        <div className="modal-header">
          <h3>✏ Update Role Permission</h3>

          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        <div className="role-selected">
          Role :<strong>{role?.name}</strong>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="permission-list">
            {permissions?.map((permission) => (
              <label key={permission.id} className="permission-item">
                <input
                  type="checkbox"
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
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;
