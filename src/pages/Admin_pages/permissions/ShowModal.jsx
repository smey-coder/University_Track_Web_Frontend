import "./permissions.css";

const ShowModal = ({ permission, onClose }) => {
  if (!permission) return null;

  return (
    <div className="permission-modal-overlay">
      <div className="permission-modal-card show-card">
        {/* ===============================
            HEADER
        =============================== */}

        <div className="permission-modal-header">
          <div>
            <h3>🔐 Permission Details</h3>

            <p>View permission information.</p>
          </div>

          <button className="permission-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* ===============================
            CONTENT
        =============================== */}

        <div className="permission-detail-body">
          <div className="detail-item">
            <span>ID</span>

            <strong>{permission.id}</strong>
          </div>

          <div className="detail-item">
            <span>Permission Name</span>

            <strong>{permission.name}</strong>
          </div>

          <div className="detail-item">
            <span>Guard Name</span>

            <strong>
              <span className="guard-badge">{permission.guard_name}</span>
            </strong>
          </div>

          <div className="detail-item">
            <span>Created At</span>

            <strong>{new Date(permission.created_at).toLocaleString()}</strong>
          </div>

          <div className="detail-item">
            <span>Updated At</span>

            <strong>{new Date(permission.updated_at).toLocaleString()}</strong>
          </div>
        </div>

        {/* ===============================
            FOOTER
        =============================== */}

        <div className="permission-modal-footer">
          <button className="permission-cancel-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowModal;
