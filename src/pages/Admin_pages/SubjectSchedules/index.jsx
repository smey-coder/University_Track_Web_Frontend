import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import CreateModal from "./CreateModal";
import UpdateModal from "./UpdateModal";
import ShowModal from "./ShowModal";

import "./schedule.css";

const SubjectScheduleIndex = () => {
  const API = "http://192.168.100.39:8000/api/web/subject-schedules";

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  // ==========================
  // STATES
  // ==========================

  const [schedules, setSchedules] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [lastPage, setLastPage] = useState(1);

  // FILTER

  const [classId, setClassId] = useState("");

  const [teacherId, setTeacherId] = useState("");

  const [courseId, setCourseId] = useState("");

  // DROPDOWN

  const [classes, setClasses] = useState([]);

  const [teachers, setTeachers] = useState([]);

  const [courses, setCourses] = useState([]);

  // MODAL

  const [showCreate, setShowCreate] = useState(false);

  const [showUpdate, setShowUpdate] = useState(false);

  const [showDetail, setShowDetail] = useState(false);

  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // ==========================
  // LOAD DATA
  // ==========================

  const fetchSchedules = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API, {
        params: {
          search,

          class_id: classId,

          teacher_id: teacherId,

          course_id: courseId,

          page: currentPage,

          per_page: 10,
        },

        ...config,
      });

      if (response.data.success) {
        setSchedules(response.data.data.data);

        setCurrentPage(response.data.data.current_page);

        setLastPage(response.data.data.last_page);
      }
    } catch (error) {
      console.log(error);

      toast.error("Cannot load schedules");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // LOAD DROPDOWN
  // ==========================

  const loadDropdown = async () => {
    try {
      const [classRes, teacherRes, courseRes] = await Promise.all([
        axios.get(
          "http://192.168.100.39:8000/api/web/classes/dropdown",
          config,
        ),

        axios.get(
          "http://192.168.100.39:8000/api/web/teachers/dropdown",
          config,
        ),

        axios.get(
          "http://192.168.100.39:8000/api/web/courses/dropdown",
          config,
        ),
      ]);

      setClasses(classRes.data.data || []);

      setTeachers(teacherRes.data.data || []);

      setCourses(courseRes.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [currentPage, search, classId, teacherId, courseId]);

  useEffect(() => {
    loadDropdown();
  }, []);

  // ==========================
  // DELETE
  // ==========================

  const deleteSchedule = async (id) => {
    if (!window.confirm("Delete this schedule?")) return;

    try {
      await axios.delete(`${API}/${id}`, config);

      toast.success("Deleted successfully");

      fetchSchedules();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="schedule-page">
      <Toaster position="top-right" />

      {/* HEADER */}

      <div className="schedule-header">
        <div>
          <h1>🕒 Subject Schedule</h1>

          <p>Manage classroom timetable and teaching schedule</p>
        </div>

        <button className="btn btn-success" onClick={() => setShowCreate(true)}>
          + Add Schedule
        </button>
      </div>

      {/* FILTER */}

      <div className="schedule-filter">
        <input
          placeholder="Search schedule..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);

            setCurrentPage(1);
          }}
        />

        <select value={classId} onChange={(e) => setClassId(e.target.value)}>
          <option value="">All Classes</option>

          {classes.map((item) => (
            <option key={item.id} value={item.id}>
              {item.class_name}
            </option>
          ))}
        </select>

        <select
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
        >
          <option value="">All Teachers</option>

          {teachers.map((item) => (
            <option key={item.id} value={item.id}>
              {item.full_name_english}
            </option>
          ))}
        </select>

        <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          <option value="">All Courses</option>

          {courses.map((item) => (
            <option key={item.id} value={item.id}>
              {item.course_name}
            </option>
          ))}
        </select>
      </div>
      {/* TABLE */}
      <div className="schedule-table-card">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Class</th>
              <th>Course</th>
              <th>Teacher</th>
              <th>Day</th>
              <th>Time</th>
              <th>Room</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9">Loading...</td>
              </tr>
            ) : schedules.length > 0 ? (
              schedules.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>

                  <td>{item.class?.class_name}</td>

                  <td>{item.course?.course_name}</td>

                  <td>{item.teacher?.full_name_english || "-"}</td>

                  <td>{item.day_of_week}</td>

                  <td>
                    {item.start_time}-{item.end_time}
                  </td>

                  <td>{item.room}</td>

                  <td>
                    <span className="status-active">{item.status}</span>
                  </td>

                  <td>
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        setSelectedSchedule(item);

                        setShowDetail(true);
                      }}
                    >
                      👁
                    </button>

                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setSelectedSchedule(item);

                        setShowUpdate(true);
                      }}
                    >
                      ✏️
                    </button>

                    <button
                      className="btn btn-warning"
                      onClick={() => deleteSchedule(item.id)}
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No schedule found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          ◀
        </button>

        <span>
          Page {currentPage} / {lastPage}
        </span>

        <button
          disabled={currentPage === lastPage}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          ▶
        </button>
      </div>

      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          reload={fetchSchedules}
        />
      )}

      {showUpdate && (
        <UpdateModal
          schedule={selectedSchedule}
          onClose={() => setShowUpdate(false)}
          reload={fetchSchedules}
        />
      )}

      {showDetail && (
        <ShowModal
          schedule={selectedSchedule}
          onClose={() => setShowDetail(false)}
        />
      )}
    </div>
  );
};

export default SubjectScheduleIndex;
