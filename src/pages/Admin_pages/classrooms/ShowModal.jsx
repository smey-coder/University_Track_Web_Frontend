import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import StudentTab from "./StudentTab";
import TeacherTab from "./TeacherTab";
import CourseTab from "./CourseTab";
import ScheduleTab from "./ScheduleTab";

import "./showModule.css";

const ShowModal = ({ classroom, onClose, defaultTab = "overview" }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [schedule, setSchedule] = useState([]);

  const [loading, setLoading] = useState(false);

  const API = "http://192.168.100.39:8000/api/web/classrooms";

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  // =========================
  // UPDATE TAB
  // =========================

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // =========================
  // CLOSE ESC
  // =========================

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);

      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  // =========================
  // LOAD CLASSROOM DATA
  // =========================

  const loadData = async () => {
    if (!classroom?.id) return;

    try {
      setLoading(true);

      const [studentRes, teacherRes, courseRes, scheduleRes] =
        await Promise.all([
          axios.get(`${API}/${classroom.id}/students`, config),

          axios.get(`${API}/${classroom.id}/teachers`, config),

          axios.get(`${API}/${classroom.id}/courses`, config),

          axios.get(`${API}/${classroom.id}/schedule`, config),
        ]);

      setStudents(studentRes.data.data || []);

      setTeachers(teacherRes.data.data || []);

      setCourses(courseRes.data.data || []);

      setSchedule(scheduleRes.data.data || []);
    } catch (error) {
      console.log(error);

      toast.error("Cannot load classroom information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [classroom?.id]);

  if (!classroom) return null;

  const tabs = [
    {
      id: "overview",
      name: "🏠 Overview",
    },

    {
      id: "students",
      name: "👨‍🎓 Students",
    },

    {
      id: "teachers",
      name: "👨‍🏫 Teachers",
    },

    {
      id: "courses",
      name: "📖 Courses",
    },

    {
      id: "schedule",
      name: "🕒 Schedule",
    },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="classroom-modal" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}

        <div className="modal-header">
          <div>
            <h2>🏫 {classroom.class_name}</h2>

            <span>Classroom Information</span>
          </div>

          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* INFO */}

        <div className="classroom-info">
          <div>
            <label>Department</label>

            <p>{classroom.department?.department_name_english || "-"}</p>
          </div>

          <div>
            <label>Academic Year</label>

            <p>{classroom.academic_year?.academic_year || "-"}</p>
          </div>

          <div>
            <label>Semester</label>

            <p>{classroom.semester?.semester_name || "-"}</p>
          </div>

          <div>
            <label>Room</label>

            <p>🏫 {classroom.room || "-"}</p>
          </div>

          <div>
            <label>Students</label>

            <p>👨‍🎓 {classroom.students_count || 0}</p>
          </div>

          <div>
            <label>Status</label>

            <p
              className={
                classroom.status === "Active"
                  ? "status-active"
                  : "status-inactive"
              }
            >
              {classroom.status}
            </p>
          </div>
        </div>

        {/* TAB MENU */}

        <div className="classroom-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? "active" : ""}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* CONTENT */}

        <div className="tab-content">
          {loading ? (
            <div className="loading-box">⏳ Loading...</div>
          ) : activeTab === "overview" ? (
            <div className="overview-card">
              <h3>🏫 Class Overview</h3>

              <p>
                <b>Class Name:</b> {classroom.class_name}
              </p>

              <p>
                <b>Room:</b> {classroom.room}
              </p>

              <p>
                <b>Maximum Students:</b> {classroom.max_students || "-"}
              </p>
            </div>
          ) : activeTab === "students" ? (
            <StudentTab students={students} />
          ) : activeTab === "teachers" ? (
            <TeacherTab teachers={teachers} />
          ) : activeTab === "courses" ? (
            <CourseTab courses={courses} />
          ) : (
            <ScheduleTab schedule={schedule} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowModal;
