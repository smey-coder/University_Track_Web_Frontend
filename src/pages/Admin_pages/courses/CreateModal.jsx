import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const CreateModal = ({ onClose, onSuccess, toastStyles }) => {
  const BASE_URL = "http://192.168.100.39:8000/api/web/courses";

  // =============================
  // STATE
  // =============================

  const [departments, setDepartments] = useState([]);

  const [teachers, setTeachers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    course_code: "",
    department_id: "",
    teacher_id: "",
    course_name: "",
    credits: "",
    description: "",
    status: "Active",
  });

  // =============================
  // TOKEN
  // =============================

  const headers = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  // =============================
  // LOAD DATA
  // =============================

  useEffect(() => {
    loadDependencies();
  }, []);

  const loadDependencies = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/create-data`,

        headers,
      );

      if (response.data.success) {
        setDepartments(response.data.departments);

        setTeachers(response.data.teachers);
      }
    } catch (error) {
      console.log(error);

      toast.error("Cannot load department and teacher");
    }
  };

  // =============================
  // CHANGE
  // =============================

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  // =============================
  // SUBMIT
  // =============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        `${BASE_URL}/create`,

        form,

        headers,
      );

      if (response.data.success) {
        toast.success(
          "Course created successfully",

          {
            style: toastStyles.success,
          },
        );

        onSuccess();
      }
    } catch (error) {
      console.log(error.response);

      if (error.response?.status === 422) {
        toast.error(
          "Please check your information",

          {
            style: toastStyles.error,
          },
        );
      } else {
        toast.error(
          "Create course failed",

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
      <div className="course-modal">
        {/* HEADER */}

        <div className="modal-header">
          <h3>➕ Create Course</h3>

          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        <form onSubmit={handleSubmit} className="course-form">
          {/* COURSE CODE */}

          <div className="form-group">
            <label>Course Code</label>

            <input
              type="text"
              name="course_code"
              placeholder="CS001"
              value={form.course_code}
              onChange={handleChange}
              required
            />
          </div>

          {/* DEPARTMENT */}

          <div className="form-group">
            <label>Department</label>

            <select
              name="department_id"
              value={form.department_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>

              {departments.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.department_name_english}
                </option>
              ))}
            </select>
          </div>

          {/* TEACHER */}

          <div className="form-group">
            <label>Teacher</label>

            <select
              name="teacher_id"
              value={form.teacher_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Teacher</option>

              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.first_name_english} {teacher.last_name_english}
                </option>
              ))}
            </select>
          </div>

          {/* NAME */}

          <div className="form-group">
            <label>Course Name</label>

            <input
              type="text"
              name="course_name"
              placeholder="Database System"
              value={form.course_name}
              onChange={handleChange}
              required
            />
          </div>

          {/* CREDIT */}

          <div className="form-group">
            <label>Credits</label>

            <input
              type="number"
              name="credits"
              placeholder="3"
              value={form.credits}
              onChange={handleChange}
              required
            />
          </div>

          {/* DESCRIPTION */}

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              rows="3"
              value={form.description}
              onChange={handleChange}
              placeholder="Description..."
            ></textarea>
          </div>

          {/* STATUS */}

          <div className="form-group">
            <label>Status</label>

            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Active">Active</option>

              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* BUTTON */}

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Saving..." : "Save Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModal;
