import "./assignment_submissions.css";

const ShowModal = ({ submission, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="submission-modal show-modal">
        {/* HEADER */}

        <div className="modal-header">
          <h3>📄 Submission Details</h3>

          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        {/* CONTENT */}

        <div className="submission-detail-card">
          <div className="detail-row">
            <span>Assignment</span>

            <strong>{submission?.assignment?.title || "-"}</strong>
          </div>

          <div className="detail-row">
            <span>Assignment Code</span>

            <strong>{submission?.assignment?.assignment_code || "-"}</strong>
          </div>

          <div className="detail-row">
            <span>Course</span>

            <strong>
              {submission?.assignment?.course?.course_name || "-"}
            </strong>
          </div>

          <div className="detail-row">
            <span>Teacher</span>

            <strong>
              {submission?.assignment?.teacher?.first_name_english}{" "}
              {submission?.assignment?.teacher?.last_name_english}
            </strong>
          </div>

          <div className="detail-row">
            <span>Student</span>

            <strong>
              {submission?.student?.first_name_english}{" "}
              {submission?.student?.last_name_english}
            </strong>
          </div>

          <div className="detail-row">
            <span>Submitted Date</span>

            <strong>
              {submission?.submitted_at
                ? new Date(submission.submitted_at).toLocaleString()
                : "-"}
            </strong>
          </div>

          <div className="detail-row">
            <span>Status</span>

            <strong>
              <span
                className={`badge ${
                  submission?.status === "Graded"
                    ? "bg-success"
                    : submission?.status === "Submitted"
                      ? "bg-primary"
                      : submission?.status === "Late"
                        ? "bg-danger"
                        : "bg-secondary"
                }`}
              >
                {submission?.status}
              </span>
            </strong>
          </div>

          <div className="detail-row">
            <span>Score</span>

            <strong>
              {submission?.score !== null ? submission.score : "Not graded"}
            </strong>
          </div>

          <div className="detail-row">
            <span>Feedback</span>

            <strong>{submission?.feedback || "No feedback yet"}</strong>
          </div>
        </div>

        {/* CONTENT ANSWER */}

        <div className="content-box">
          <h4>📝 Student Answer</h4>

          <p>{submission?.content || "No content submitted"}</p>
        </div>

        {/* FILE */}

        <div className="file-box">
          <h4>📎 Attachment</h4>

          {submission?.file_path ? (
            <a
              href={`http://192.168.100.39:8000/storage/${submission.file_path}`}
              target="_blank"
              rel="noreferrer"
              className="download-file-btn"
            >
              📥 Open File
            </a>
          ) : (
            <p>No file uploaded</p>
          )}
        </div>

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
