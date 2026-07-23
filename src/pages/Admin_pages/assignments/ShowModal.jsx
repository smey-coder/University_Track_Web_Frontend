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
            <strong>Assignment Type:</strong>

            <span
              className={`assignment-type ${assignment.assignment_type?.toLowerCase()}`}
            >
              {assignment.assignment_type}
            </span>
          </div>

          <div className="show-row">
            <strong>Submission Type:</strong>

            <span
              className={`assignment-type ${assignment.submission_type?.toLowerCase()}`}
            >
              {assignment.submission_type}
            </span>
          </div>

          {/* COURSE */}

          <div className="show-row">
            <strong>Course:</strong>

            <span>
              {assignment.course?.course_code}

              {" - "}

              {assignment.course?.course_name || "-"}
            </span>
          </div>

          {/* CLASS */}

          <div className="show-row">
            <strong>Class:</strong>

            <span>{assignment.class?.class_name || "-"}</span>
          </div>

          {/* TEACHER */}

          <div className="show-row">
            <strong>Teacher:</strong>

            <span>
              {assignment.teacher
                ? `${assignment.teacher.first_name_english}
                        ${assignment.teacher.last_name_english}`
                : "-"}
            </span>
          </div>

          {/* TITLE */}

          <div className="show-row">
            <strong>Title:</strong>

            <span>{assignment.title}</span>
          </div>

          {/* DESCRIPTION */}

          <div className="show-row description-row">
            <strong>Description:</strong>

            <span>{assignment.description || "No description"}</span>
          </div>

          {/* GRADE CATEGORY */}

          <div className="show-row">
            <strong>Grade Category:</strong>

            <span>{assignment.grade_category?.name || "Not assigned"}</span>
          </div>

          {/* DATE */}

          <div className="show-row">
            <strong>Created:</strong>

            <span>
              {assignment.created_at
                ? new Date(assignment.created_at).toLocaleDateString()
                : "-"}
            </span>
          </div>

          <div className="show-row">
            <strong>Due Date:</strong>

            <span>
              {assignment.due_date
                ? new Date(assignment.due_date).toLocaleDateString()
                : "-"}
            </span>
          </div>

          {/* SCORE */}

          <div className="show-row">
            <strong>Total Score:</strong>

            <span>{assignment.total_score}</span>
          </div>

          {/* STATUS */}

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

          {/* SUBMISSION */}

          <div className="show-row">
            <strong>Submission:</strong>

            <span>
              {assignment.submissions?.length || 0}

              {" Student(s)"}
            </span>
          </div>

          {/* GROUP INFO */}

          {assignment.submission_type === "Group" && (
            <div className="show-row">
              <strong>Groups:</strong>

              <span>
                {assignment.groups?.length || 0}

                {" Group(s)"}
              </span>
            </div>
          )}
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
