import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CreateModal = ({ onClose, onSuccess }) => {
  const API = "http://192.168.100.39:8000/api/web/class-managers";

  const [students, setStudents] = useState([]);

  const [classes, setClasses] = useState([]);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    student_id: "",
    class_id: "",
    assigned_date: new Date().toISOString().split("T")[0],
  });

  const headers = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  // ==================================
  // LOAD DATA
  // ==================================

  useEffect(() => {
    fetchStudents();

    fetchClasses();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `${API}/available-students`,

        headers,
      );

      if (response.data.success) {
        setStudents(response.data.data);
      }
    } catch (error) {
      console.log(error);

      toast.error("Cannot load students");
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get(
        "http://192.168.100.39:8000/api/web/students/form-dependencies",

        headers,
      );

      if (response.data.success) {
        setClasses(response.data.classes);
      }
    } catch (error) {
      console.log(error);

      toast.error("Cannot load classes");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  // ==================================
  // SUBMIT
  // ==================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        `${API}/create`,

        form,

        headers,
      );

      if (response.data.success) {
        toast.success("Student assigned successfully");

        onSuccess();

        onClose();
      }
    } catch (error) {
      console.log(error.response);

      if (error.response?.status === 422) {
        Object.values(error.response.data.errors)
          .flat()
          .forEach((msg) => {
            toast.error(msg);
          });
      } else {
        toast.error(error.response?.data?.message || "Create failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h2>➕ Assign Student To Class</h2>

          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Student</label>

            <select
              name="student_id"
              value={form.student_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Student</option>

              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.student_code}-{student.first_name_english} {student.last_name_english}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Class</label>

            <select
              name="class_id"
              value={form.class_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Class</option>

              {classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.class_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Assigned Date</label>

            <input
              type="date"
              name="assigned_date"
              value={form.assigned_date}
              onChange={handleChange}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Saving..." : "Assign Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModal;
