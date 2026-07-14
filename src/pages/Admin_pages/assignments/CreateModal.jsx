import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";

const CreateModal = ({ onClose, onSuccess, toastStyles }) => {
  const { user } = useAuth();

  const API_URL = "http://192.168.100.39:8000/api/web/assignments";

  const [courses, setCourses] = useState([]);

  const [teachers, setTeachers] = useState([]);

  const [filteredCourses, setFilteredCourses] = useState([]);

  const [loading, setLoading] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);

  const [form, setForm] = useState({
    course_id: "",

    teacher_id: "",

    title: "",

    description: "",

    due_date: "",

    total_score: "",

    status: "Open",
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
  // CHECK ROLE
  // ============================

  useEffect(() => {
    const roles = user?.roles || [];

    if (roles.includes("Admin")) {
      setIsAdmin(true);
    }
  }, [user]);

  // ============================
  // LOAD DATA
  // ============================

  useEffect(() => {
    loadDependencies();
  }, []);

  const loadDependencies = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/form-data`,

        getHeaders(),
      );

      if (response.data.success) {
        setCourses(response.data.courses || []);

        setTeachers(response.data.teachers || []);

        /*
        Teacher login
        */

        if (response.data.teachers.length === 1) {
          setForm((prev) => ({
            ...prev,

            teacher_id: response.data.teachers[0].id,
          }));
        }

        setFilteredCourses(response.data.courses || []);
      }
    } catch (error) {
      console.log(error);

      toast.error("Cannot load assignment data");
    }
  };

  // ============================
  // CHANGE INPUT
  // ============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,

      [name]: value,
    });

    /*
    Filter courses by teacher
    */

    if (name === "teacher_id") {
      const filter = courses.filter(
        (course) => String(course.teacher_id) === String(value),
      );

      setFilteredCourses(filter);

      setForm((prev) => ({
        ...prev,

        teacher_id: value,

        course_id: "",
      }));
    }
  };

  // ============================
  // SAVE
  // ============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      let payload = {
        course_id: form.course_id,

        title: form.title,

        description: form.description,

        due_date: form.due_date,

        total_score: form.total_score,

        status: form.status,
      };

      /*
      Admin send teacher_id

      Teacher backend auto detect
      */

      if (isAdmin) {
        payload.teacher_id = form.teacher_id;
      }

      const response = await axios.post(
        `${API_URL}/create`,
        payload,

        getHeaders(),
      );

      if (response.data.success) {
        toast.success(
          "📝 Assignment created successfully",

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

      if (error.response?.status === 422) {
        const errors = error.response.data.errors;

        Object.values(errors)
          .flat()
          .forEach((msg) => {
            toast.error(
              msg,

              {
                style: toastStyles?.error,
              },
            );
          });
      } else {
        toast.error(
          error.response?.data?.message || "Create assignment failed",

          {
            style: toastStyles?.error,
          },
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="assignment-modal">
        <div className="modal-header">
          <h3>➕ Create Assignment</h3>

          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        <form className="assignment-form" onSubmit={handleSubmit}>
          {/* TEACHER ONLY ADMIN */}

          {isAdmin && (
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
          )}

          <div className="form-group">
            <label>Course</label>

            <select
              name="course_id"
              value={form.course_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Course</option>

              {filteredCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.course_code}-{course.course_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Title</label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Assignment title"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Due Date</label>

            <input
              type="date"
              name="due_date"
              value={form.due_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Total Score</label>

            <input
              type="number"
              name="total_score"
              value={form.total_score}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Status</label>

            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Open">Open</option>

              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Creating..." : "Create Assignment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModal;
