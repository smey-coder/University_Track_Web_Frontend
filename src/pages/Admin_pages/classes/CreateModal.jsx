import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CreateModal = ({
  departments,
  semesters,
  academicYears,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    academic_year_id: "",
    semester_id: "",
    department_id: "",
    class_name: "",
    room: "",
    max_students: "",
    status: 1,
  });

  const API = "http://192.168.100.39:8000/api/web/classes";

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(
        API,

        form,

        config,
      );

      toast.success("Class created successfully");

      onSuccess();
    } catch (error) {
      console.log(error.response);

      toast.error(error.response?.data?.message || "Create class failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="class-modal">
        <div className="modal-header">
          <h2>➕ Create New Class</h2>

          <button onClick={onClose}>✖</button>
        </div>

        <form onSubmit={submit}>
          {/* Academic Year */}

          <label>Academic Year</label>

          <select
            name="academic_year_id"
            value={form.academic_year_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Academic Year</option>

            {academicYears.map((item) => (
              <option key={item.id} value={item.id}>
                {item.academic_year}
              </option>
            ))}
          </select>

          {/* Semester */}

          <label>Semester</label>

          <select
            name="semester_id"
            value={form.semester_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Semester</option>

            {semesters.map((item) => (
              <option key={item.id} value={item.id}>
                {item.semester_name}
              </option>
            ))}
          </select>

          {/* Department */}

          <label>Department</label>

          <select
            name="department_id"
            value={form.department_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>

            {departments.map((item) => (
              <option key={item.id} value={item.id}>
                {item.department_name_english}
              </option>
            ))}
          </select>

          {/* Class Name */}

          <label>Class Name</label>

          <input
            type="text"
            name="class_name"
            placeholder="Example: Com3ES2"
            value={form.class_name}
            onChange={handleChange}
            required
          />

          {/* Room */}

          <label>Room</label>

          <input
            type="text"
            name="room"
            placeholder="Example: A302"
            value={form.room}
            onChange={handleChange}
          />

          {/* Max Students */}

          <label>Maximum Students</label>

          <input
            type="number"
            name="max_students"
            placeholder="40"
            value={form.max_students}
            onChange={handleChange}
            required
          />

          {/* Status */}

          <label>Status</label>

          <select name="status" value={form.status} onChange={handleChange}>
            <option value="1">Active</option>

            <option value="0">Inactive</option>
          </select>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Creating..." : "Create Class"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModal;
