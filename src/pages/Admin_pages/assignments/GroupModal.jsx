import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const GroupModal = ({ assignment, onClose, onSuccess, toastStyles }) => {
  const API_URL = "http://192.168.100.39:8000/api/web/assignment-groups";

  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    assignment_id: "",

    group_name: "",

    leader_student_id: "",

    members: [],
  });

  // =============================
  // HEADER
  // =============================

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // =============================
  // LOAD STUDENTS
  // =============================

  useEffect(() => {
    if (assignment) {
      setForm((prev) => ({
        ...prev,

        assignment_id: assignment.id,
      }));

      loadStudents();
    }
  }, [assignment]);

  const loadStudents = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/assignments/${assignment.id}/available-students`,
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

  // =============================
  // INPUT
  // =============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,

      [name]: value,
    });
  };

  // =============================
  // SELECT MEMBER
  // =============================

  const selectMember = (id) => {
    let members = [...form.members];

    if (members.includes(id)) {
      members = members.filter((item) => item !== id);
    } else {
      members.push(id);
    }

    setForm({
      ...form,

      members,
    });
  };

  // =============================
  // SAVE
  // =============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post(
        API_URL,

        form,

        getHeaders(),
      );

      if (response.data.success) {
        toast.success("Group created successfully", {
          style: toastStyles?.success,
        });

        onSuccess();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Create group failed",

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
        <div className="modal-header">
          <h3>👥 Create Assignment Group</h3>

          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        <form className="assignment-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Assignment</label>

            <input value={assignment?.title || ""} disabled />
          </div>

          <div className="form-group">
            <label>Group Name</label>

            <input
              name="group_name"
              value={form.group_name}
              onChange={handleChange}
              placeholder="Example: Group A"
              required
            />
          </div>

          <div className="form-group">
            <label>Leader</label>

            <select
              name="leader_student_id"
              value={form.leader_student_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Leader</option>

              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.first_name_english} {student.last_name_english}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Members</label>

            <div className="student-list">
              {students.map((student) => (
                <label key={student.id} className="student-item">
                  <input
                    type="checkbox"
                    checked={form.members.includes(student.id)}
                    onChange={() => selectMember(student.id)}
                  />
                  {student.first_name_english} {student.last_name_english}
                </label>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Creating..." : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupModal;
