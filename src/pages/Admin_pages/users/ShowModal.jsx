import { useEffect, useState } from "react";
import axios from "axios";

const ShowModal = ({ user, onClose }) => {
  const [userData, setUserData] = useState(user);

  const [loading, setLoading] = useState(true);

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `http://192.168.100.39:8000/api/web/users/${user.id}`,

        getHeaders(),
      );

      if (response.data.success) {
        setUserData(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-container show-modal">
        <h2>User Details</h2>

        {loading ? (
          <h3>Loading...</h3>
        ) : (
          <>
            <div className="detail-row">
              <strong>ID:</strong>

              <span>{userData.id}</span>
            </div>

            <div className="detail-row">
              <strong>Username:</strong>

              <span>{userData.username}</span>
            </div>

            <div className="detail-row">
              <strong>Email:</strong>

              <span>{userData.email}</span>
            </div>

            <div className="detail-row">
              <strong>Status:</strong>

              <span
                className={`status-badge ${
                  userData.is_active ? "active" : "inactive"
                }`}
              >
                {userData.is_active ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="detail-section">
              <h3>Roles</h3>

              {userData.roles?.length > 0 ? (
                userData.roles.map((role) => (
                  <span key={role.id} className="role-badge">
                    {role.name}
                  </span>
                ))
              ) : (
                <p>No role assigned</p>
              )}
            </div>

            <div className="detail-section">
              <h3>Permissions</h3>

              <div className="permission-list">
                {userData.roles?.map((role) =>
                  role.permissions?.map((permission) => (
                    <span key={permission.id} className="permission-badge">
                      {permission.name}
                    </span>
                  )),
                )}
              </div>
            </div>

            <div className="detail-row">
              <strong>Created:</strong>

              <span>{new Date(userData.created_at).toLocaleString()}</span>
            </div>

            <div className="detail-row">
              <strong>Updated:</strong>

              <span>{new Date(userData.updated_at).toLocaleString()}</span>
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
