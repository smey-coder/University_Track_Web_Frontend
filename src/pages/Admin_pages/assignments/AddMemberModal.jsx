import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AddMemberModal = ({ group, onClose, onSuccess, toastStyles }) => {
  const API_URL = "http://192.168.100.39:8000/api/web/assignment-groups";

  const [students, setStudents] = useState([]);

  const [selectedStudents, setSelectedStudents] = useState([]);

  const [loading, setLoading] = useState(false);

  // ==========================
  // HEADER
  // ==========================

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // ==========================
  // LOAD AVAILABLE STUDENTS
  // ==========================

  useEffect(() => {
    if (group) {
      loadStudents();
    }
  }, [group]);

  const loadStudents = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/assignments/${group.assignment_id}/available-students`,

        getHeaders(),
      );

      if (response.data.success) {
        setStudents(response.data.data);
      }
    } catch (error) {
      console.log(error.response);

      toast.error("Cannot load students");
    }
  };

  // ==========================
  // SELECT STUDENT
  // ==========================

  const toggleStudent = (id) => {
    let data = [...selectedStudents];

    if (data.includes(id)) {
      data = data.filter((item) => item !== id);
    } else {
      data.push(id);
    }

    setSelectedStudents(data);
  };

  // ==========================
  // SAVE MEMBERS
  // ==========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedStudents.length === 0) {
      toast.error("Please select students");

      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/assignment-groups/${group.id}/members`,

        {
          students: selectedStudents,
        },

        getHeaders(),
      );

      if (response.data.success) {
        toast.success("Members added successfully", {
          style: toastStyles?.success,
        });

        onSuccess();
      }
    } catch (error) {
      console.log(error.response);

      toast.error(
        error.response?.data?.message || "Add members failed",

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
      <div className="assignment-modal">
        {/* HEADER */}

        <div className="modal-header">
          <h3>➕ Add Group Members</h3>

          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        <form className="assignment-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Group</label>

            <input value={group?.group_name || ""} disabled />
          </div>

          <div className="form-group">
            <label>Select Students</label>

            <div className="student-list">
              {students.length === 0 ? (
                <p>No available students</p>
              ) : (
                students.map((student) => (
                  <label key={student.id} className="student-item">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => toggleStudent(student.id)}
                    />{" "}
                    {student.first_name_english} {student.last_name_english}
                    <small>({student.student_code})</small>
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Adding..." : "Add Members"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;
