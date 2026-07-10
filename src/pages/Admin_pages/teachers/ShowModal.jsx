import React from "react";

const ShowModal = ({ teacher = {}, onClose }) => {
  /* =====================================
      FALLBACK FOR EMPTY TEACHER OBJECT
  ===================================== */
  if (!teacher || Object.keys(teacher).length === 0) {
    return (
      <div className="modal-backdrop-overlay">
        <div className="modal-content-card">
          <h3>Profile Error</h3>
          <p className="table-empty-fallback">No teacher record found.</p>
          <div className="modal-action-row">
            <button className="pagination-nav-btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =====================================
      RENDER VIEW PROFILE
  ===================================== */
  return (
    <div className="modal-backdrop-overlay">
      <div className="modal-content-card" style={{ maxWidth: "650px" }}>
        {/* Modal Header */}
        <div
          className="registry-header-panel"
          style={{
            marginBottom: "20px",
            borderBottom: "1px solid #e2e8f0",
            paddingBottom: "12px",
          }}
        >
          <div>
            <h2>Teacher Profile Sheet</h2>
            <p>System Record Identification: #{teacher.id}</p>
          </div>
          <span
            className={`status-badge ${teacher.status?.toLowerCase() === "active" ? "active" : "suspended"}`}
          >
            {teacher.status || "Unknown"}
          </span>
        </div>

        {/* Profile Details Layout Grid */}
        <div className="swal-form-grid" style={{ gap: "16px 24px" }}>
          {/* Avatar Preview Section */}
          <div
            style={{
              gridColumn: "span 2",
              display: "flex",
              justifyContent: "center",
              marginBottom: "10px",
            }}
          >
            <div className="image-preview-wrapper" style={{ margin: 0 }}>
              <img
                src={
                  teacher.photo_url ||
                  "https://via.placeholder.com/140?text=No+Photo"
                }
                alt={`${teacher.first_name_english} Profile`}
                className="avatar-preview-circle"
                style={{
                  width: "120px",
                  height: "120px",
                  border: "3px solid #2563eb",
                  objectFit:"cover",
                            borderRadius:"50%",
                            border:
                            "3px solid #e2e8f0"
                }}
              />
            </div>
          </div>

          {/* Primary Institutional Key */}
          <div>
            <label
              style={{
                fontWeight: "600",
                color: "#64748b",
                fontSize: "0.85rem",
                display: "block",
              }}
            >
              Teacher Code
            </label>
            <p
              style={{
                margin: "4px 0",
                fontSize: "1rem",
                fontWeight: "700",
                color: "#0f172a",
              }}
            >
              {teacher.teacher_code || "—"}
            </p>
          </div>

          {/* Gender */}
          <div>
            <label
              style={{
                fontWeight: "600",
                color: "#64748b",
                fontSize: "0.85rem",
                display: "block",
              }}
            >
              Gender
            </label>
            <p style={{ margin: "4px 0", fontSize: "1rem", color: "#334155" }}>
              {teacher.gender || "—"}
            </p>
          </div>

          {/* English Name Structure */}
          <div>
            <label
              style={{
                fontWeight: "600",
                color: "#64748b",
                fontSize: "0.85rem",
                display: "block",
              }}
            >
              Full Name (English)
            </label>
            <p style={{ margin: "4px 0", fontSize: "1rem", color: "#334155" }}>
              {teacher.first_name_english || ""}{" "}
              {teacher.last_name_english || ""}
            </p>
          </div>

          {/* Khmer Name Structure */}
          <div>
            <label
              style={{
                fontWeight: "600",
                color: "#64748b",
                fontSize: "0.85rem",
                display: "block",
              }}
            >
              Full Name (Khmer)
            </label>
            <p
              style={{
                margin: "4px 0",
                fontSize: "1rem",
                color: "#334155",
                fontWeight: "500",
              }}
            >
              {teacher.first_name_khmer} {teacher.last_name_khmer}
            </p>
          </div>

          {/* Core Institutional Assignments */}
          <div>
            <label
              style={{
                fontWeight: "600",
                color: "#64748b",
                fontSize: "0.85rem",
                display: "block",
              }}
            >
              Department
            </label>
            <p style={{ margin: "4px 0", fontSize: "1rem", color: "#334155" }}>
              {teacher.department?.department_name_english ||
                teacher.department_id ||
                "—"}
            </p>
          </div>

          <div>
            <label
              style={{
                fontWeight: "600",
                color: "#64748b",
                fontSize: "0.85rem",
                display: "block",
              }}
            >
              Assigned Class
            </label>
            <p style={{ margin: "4px 0", fontSize: "1rem", color: "#334155" }}>
              {teacher.class?.class_name || teacher.class_id || "—"}
            </p>
          </div>

          {/* Chronological Landmarks */}
          <div>
            <label
              style={{
                fontWeight: "600",
                color: "#64748b",
                fontSize: "0.85rem",
                display: "block",
              }}
            >
              Date of Birth
            </label>
            <p style={{ margin: "4px 0", fontSize: "1rem", color: "#334155" }}>
              {teacher.date_of_birth || "—"}
            </p>
          </div>

          <div>
            <label
              style={{
                fontWeight: "600",
                color: "#64748b",
                fontSize: "0.85rem",
                display: "block",
              }}
            >
              Hire Date
            </label>
            <p style={{ margin: "4px 0", fontSize: "1rem", color: "#334155" }}>
              {teacher.hire_date || "—"}
            </p>
          </div>

          {/* Direct Communications Matrix */}
          <div>
            <label
              style={{
                fontWeight: "600",
                color: "#64748b",
                fontSize: "0.85rem",
                display: "block",
              }}
            >
              Email Address
            </label>
            <p
              style={{
                margin: "4px 0",
                fontSize: "1rem",
                color: "#2563eb",
                wordBreak: "break-all",
              }}
            >
              {teacher.email || "—"}
            </p>
          </div>

          <div>
            <label
              style={{
                fontWeight: "600",
                color: "#64748b",
                fontSize: "0.85rem",
                display: "block",
              }}
            >
              Phone Number
            </label>
            <p style={{ margin: "4px 0", fontSize: "1rem", color: "#334155" }}>
              {teacher.phone || "—"}
            </p>
          </div>

          {/* Residential Address Spans both columns */}
          <div style={{ gridColumn: "span 2" }}>
            <label
              style={{
                fontWeight: "600",
                color: "#64748b",
                fontSize: "0.85rem",
                display: "block",
              }}
            >
              Residential Address
            </label>
            <p
              style={{
                margin: "4px 0",
                fontSize: "1rem",
                color: "#334155",
                lineHeight: "1.5",
              }}
            >
              {teacher.address || "—"}
            </p>
          </div>

          {/* Modal Actions Footer row */}
          <div
            className="modal-action-row"
            style={{
              gridColumn: "span 2",
              marginTop: "12px",
              borderTop: "1px solid #e2e8f0",
              paddingTop: "16px",
            }}
          >
            <button
              type="button"
              className="pagination-nav-btn"
              onClick={onClose}
              style={{ padding: "10px 24px" }}
            >
              Dismiss View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowModal;
