import { useEffect } from "react";

import "./schedule.css";

const ShowModal = ({ schedule, onClose }) => {
  // ==========================
  // ESC CLOSE
  // ==========================

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKey);

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);

      document.body.style.overflow = "auto";
    };
  }, []);

  if (!schedule) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="schedule-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}

        <div className="modal-header">
          <div>
            <h2>🕒 Schedule Detail</h2>

            <p>Subject teaching information</p>
          </div>

          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        {/* CONTENT */}

        <div className="schedule-detail-grid">
          <div className="detail-card">
            <span>📖 Course</span>

            <h3>{schedule.course?.course_name || "-"}</h3>

            <p>
              Code:
              {schedule.course?.course_code || "-"}
            </p>
          </div>

          <div className="detail-card">
            <span>🏫 Class</span>

            <h3>{schedule.class?.class_name || "-"}</h3>

            <p>
              Room:
              {schedule.class?.room || "-"}
            </p>
          </div>

          <div className="detail-card">
            <span>📚 Semester</span>

            <h3>{schedule.semester?.semester_name || "-"}</h3>
          </div>

          <div className="detail-card">
            <span>👨‍🏫 Teacher</span>

            <h3>{schedule.teacher?.full_name_english || "-"}</h3>

            <p>{schedule.teacher?.email || ""}</p>
          </div>
        </div>

        {/* TIME SECTION */}

        <div className="time-card">
          <h3>🕒 Class Time</h3>

          <div className="time-display">
            <div>
              <label>Day</label>

              <strong>{schedule.day_of_week || "-"}</strong>
            </div>

            <div>
              <label>Start</label>

              <strong>{schedule.start_time || "-"}</strong>
            </div>

            <div>
              <label>End</label>

              <strong>{schedule.end_time || "-"}</strong>
            </div>

            <div>
              <label>Room</label>

              <strong>
                🏫
                {schedule.room || "-"}
              </strong>
            </div>
          </div>
        </div>

        {/* STATUS */}

        <div className="schedule-status">
          <label>Status</label>

          <span
            className={
              schedule.status === "active" ? "status-active" : "status-finished"
            }
          >
            {schedule.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ShowModal;
