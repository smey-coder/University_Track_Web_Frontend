import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import ShowModal from "./ShowModal";
import TeacherTab  from "./TeacherTab";
import StudentTab from "./StudentTab";
import ClassroomCard from "./ClassroomCard";

import "./classroom.css";

const ClassroomIndex = () => {
  // ==========================
  // STATES
  // ==========================

  const [classrooms, setClassrooms] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [lastPage, setLastPage] = useState(1);

  // Filters

  const [academicYearId, setAcademicYearId] = useState("");

  const [semesterId, setSemesterId] = useState("");

  const [departmentId, setDepartmentId] = useState("");

  const [teacherId, setTeacherId] = useState("");

  const [courseId, setCourseId] = useState("");

  // Dropdown

  const [academicYears, setAcademicYears] = useState([]);

  const [semesters, setSemesters] = useState([]);

  const [departments, setDepartments] = useState([]);

  const [teachers, setTeachers] = useState([]);

  const [courses, setCourses] = useState([]);

  // Modal

  const [showModal, setShowModal] = useState(false);
  const [defaultTab, setDefaultTab] = useState("overview"); 

  const [selectedClassroom, setSelectedClassroom] = useState(null);

  const [totalCourses,setTotalCourses] = useState(0);

  const [totalTeachers,setTotalTeachers] = useState(0);

  const API = "http://192.168.100.39:8000/api/web/classrooms";

  // ==========================
  // TOKEN
  // ==========================

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  // ==========================
  // LOAD CLASSROOM
  // ==========================

  const fetchClassrooms = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API, {
        params: {
          search,

          academic_year_id: academicYearId,

          semester_id: semesterId,

          department_id: departmentId,

          teacher_id: teacherId,

          course_id: courseId,

          page: currentPage,

          per_page: 10,
        },

        ...config,
      });

      if (response.data.success) {
        setClassrooms(response.data.data.data);

        setCurrentPage(response.data.data.current_page);

        setLastPage(response.data.data.last_page);
      }
    } catch (error) {
      console.log(error);

      toast.error("Cannot load classrooms");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // LOAD FILTER
  // ==========================

  const loadFilters = async () => {
    try {
      const [dept, semester, year] = await Promise.all([
        axios.get(
          "http://192.168.100.39:8000/api/web/departments/dropdown",

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

      setDepartments(dept.data.data || []);

      setSemesters(semester.data.data || []);

      setAcademicYears(year.data.data || []);
    } catch (error) {
      console.log(error.response);

      toast.error("Cannot load filter data");
    }
  };

  // ==========================
  // EFFECT
  // ==========================

  useEffect(() => {
    fetchClassrooms();
  }, [
    currentPage,

    search,

    academicYearId,

    semesterId,

    departmentId,

    teacherId,

    courseId,
  ]);

  useEffect(() => {
    loadFilters();
  }, []);

  return (
    <div className="classroom-page">
      <Toaster position="top-right" />

      {/* HEADER */}

      <div className="classroom-header">
        <div>
          <h1>🏫 Classroom Management</h1>

          <p>
            Manage class learning environment, students, teachers and schedules.
          </p>
        </div>
      </div>

      {/* STATISTICS */}

      <div className="classroom-stat-grid">
        <ClassroomCard
          title="Total Classroom"
          value={classrooms.length}
          icon="🏫"
        />

        <ClassroomCard
          title="Students"
          value={classrooms.reduce(
            (sum, item) => sum + (item.students_count || 0),
            0,
          )}
          icon="👨‍🎓"
        />

        <ClassroomCard
            title="Courses"
            value={
                classrooms.reduce(
                    (sum,item)=>
                    sum + (item.courses_count || 0),
                    0
                )
            }
            icon="📖"
        />


        <ClassroomCard
            title="Teachers"
            value={
                classrooms.reduce(
                    (sum,item)=>
                    sum + (item.teachers_count || 0),
                    0
                )
            }
            icon="👨‍🏫"
        />
      </div>

      {/* FILTER */}

      <div className="classroom-filter">
        <input
          placeholder="Search classroom..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);

            setCurrentPage(1);
          }}
        />

        <select
          value={academicYearId}
          onChange={(e) => setAcademicYearId(e.target.value)}
        >
          <option value="">Academic Year</option>

          {academicYears.map((item) => (
            <option key={item.id} value={item.id}>
              {item.academic_year}
            </option>
          ))}
        </select>

        <select
          value={semesterId}
          onChange={(e) => setSemesterId(e.target.value)}
        >
          <option value="">Semester</option>

          {semesters.map((item) => (
            <option key={item.id} value={item.id}>
              {item.semester_name}
            </option>
          ))}
        </select>

        <select
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
        >
          <option value="">Department</option>

          {departments.map((item) => (
            <option key={item.id} value={item.id}>
              {item.department_name_english}
            </option>
          ))}
        </select>
      </div>
      {/* ==========================
    CLASSROOM TABLE
========================== */}

      <div className="classroom-table-card">
        <table className="classroom-table">
          <thead>
            <tr>
              <th>#</th>

              <th>Class</th>

              <th>Department</th>

              <th>Academic Year</th>

              <th>Semester</th>

              <th>Room</th>

              <th>Students</th>

              <th>Status</th>

              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="loading">
                  Loading classrooms...
                </td>
              </tr>
            ) : classrooms.length > 0 ? (
              classrooms.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>

                  <td>
                    <strong>{item.class_name}</strong>
                  </td>

                  <td>{item.department?.department_name_english || "N/A"}</td>

                  <td>{item.academic_year?.academic_year || "-"}</td>

                  <td>{item.semester?.semester_name || "-"}</td>

                  <td>🏫 {item.room || "-"}</td>

                  <td>
                    <span className="student-badge">
                      👨‍🎓
                      {item.students_count || 0}
                    </span>
                  </td>

                  <td>
                    <span
                      className={
                        item.status === "Active"
                          ? "status-active"
                          : "status-inactive"
                      }
                    >
                      {item.status}
                    </span>
                  </td>

                  <td>
                    <div className="classroom-actions">

                      {/* View Overview */}
                      <button
                        className="btn-view"
                        title="View Classroom"
                        onClick={() => {
                          setSelectedClassroom(item);
                          setDefaultTab("overview");
                          setShowModal(true);
                        }}
                      >
                        👁
                      </button>


                      {/* Students */}
                      <button
                        className="btn-student"
                        title="Students"
                        onClick={() => {
                          setSelectedClassroom(item);
                          setDefaultTab("students");
                          setShowModal(true);
                        }}
                      >
                        👨‍🎓
                      </button>


                      {/* Courses */}
                      <button
                        className="btn-course"
                        title="Courses"
                        onClick={() => {
                          setSelectedClassroom(item);
                          setDefaultTab("courses");
                          setShowModal(true);
                        }}
                      >
                        📖
                      </button>


                      {/* Schedule */}
                      <button
                        className="btn-schedule"
                        title="Schedule"
                        onClick={() => {
                          setSelectedClassroom(item);
                          setDefaultTab("schedule");
                          setShowModal(true);
                        }}
                      >
                        🕒
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="empty">
                  No classroom found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ==========================
        PAGINATION
========================== */}

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          ◀ Previous
        </button>

        <span>
          Page {currentPage} / {lastPage}
        </span>

        <button
          disabled={currentPage === lastPage}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next ▶
        </button>
      </div>

     {/* ==========================
              SHOW MODAL
      ========================== */}
      {showModal && selectedClassroom && (
        <ShowModal
          classroom={selectedClassroom}
          defaultTab={defaultTab}
          onClose={() => {
            setShowModal(false);
            setSelectedClassroom(null);
          }}
        />
      )}
    </div>
  );
};

export default ClassroomIndex;
