import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateModal = ({ schedule, onClose, reload }) => {
  const API = "http://192.168.100.39:8000/api/web/subject-schedules";

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  // =====================
  // FORM
  // =====================

  const [form, setForm] = useState({
    course_id: "",
    class_id: "",
    semester_id: "",
    academic_year_id: "",
    teacher_id: "",
    day_of_week: "",
    start_time: "",
    end_time: "",
    room: "",
    status: "active",
  });

  // DROPDOWN

  const [courses, setCourses] = useState([]);

  const [classes, setClasses] = useState([]);

  const [teachers, setTeachers] = useState([]);

  const [semesters, setSemesters] = useState([]);

  const [academics, setAcademics] = useState([]);

  const [loading, setLoading] = useState(false);

  // =====================
  // LOAD DATA
  // =====================

  const loadDropdown = async () => {
    try {
      const [courseRes, classRes, teacherRes, semesterRes, academicYearRes] = await Promise.all([
        axios.get(
          "http://192.168.100.39:8000/api/web/courses/dropdown",
          config,
        ),

        axios.get(
          "http://192.168.100.39:8000/api/web/classes/dropdown",
          config,
        ),

        axios.get(
          "http://192.168.100.39:8000/api/web/teachers/dropdown",
          config,
        ),

        axios.get(
          "http://192.168.100.39:8000/api/web/semesters/dropdown",
          config,
        ),

        axios.get(
          "http://192.168.100.39:8000/api/web/academic-years/dropdown",
          config,
        ),
      ]);

      setCourses(courseRes.data.data || []);

      setClasses(classRes.data.data || []);

      setTeachers(teacherRes.data.data || []);

      setSemesters(semesterRes.data.data || []);

      setAcademics(academicYearRes.data.data || []);
    } catch (error) {
      console.log(error);

      toast.error("Cannot load dropdown");
    }
  };

  useEffect(() => {
    loadDropdown();

    if (schedule) {
      setForm({
        course_id: schedule.course_id || "",

        class_id: schedule.class_id || "",

        semester_id: schedule.semester_id || "",

        academic_year_id: schedule.academic_year_id || "",

        teacher_id: schedule.teacher_id || "",

        day_of_week: schedule.day_of_week || "",

        start_time: schedule.start_time || "",

        end_time: schedule.end_time || "",

        room: schedule.room || "",

        status: schedule.status || "active",
      });
    }
  }, [schedule]);

  // =====================
  // CHANGE
  // =====================

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  // =====================
  // UPDATE
  // =====================

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.put(
        `${API}/${schedule.id}`,

        form,

        config,
      );

      toast.success("Schedule updated successfully");

      reload();

      onClose();
    } catch (error) {
      console.log(error.response);

      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="schedule-modal">
        <div className="modal-header">
          <h2>✏️ Update Schedule</h2>

          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        <form onSubmit={submit}>
          <label>Course</label>

          <select
            name="course_id"
            value={form.course_id}
            onChange={handleChange}
          >
            <option value="">Select Course</option>

            {courses.map((item) => (
              <option key={item.id} value={item.id}>
                {item.course_name}
              </option>
            ))}
          </select>

          <label>Class</label>

          <select name="class_id" value={form.class_id} onChange={handleChange}>
            <option value="">Select Class</option>

            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.class_name}
              </option>
            ))}
          </select>

          <label>Semester</label>

          <select
            name="semester_id"
            value={form.semester_id}
            onChange={handleChange}
          >
            <option value="">Select Semester</option>

            {semesters.map((item) => (
              <option key={item.id} value={item.id}>
                {item.semester_name}
              </option>
            ))}
          </select>

          <label>Academic Year</label>
          <select
            name="academic_year_id"
            value={form.academic_year_id}
            onChange={handleChange}
          >
            <option value="">Select Academic</option>

            {academics.map((item) => (
              <option key={item.id} value={item.id}>
                {item.academic_year}
              </option>
            ))}
          </select>

          <label>Teacher</label>

          <select
            name="teacher_id"
            value={form.teacher_id}
            onChange={handleChange}
          >
            <option value="">Select Teacher</option>

            {teachers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.full_name_english}
              </option>
            ))}
          </select>

          <label>Day</label>

          <select
            name="day_of_week"
            value={form.day_of_week}
            onChange={handleChange}
          >
            <option value="">Select Day</option>

            <option>Monday</option>

            <option>Tuesday</option>

            <option>Wednesday</option>

            <option>Thursday</option>

            <option>Friday</option>

            <option>Saturday</option>

            <option>Sunday</option>
          </select>

          <div className="time-row">
            <div>
              <label>Start Time</label>

              <input
                type="time"
                name="start_time"
                value={form.start_time}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>End Time</label>

              <input
                type="time"
                name="end_time"
                value={form.end_time}
                onChange={handleChange}
              />
            </div>
          </div>

          <label>Room</label>

          <input name="room" value={form.room} onChange={handleChange} />

          <label>Status</label>

          <select name="status" value={form.status} onChange={handleChange}>
            <option value="active">Active</option>

            <option value="finished">Finished</option>
          </select>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>

            <button className="btn-save" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;
