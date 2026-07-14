import "./course.css";

const ShowModal = ({ course, onClose }) => {
  if (!course) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="course-modal show-modal">
        {/* HEADER */}

        <div className="modal-header">
          <h3>📚 Course Detail</h3>

          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        <div className="course-detail">
          <div className="detail-item">
            <label>Course Code</label>

            <p>{course.course_code}</p>
          </div>

          <div className="detail-item">
            <label>Course Name</label>

            <p>{course.course_name}</p>
          </div>

          <div className="detail-item">
            <label>Department</label>

            <p>
              {course.department
                ? course.department.department_name_english
                : "N/A"}
            </p>
          </div>

          <div className="detail-item">
            <label>Teacher</label>

            <p>
              {course.teacher
                ? `${course.teacher.first_name_english}
 ${course.teacher.last_name_english}`
                : "N/A"}
            </p>
          </div>

          <div className="detail-item">
            <label>Credits</label>

            <p>{course.credits}</p>
          </div>

          <div className="detail-item">
            <label>Description</label>

            <p>{course.description ? course.description : "No description"}</p>
          </div>

          <div className="detail-item">
            <label>Status</label>

            <span
              className={
                course.status === "Active" ? "status active" : "status inactive"
              }
            >
              {course.status}
            </span>
          </div>
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
