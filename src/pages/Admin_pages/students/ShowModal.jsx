import React from "react";

const ShowModal = ({ student, onClose }) => {
  const LARAVEL_URL = "http://192.168.100.39:8000";

  const getImage = () => {
    if (student.photo_url) {
      return student.photo_url;
    }

    if (student.photo) {
      return `${LARAVEL_URL}/storage/${student.photo}`;
    }

    return "/images/default-user.png";
  };

  return (
    <div className="modal-backdrop-overlay">
      <div className="modal-content-card profile-show-card">
        {/* Profile Header */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <img
            src={getImage()}
            alt="Student Avatar"
            style={{
              width: "150px",
              height: "150px",
              objectFit: "cover",
              borderRadius: "50%",
              border: "3px solid #e2e8f0",
            }}
            onError={(e) => {
              e.target.src = "/images/default-user.png";
            }}
          />
          <h3
            style={{
              margin: "10px 0 2px",
              textAlign: "center",
            }}
          >
            {student.first_name_english} {student.last_name_english}
          </h3>
          <p
            style={{
              margin: 0,
              color: "#64748b",
            }}
          >
            {student.student_code}
          </p>
        </div>
        <hr />
        {/* Student Information */}
        <div className="profile-details-list">
          <p>
            <strong>Khmer Name:</strong>

            <span>
              {student.first_name_khmer} {student.last_name_khmer}
            </span>
          </p>

          <p>
            <strong>English Name:</strong>

            <span>
              {student.first_name_english} {student.last_name_english}
            </span>
          </p>

          <p>
            <strong>Gender:</strong>

            <span>{student.gender || "N/A"}</span>
          </p>

          <p>
            <strong>Date Of Birth:</strong>

            <span>{student.date_of_birth || "N/A"}</span>
          </p>

          <p>
            <strong>Phone:</strong>

            <span>{student.phone || "N/A"}</span>
          </p>

          <p>
            <strong>Email:</strong>

            <span>{student.email || "N/A"}</span>
          </p>

          <p>
            <strong>Department:</strong>

            <span>{student.department?.department_name_english || "N/A"}</span>
          </p>

          <p>
            <strong>Class:</strong>

            <span>{student.classes?.class_name || "N/A"}</span>
          </p>

          <p>
            <strong>Enrollment Date:</strong>

            <span>{student.enrollment_date || "N/A"}</span>
          </p>

          <p>
            <strong>Address:</strong>

            <span>{student.address || "N/A"}</span>
          </p>

          <p>
            <strong>Status:</strong>

            <span className={`status-badge ${student.status?.toLowerCase()}`}>
              {student.status}
            </span>
          </p>
        </div>

        {/* Button */}

        <div
          className="modal-action-row"
          style={{
            marginTop: "24px",
            justifyContent: "flex-end",
          }}
        >
          <button onClick={onClose} className="pagination-nav-btn">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowModal;
