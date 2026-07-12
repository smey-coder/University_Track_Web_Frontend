import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ShowModal = ({ role, onClose }) => {
  const [roleData, setRoleData] = useState(null);

  const [permissions, setPermissions] = useState([]);

  const [loading, setLoading] = useState(true);

  const API_URL = "http://192.168.100.39:8000/api/web";

  const headers = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  // ==================================
  // LOAD ROLE PERMISSIONS
  // ==================================

  const fetchRolePermissions = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/roles/${role.id}/permissions`,

        headers,
      );

      if (response.data.success) {
        setRoleData(response.data.data.role);

        setPermissions(response.data.data.permissions);
      }
    } catch (error) {
      console.error(error);

      toast.error("Failed loading role permission");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role) {
      fetchRolePermissions();
    }
  }, [role]);

  return (
    <div className="modal-overlay">
      <div className="permission-modal show-modal">
        <div className="modal-header">
          <h3>👁 Role Permission Details</h3>

          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        {loading ? (
          <h3 className="loading">Loading...</h3>
        ) : (
          <>
            <div className="role-detail-card">
              <div>
                <label>Role ID</label>

                <p>{roleData?.id}</p>
              </div>

              <div>
                <label>Role Name</label>

                <p className="role-title">{roleData?.name}</p>
              </div>

              <div>
                <label>Guard</label>

                <p>{roleData?.guard_name}</p>
              </div>
            </div>

            <div className="assigned-permission">
              <h4>Assigned Permissions</h4>

              {permissions.length > 0 ? (
                <div className="permission-badge-container">
                  {permissions.map((permission, index) => (
                    <span key={index} className="permission-badge">
                      ✅ {permission}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="no-permission">No permission assigned</div>
              )}
            </div>
          </>
        )}

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowModal;
