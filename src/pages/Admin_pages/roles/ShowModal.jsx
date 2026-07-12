import "./roles.css";

const ShowModal = ({ role, onClose }) => {
  if (!role) return null;

  return (
    <div className="modal-overlay">
      <div className="role-modal show-modal">
        {/* HEADER */}

        <div className="modal-header">
          <h3>🛡 Role Details</h3>

          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        {/* CONTENT */}

        <div className="role-details">
          <div className="detail-row">
            <strong>ID:</strong>

            <span>{role.id}</span>
          </div>

          <div className="detail-row">
            <strong>Role Name:</strong>

            <span className="role-name-badge">{role.name}</span>
          </div>

          <div className="detail-row">
            <strong>Guard Name:</strong>

            <span>{role.guard_name}</span>
          </div>

          <div className="detail-row">
            <strong>Created:</strong>

            <span>
              {role.created_at
                ? new Date(role.created_at).toLocaleString()
                : "N/A"}
            </span>
          </div>

          <div className="detail-row">
            <strong>Updated:</strong>

            <span>
              {role.updated_at
                ? new Date(role.updated_at).toLocaleString()
                : "N/A"}
            </span>
          </div>
        </div>

        {/* FOOTER */}

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
