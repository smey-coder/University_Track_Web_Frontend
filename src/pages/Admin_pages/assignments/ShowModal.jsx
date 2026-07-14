import "./assignment.css";

const ShowModal = ({ assignment, onClose }) => {
  if (!assignment) return null;

  return (
    <div className="modal-overlay">
      <div className="assignment-modal show-modal">
        {/* HEADER */}

        <div className="modal-header">
          <h3>📝 Assignment Details</h3>

          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        {/* BODY */}

        <div className="show-content">
          <div className="show-row">
            <strong>Assignment Code:</strong>

            <span>{assignment.assignment_code}</span>
          </div>

          <div className="show-row">
            <strong>Course:</strong>

            <span>
              {assignment.course?.course_code}

              {" - "}

              {assignment.course?.course_name}
            </span>
          </div>

          <div className="show-row">
            <strong>Teacher:</strong>

            <span>
              {assignment.teacher?.first_name_english}{" "}
              {assignment.teacher?.last_name_english}
            </span>
          </div>

          <div className="show-row">
            <strong>Title:</strong>

            <span>{assignment.title}</span>
          </div>

          <div className="show-row">
            <strong>Description:</strong>

            <span>{assignment.description || "No description"}</span>
          </div>

          <div className="show-row">
            <strong>Due Date:</strong>

            <span>{assignment.due_date}</span>
          </div>

          <div className="show-row">
            <strong>Total Score:</strong>

            <span>{assignment.total_score}</span>
          </div>

          <div className="show-row">
            <strong>Status:</strong>

            <span
              className={`badge ${
                assignment.status === "Open" ? "bg-success" : "bg-danger"
              }`}
            >
              {assignment.status}
            </span>
          </div>
        </div>

        {/* FOOTER */}

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowModal;
