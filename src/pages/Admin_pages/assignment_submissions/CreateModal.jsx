import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CreateModal = ({ onClose, onSuccess, toastStyles }) => {
  const API_URL = "http://192.168.100.39:8000/api/web/assignment-submissions";

  const [assignments, setAssignments] = useState([]);

  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState(null);

  const [fileName, setFileName] = useState("");

  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const [form, setForm] = useState({
    assignment_id: "",

    content: "",
  });

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // ==============================
  // LOAD AVAILABLE ASSIGNMENTS
  // ==============================

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/available`,

        getHeaders(),
      );

      if (response.data.success) {
        setAssignments(response.data.data || []);
      }
    } catch (error) {
      toast.error("Cannot load assignments");
    }
  };

  // ==============================
  // CHANGE
  // ==============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,

      [name]: value,
    });

    if (name === "assignment_id") {
      const assignment = assignments.find((item) => item.id == value);

      setSelectedAssignment(assignment);
    }
  };

  // ==============================
  // FILE CHANGE
  // ==============================

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    const maxSize = 10 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      toast.error("File size must be less than 10MB");

      return;
    }

    setFile(selectedFile);

    setFileName(selectedFile.name);
  };

  // ==============================
  // SUBMIT
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.assignment_id) {
      toast.error("Please select assignment");

      return;
    }

    if (!form.content && !file) {
      toast.error("Please add content or upload file");

      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append(
        "assignment_id",

        form.assignment_id,
      );

      data.append(
        "content",

        form.content,
      );

      if (file) {
        data.append(
          "file",

          file,
        );
      }

      const response = await axios.post(
        `${API_URL}/create`,

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
          "📤 Assignment submitted successfully",

          {
            style: toastStyles?.success,
          },
        );

        setTimeout(() => {
          onSuccess();
        }, 700);
      }
    } catch (error) {
      console.log(error.response);

      toast.error(
        error.response?.data?.message || "Submit failed",

        {
          style: toastStyles?.error,
        },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="submission-modal">
        <div className="modal-header">
          <h3>📤 Submit Assignment</h3>

          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        <form className="submission-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Assignment</label>

            <select
              name="assignment_id"
              value={form.assignment_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Assignment</option>

              {assignments.map((assignment) => (
                <option key={assignment.id} value={assignment.id}>
                  {assignment.title}

                  {" - "}

                  {assignment.assignment_code}
                </option>
              ))}
            </select>
          </div>

          {selectedAssignment && (
            <div className="assignment-info">
              <h4>{selectedAssignment.title}</h4>

              <p>Due Date: {selectedAssignment.due_date}</p>

              <p>
                Teacher: {selectedAssignment.teacher?.first_name_english}{" "}
                {selectedAssignment.teacher?.last_name_english}
              </p>
            </div>
          )}

          <div className="form-group">
            <label>Upload File</label>

            <input
              type="file"
              accept=".pdf,.doc,.docx,.zip,.jpg,.png"
              onChange={handleFileChange}
            />

            {fileName && <small className="file-name">📎 {fileName}</small>}
          </div>

          <div className="form-group">
            <label>Content / Answer</label>

            <textarea
              name="content"
              rows="6"
              placeholder="Write your answer..."
              value={form.content}
              onChange={handleChange}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Submitting..." : "Submit Assignment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModal;
