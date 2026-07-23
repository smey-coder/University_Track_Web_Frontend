import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const GradeModal = ({ submission, onClose, onSuccess, toastStyles }) => {
  const API_URL = "http://192.168.100.39:8000/api/web/assignment-submissions";

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    score: submission?.score || "",

    feedback: submission?.feedback || "",
  });

  // ==============================
  // HEADER
  // ==============================

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // ==============================
  // CHANGE
  // ==============================

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  // ==============================
  // SUBMIT GRADE
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.score === "") {
      toast.error("Please enter score");

      return;
    }

    try {
      setLoading(true);

      const response = await axios.put(
        `${API_URL}/${submission.id}/grade`,

        {
          score: form.score,

          feedback: form.feedback,

          status: "Graded",
        },

        getHeaders(),
      );

      if (response.data.success) {
        toast.success(
          "Submission graded successfully",

          {
            style: toastStyles.success,
          },
        );

        setTimeout(() => {
          onSuccess();
        }, 700);
      }
    } catch (error) {
      console.log(error.response);

      if (error.response?.status === 403) {
        toast.error("You cannot grade this submission", {
          style: toastStyles.error,
        });
      } else {
        toast.error(
          error.response?.data?.message || "Grade failed",

          {
            style: toastStyles.error,
          },
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="submission-modal">
        <div className="modal-header">
          <h3>📝 Grade Submission</h3>

          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        <form className="submission-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Student</label>

            <input
              type="text"
              disabled
              value={`${submission?.student?.first_name_english || ""}
                        ${submission?.student?.last_name_english || ""}`}
            />
          </div>

          <div className="form-group">
            <label>Assignment</label>

            <input
              type="text"
              disabled
              value={submission?.assignment?.title || ""}
            />
          </div>

          <div className="form-group">
            <label>Score</label>

            <input
              type="number"
              name="score"
              min="0"
              max={submission?.assignment?.total_score || 100}
              value={form.score}
              onChange={handleChange}
              required
            />

            <small>
              Maximum score:
              {submission?.assignment?.total_score || 100}
            </small>
          </div>

          <div className="form-group">
            <label>Feedback</label>

            <textarea
              name="feedback"
              rows="5"
              placeholder="Write feedback..."
              value={form.feedback}
              onChange={handleChange}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Saving..." : "Submit Grade"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GradeModal;
