import { useEffect, useState } from "react";
import axios from "axios";

const ClassStatistics = ({ classId, onClose }) => {
  const [statistics, setStatistics] = useState(null);

  const [loading, setLoading] = useState(true);

  const API = "http://192.168.100.39:8000/api/web/classes";

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  // =========================
  // LOAD STATISTICS
  // =========================

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(
        `${API}/${classId}/statistics`,

        config,
      );

      if (response.data.success) {
        setStatistics(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  return (
    <div className="modal-overlay">
      <div className="class-modal">
        <div className="modal-header">
          <h2>📊 Class Statistics</h2>

          <button onClick={onClose}>✖</button>
        </div>

        {loading ? (
          <div className="loading">Loading statistics...</div>
        ) : (
          <div className="statistics-container">
            {/* Maximum */}

            <div className="statistics-card">
              <span>Maximum Students</span>

              <strong>{statistics?.max_students || 0}</strong>
            </div>

            {/* Current */}

            <div className="statistics-card">
              <span>Current Students</span>

              <strong>
                👨‍🎓
                {statistics?.current_students || 0}
              </strong>
            </div>

            {/* Remaining */}

            <div className="statistics-card">
              <span>Available Seats</span>

              <strong>{statistics?.available_seats || 0}</strong>
            </div>

            {/* Occupancy */}

            <div className="statistics-card">
              <span>Occupancy</span>

              <strong>{statistics?.occupancy || 0}%</strong>
            </div>

            {/* Progress */}

            <div className="occupancy-box">
              <h4>Student Capacity</h4>

              <div className="progress">
                <div
                  className="progress-bar"
                  style={{
                    width: `${statistics?.occupancy || 0}%`,
                  }}
                ></div>
              </div>
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

export default ClassStatistics;
