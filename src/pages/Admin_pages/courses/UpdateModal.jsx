import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateModal = ({ course, onClose, onSuccess, toastStyles }) => {
  const BASE_URL = "http://192.168.100.39:8000/api/web/courses";

  // ============================
  // STATE
  // ============================

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

  // ============================
  // HEADER
  // ============================

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // ============================
  // LOAD DATA
  // ============================

  useEffect(() => {
    if (course) {
      setForm({
        course_code: course.course_code || "",

        department_id: course.department_id || "",

        teacher_id: course.teacher_id || "",

        course_name: course.course_name || "",

        credits: course.credits || "",

        description: course.description || "",

        status: course.status || "Active",
      });
    }

    loadDependencies();
  }, [course]);

  const loadDependencies = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/create-data`,

        getHeaders(),
      );

      if (response.data.success) {
        setDepartments(response.data.departments);

        setTeachers(response.data.teachers);
      }
    } catch (error) {
      console.log(error);

      toast.error("Failed loading form data");
    }
  };

  // ============================
  // INPUT CHANGE
  // ============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,

      [name]: value,
    });
  };

  // ============================
  // UPDATE
  // ============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.put(
        `${BASE_URL}/update/${course.id}`,

        form,

        getHeaders(),
      );

      if (response.data.success) {
        toast.success(
          "Course updated successfully",

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
          "Please check your input",

          {
            style: toastStyles.error,
          },
        );
      } else {
        toast.error(
          "Update course failed",

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
          <h3>✏️ Update Course</h3>

          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        <form className="course-form" onSubmit={handleSubmit}>
          {/* COURSE CODE */}

          <div className="form-group">
            <label>Course Code</label>

            <input
              type="text"
              name="course_code"
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

          {/* COURSE NAME */}

          <div className="form-group">
            <label>Course Name</label>

            <input
              type="text"
              name="course_name"
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
              {loading ? "Updating..." : "Update Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;
