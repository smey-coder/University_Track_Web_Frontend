import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";

const UpdateModal = ({ assignment, onClose, onSuccess, toastStyles }) => {
  const { user } = useAuth();

  const API_URL = "http://192.168.100.39:8000/api/web/assignments";

  const [courses, setCourses] = useState([]);

  const [teachers, setTeachers] = useState([]);

  const [filteredCourses, setFilteredCourses] = useState([]);

  const [loading, setLoading] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);

  const [form, setForm] = useState({
    assignment_code: "",

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
    if (user?.roles?.includes("Admin")) {
      setIsAdmin(true);
    }
  }, [user]);

  // ============================
  // LOAD DATA
  // ============================

  useEffect(() => {
    if (assignment) {
      setForm({
        assignment_code: assignment.assignment_code,

        course_id: assignment.course_id,

        teacher_id: assignment.teacher_id,

        title: assignment.title,

        description: assignment.description || "",

        due_date: assignment.due_date?.substring(0, 10),

        total_score: assignment.total_score,

        status: assignment.status,
      });
    }

    if (user) {
      loadDependencies();
    }
  }, [assignment, user, isAdmin]);

  const loadDependencies = async () => {
    try {
      const response = await axios.get(`${API_URL}/form-data`, getHeaders());

      if (response.data.success) {
        const allCourses = response.data.courses || [];

        const allTeachers = response.data.teachers || [];

        setCourses(allCourses);

        setTeachers(allTeachers);

        let teacherId;

        // =========================
        // ADMIN
        // =========================
        if (isAdmin) {
          teacherId = assignment?.teacher_id || assignment?.teacher?.id;
        }

        // =========================
        // TEACHER
        // =========================
        else {
          const teacher = allTeachers.find(
            (teacher) => teacher.user_id === user.id,
          );

          teacherId = teacher?.id;
        }

        const filtered = allCourses.filter(
          (course) => String(course.teacher_id) === String(teacherId),
        );

        setFilteredCourses(filtered);

        console.log("Teacher ID:", teacherId);

        console.log("Courses:", filtered);
      }
    } catch (error) {
      console.log(error);

      toast.error("Cannot load courses");
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
  // UPDATE
  // ============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const payload = {
        course_id: form.course_id,

        ...(isAdmin && {
          teacher_id: form.teacher_id,
        }),

        title: form.title,

        description: form.description,

        due_date: form.due_date,

        total_score: form.total_score,

        status: form.status,
      };

      const response = await axios.put(
        `${API_URL}/update/${assignment.id}`,

        payload,

        getHeaders(),
      );

      if (response.data.success) {
        toast.success(
          "✅ Assignment updated successfully",

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
        Object.values(error.response.data.errors)
          .flat()
          .forEach((message) => {
            toast.error(
              message,

              {
                style: toastStyles?.error,
              },
            );
          });
      } else {
        toast.error(
          error.response?.data?.message || "Update assignment failed",

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
          <h3>✏️ Update Assignment</h3>

          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        <form className="assignment-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Assignment Code</label>

            <input type="text" value={form.assignment_code} disabled />
          </div>

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
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
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
              {loading ? "Updating..." : "Update Assignment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;
