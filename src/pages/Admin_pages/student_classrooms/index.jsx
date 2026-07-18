import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

import Filter from "./components/Filter";
import CourseCard from "./components/CourseCard";
import ScheduleCard from "./components/ScheduleCard";

import { getStudentClassroom } from "./api/classroomApi";

import "./studentClassroom.css";

const StudentClassroom = () => {
  const [academicYears, setAcademicYears] = useState([]);

  const [semesters, setSemesters] = useState([]);

  const [academicYearId, setAcademicYearId] = useState("");

  const [semesterId, setSemesterId] = useState("");

  const [classroom, setClassroom] = useState(null);

  const [courses, setCourses] = useState([]);

  const [schedules, setSchedules] = useState([]);

  const [loading, setLoading] = useState(false);

  // ==========================================
  // Load Dropdown
  // ==========================================

  const loadDropdown = async () => {
    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [yearRes, semesterRes] = await Promise.all([
        axios.get(
          "http://192.168.100.39:8000/api/web/academic-years/dropdown",
          config,
        ),

        axios.get(
          "http://192.168.100.39:8000/api/web/semesters/dropdown",
          config,
        ),
      ]);

      setAcademicYears(yearRes.data.data || []);

      setSemesters(semesterRes.data.data || []);
    } catch (error) {
      toast.error("Cannot load dropdown");
    }
  };

  // ==========================================
  // Search Classroom
  // ==========================================

  const searchClassroom = async () => {
    if (!academicYearId || !semesterId) {
      toast.error("Please select Academic Year and Semester");

      return;
    }

    try {
      setLoading(true);

      setClassroom(null);

      setCourses([]);

      setSchedules([]);

      const response = await getStudentClassroom({
        academic_year_id: academicYearId,

        semester_id: semesterId,
      });

      if (!response.data.success) {
        toast.error(response.data.message);

        return;
      }

      const data = response.data.data;

      setClassroom(data);

      const scheduleList = data.schedules || [];

      setSchedules(scheduleList);

      // Remove duplicate courses

      const uniqueCourses = [];

      const ids = new Set();

      scheduleList.forEach((schedule) => {
        if (schedule.course && !ids.has(schedule.course.id)) {
          ids.add(schedule.course.id);

          uniqueCourses.push(schedule.course);
        }
      });

      setCourses(uniqueCourses);
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Cannot load classroom");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDropdown();
  }, []);

  return (
    <div className="student-classroom-page">
      <Toaster position="top-right" />

      <div className="page-header">
        <h1>🏫 My Classroom</h1>

        <p>View your classroom, courses and schedules</p>
      </div>

      <Filter
        academicYears={academicYears}
        semesters={semesters}
        academicYearId={academicYearId}
        semesterId={semesterId}
        setAcademicYearId={setAcademicYearId}
        setSemesterId={setSemesterId}
        onSearch={searchClassroom}
      />

      {loading ? (
        <div className="loading">⏳ Loading...</div>
      ) : (
        classroom && (
          <>
            <div className="class-info-card">
              <h2>{classroom.class_name}</h2>

              <p>
                Department : {classroom.department?.department_name_english}
              </p>

              <p>Academic Year : {classroom.academic_year?.academic_year}</p>
            </div>

            <h2>📚 Courses</h2>

            <div className="course-grid">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))
              ) : (
                <p>No courses found.</p>
              )}
            </div>

            <hr />

            <h2>🕒 Schedule</h2>

            <div className="schedule-grid">
              {schedules.length > 0 ? (
                schedules.map((schedule) => (
                  <ScheduleCard key={schedule.id} schedule={schedule} />
                ))
              ) : (
                <p>No schedule found.</p>
              )}
            </div>
          </>
        )
      )}
    </div>
  );
};

export default StudentClassroom;
