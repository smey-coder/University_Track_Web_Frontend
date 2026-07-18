import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ShowModal = ({ data, onClose }) => {
  const API = "http://192.168.100.39:8000/api/web/class-managers";

  const [detail, setDetail] = useState(null);

  const [loading, setLoading] = useState(true);

  const headers = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  // ==============================
  // LOAD DETAIL
  // ==============================

  const fetchDetail = async () => {
    try {
      const response = await axios.get(
        `${API}/show/${data.id}`,

        headers,
      );

      if (response.data.success) {
        setDetail(response.data.data);
      }
    } catch (error) {
      console.log(error);

      toast.error("Cannot load detail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      fetchDetail();
    }
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-box show-modal">
        <div className="modal-header">
          <h2>👨‍🎓 Student Class Information</h2>

          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        {loading ? (
          <div className="loading-text">Loading...</div>
        ) : (
          <div className="detail-content">
            <div className="profile-section">
              <div className="avatar">
                {detail?.student?.student_code?.charAt(0)}
              </div>

              <div>
                <h3>{detail?.student?.first_name_english}</h3>

                <p>
                  ID:
                  <strong>{detail?.student?.student_code}</strong>
                </p>
              </div>
            </div>

            <div className="detail-grid">
              <div className="detail-card">
                <span>Department</span>

                <strong>
                  {detail?.student_class?.department?.department_name_english ||
                    "N/A"}
                </strong>
              </div>

              <div className="detail-card">
                <span>Class</span>

                <strong>{detail?.student_class?.class_name || "N/A"}</strong>
              </div>

              <div className="detail-card">
                <span>Academic Year</span>

                <strong>
                  {detail?.student_class?.academic_year?.year || "N/A"}
                </strong>
              </div>

              <div className="detail-card">
                <span>Semester</span>

                <strong>
                  {detail?.student_class?.semester?.name || "N/A"}
                </strong>
              </div>

              <div className="detail-card">
                <span>Assigned Date</span>

                <strong>{detail?.assigned_date}</strong>
              </div>

              <div className="detail-card">
                <span>Status</span>

                <strong className="status-active">{detail?.status}</strong>
              </div>
            </div>
          </div>
        )}

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
