import { useEffect, useState } from "react";
import axios from "axios";

const ShowModal = ({ classData, onClose }) => {
  const [detail, setDetail] = useState(null);

  const [loading, setLoading] = useState(true);

  const API = "http://192.168.100.39:8000/api/web/classes";

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  // =========================
  // LOAD CLASS DETAIL
  // =========================

  const fetchDetail = async () => {
    try {
      const response = await axios.get(
        `${API}/${classData.id}`,

        config,
      );

      if (response.data.success) {
        setDetail(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  return (
    <div className="modal-overlay">
      <div className="class-modal show-modal">
        <div className="modal-header">
          <h2>📚 Class Information</h2>

          <button onClick={onClose}>✖</button>
        </div>

        {loading ? (
          <div className="loading">Loading information...</div>
        ) : (
          <div className="class-detail-card">
            <div className="detail-item">
              <span>Class Name</span>

              <strong>{detail?.class_name}</strong>
            </div>

            <div className="detail-item">
              <span>Department</span>

              <strong>
                {detail?.department?.department_name_english || "N/A"}
              </strong>
            </div>

            <div className="detail-item">
              <span>Academic Year</span>

              <strong>{detail?.academic_year?.academic_year || "N/A"}</strong>
            </div>

            <div className="detail-item">
              <span>Semester</span>

              <strong>{detail?.semester?.semester_name || "N/A"}</strong>
            </div>

            <div className="detail-item">
              <span>Room</span>

              <strong>{detail?.room || "-"}</strong>
            </div>

            <div className="detail-item">
              <span>Maximum Students</span>

              <strong>{detail?.max_students || 0}</strong>
            </div>

            <div className="detail-item">
              <span>Current Students</span>

              <strong>
                👨‍🎓
                {detail?.students_count || 0}
              </strong>
            </div>

            <div className="detail-item">
              <span>Status</span>

              <strong
                className={
                  detail?.status === "Active"
                    ? "status-active"
                    : "status-inactive"
                }
              >
                {detail?.status}
              </strong>
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowModal;
