import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateModal = ({ submission, onClose, onSuccess, toastStyles }) => {
  const API_URL = "http://192.168.100.39:8000/api/web/assignment-submissions";

  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState(null);

  const [form, setForm] = useState({
    content: submission?.content || "",
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
  // UPDATE
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submission.status === "Graded") {
      toast.error("Cannot update graded submission");

      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("content", form.content);

      if (file) {
        data.append("file", file);
      }

      data.append("_method", "PUT");

      const response = await axios.post(
        `${API_URL}/update/${submission.id}`,

        data,

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,

            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        toast.success(
          "Submission updated successfully",

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
        toast.error("Permission denied");
      } else if (error.response?.status === 422) {
        Object.values(error.response.data.errors)
          .flat()
          .forEach((msg) => {
            toast.error(msg);
          });
      } else {
        toast.error("Update submission failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="submission-modal">
        <div className="modal-header">
          <h3>✏ Update Submission</h3>

          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        <form className="submission-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Assignment</label>

            <input type="text" disabled value={submission?.assignment?.title} />
          </div>

          <div className="form-group">
            <label>Current File</label>

            {submission?.file_path ? (
              <a
                href={`http://192.168.100.39:8000/storage/${submission.file_path}`}
                target="_blank"
                rel="noreferrer"
              >
                📄 View File
              </a>
            ) : (
              <p>No file uploaded</p>
            )}
          </div>

          <div className="form-group">
            <label>Replace File</label>

            <input
              type="file"
              accept=".pdf,.doc,.docx,.zip,.jpg,.png"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <div className="form-group">
            <label>Content</label>

            <textarea
              name="content"
              rows="5"
              value={form.content}
              onChange={handleChange}
              placeholder="Update your answer..."
            ></textarea>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Updating..." : "Update Submission"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;
