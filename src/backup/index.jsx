import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import ClassCard from "./ClassCard";
import CreateModal from "./CreateModal";
import UpdateModal from "./UpdateModal";
import ShowModal from "./ShowModal";
import StudentListModal from "./StudentListModal";
import ClassStatistics from "./ClassStatistics";

import "./class.css";

const ClassIndex = () => {
  // ============================
  // STATES
  // ============================

  const [classes, setClasses] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [lastPage, setLastPage] = useState(1);

  const [totalClasses, setTotalClasses] = useState(0);

  // Filters

  const [departmentId, setDepartmentId] = useState("");

  const [semesterId, setSemesterId] = useState("");

  const [academicYearId, setAcademicYearId] = useState("");

  const [status, setStatus] = useState("");

  // Dropdown data

  const [departments, setDepartments] = useState([]);

  const [semesters, setSemesters] = useState([]);

  const [academicYears, setAcademicYears] = useState([]);

  // Modals

  const [showCreate, setShowCreate] = useState(false);

  const [showUpdate, setShowUpdate] = useState(false);

  const [showView, setShowView] = useState(false);

  const [showStudents, setShowStudents] = useState(false);

  const [showStatistics, setShowStatistics] = useState(false);

  const [selectedClass, setSelectedClass] = useState(null);

  const API = "http://192.168.100.39:8000/api/web/classes";

  // ============================
  // TOKEN
  // ============================

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  // ============================
  // LOAD CLASSES
  // ============================

  const fetchClasses = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        API,

        {
          params: {
            search,

            department_id: departmentId,

            semester_id: semesterId,

            academic_year_id: academicYearId,

            status,

            page: currentPage,

            per_page: 10,
          },

          ...config,
        },
      );

      if (response.data.success) {
        setClasses(response.data.data.data);

        setCurrentPage(response.data.data.current_page);

        setLastPage(response.data.data.last_page);

        setTotalClasses(response.data.data.total);
      }
    } catch (error) {
      console.log(error);

      toast.error("Cannot load classes");
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // LOAD FILTER DATA
  // ============================

  const loadFilters = async () => {
    try {
      const [dept, semester, years] = await Promise.all([
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

      setDepartments(dept.data.departments);

      setSemesters(semester.data.semesters);

      setAcademicYears(years.data.academicYears);
    } catch (error) {
      console.log(error);
    }
  };

  // ============================
  // DELETE CLASS
  // ============================

  const deleteClass = async (id) => {
    if (!window.confirm("Are you sure delete this class?")) return;

    try {
      await axios.delete(
        `${API}/${id}`,

        config,
      );

      toast.success("Class deleted successfully");

      fetchClasses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  // ============================
  // USE EFFECT
  // ============================

  useEffect(() => {
    fetchClasses();
  }, [currentPage, search, departmentId, semesterId, academicYearId, status]);

  useEffect(() => {
    loadFilters();
  }, []);

  return (
    <div className="class-page">
      <Toaster position="top-right" />

      {/* ===========================
          PAGE HEADER
      ============================ */}

      <div className="class-header">
        <div>
          <h1>📚 Class Management</h1>

          <p>
            Manage university classes, students, departments and academic
            information.
          </p>
        </div>

        <button className="btn-primary" onClick={() => setShowCreate(true)}>
          ➕ New Class
        </button>
      </div>

      {/* ===========================
          STATISTICS CARDS
      ============================ */}

      <div className="class-stat-grid">
        <ClassCard
            title="Total Classes"

            value={totalClasses}

            icon="📚"

            description="All university classes"

            type="blue"

        />



        <ClassCard

            title="Active Classes"

            value={
                classes.filter(
                    item=>item.status=== 1
                ).length
            }

            icon="🟢"

            description="Currently active"

            type="green"

        />



        <ClassCard

            title="Total Students"

            value={
                classes.reduce(
                    (sum,item)=>
                    sum+(item.students_count || 0),
                    0
                )
            }

            icon="👨‍🎓"

            description="Students assigned"

            type="purple"

        />



        <ClassCard

            title="Departments"

            value={
                departments.count
            }

            icon="🏢"

            description="University departments"

            type="orange"

        />


        </div>

      {/* ===========================
          FILTER SECTION
      ============================ */}

      <div className="class-filter-box">
        {/* Search */}

        <input
          type="text"
          placeholder="🔍 Search class name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);

            setCurrentPage(1);
          }}
          className="class-search"
        />

        {/* Department */}

        <select
          value={departmentId}
          onChange={(e) => {
            setDepartmentId(e.target.value);

            setCurrentPage(1);
          }}
        >
          <option value="">All Departments</option>

          {departments.map((item) => (
            <option key={item.id} value={item.id}>
              {item.department_name_english}
            </option>
          ))}
        </select>

        {/* Semester */}

        <select
          value={semesterId}
          onChange={(e) => {
            setSemesterId(e.target.value);

            setCurrentPage(1);
          }}
        >
          <option value="">All Semesters</option>

          {semesters.map((item) => (
            <option key={item.id} value={item.id}>
              {item.semester_name}
            </option>
          ))}
        </select>

        {/* Academic Year */}

        <select
          value={academicYearId}
          onChange={(e) => {
            setAcademicYearId(e.target.value);

            setCurrentPage(1);
          }}
        >
          <option value="">All Academic Years</option>

          {academicYears.map((item) => (
            <option key={item.id} value={item.id}>
              {item.academic_year}
            </option>
          ))}
        </select>

        {/* Status */}

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);

            setCurrentPage(1);
          }}
        >
          <option value="">All Status</option>

          <option value="Active">Active</option>

          <option value="Inactive">Inactive</option>
        </select>
      </div>
      {/* ===========================
          CLASS TABLE
      ============================ */}

      <div className="class-table-card">
        <table className="class-table">
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
                  Loading classes...
                </td>
              </tr>
            ) : classes.length > 0 ? (
              classes.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>

                  <td>
                    <strong>{item.class_name}</strong>
                  </td>

                  <td>{item.department?.department_name_english || "N/A"}</td>

                  <td>{item.academic_year?.academic_year || "-"}</td>

                  <td>{item.semester?.semester_name || "-"}</td>

                  <td>{item.room || "-"}</td>

                  <td>
                    <span className="student-count">
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
                    <div className="action-buttons">
                      <button
                        className="btn-show"
                        onClick={() => {
                          setSelectedClass(item);

                          setShowView(true);
                        }}
                      >
                        👁
                      </button>

                      <button
                        className="btn-edit"
                        onClick={() => {
                          setSelectedClass(item);

                          setShowUpdate(true);
                        }}
                      >
                        ✏
                      </button>

                      <button
                        className="btn-delete"
                        onClick={() => deleteClass(item.id)}
                      >
                        🗑
                      </button>

                      <button
                        className="btn-student"
                        onClick={() => {
                          setSelectedClass(item);

                          setShowStudents(true);
                        }}
                      >
                        👨‍🎓
                      </button>

                      <button
                        className="btn-stat"
                        onClick={() => {
                          setSelectedClass(item);

                          setShowStatistics(true);
                        }}
                      >
                        📊
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="empty">
                  No classes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===========================
          PAGINATION
      ============================ */}

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

      {/* ===========================
          MODALS
      ============================ */}

      {showCreate && (
        <CreateModal
          departments={departments}
          semesters={semesters}
          academicYears={academicYears}
          onClose={() => setShowCreate(false)}
          onSuccess={() => {
            setShowCreate(false);

            fetchClasses();
          }}
        />
      )}

      {showUpdate && (
        <UpdateModal
          classData={selectedClass}
          departments={departments}
          semesters={semesters}
          academicYears={academicYears}
          onClose={() => setShowUpdate(false)}
          onSuccess={() => {
            setShowUpdate(false);

            fetchClasses();
          }}
        />
      )}

      {showView && (
        <ShowModal
          classData={selectedClass}
          onClose={() => setShowView(false)}
        />
      )}

      {showStudents && (
        <StudentListModal
          classId={selectedClass?.id}
          onClose={() => setShowStudents(false)}
        />
      )}

      {showStatistics && (
        <ClassStatistics
          classId={selectedClass?.id}
          onClose={() => setShowStatistics(false)}
        />
      )}
    </div>
  );
};

export default ClassIndex;


