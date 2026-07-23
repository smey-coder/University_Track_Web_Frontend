import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";

import CreateModal from "./CreateModal";
import UpdateModal from "./UpdateModal";
import ShowModal from "./ShowModal";
import GroupModal from "./GroupModal";
import GroupDetailModal from "./GroupDetailModal";
import { useAuth } from "../../../hooks/useAuth";

import "./assignment.css";

const Index = () => {
  // ===============================
  // STATE
  // ===============================

  const [assignments, setAssignments] = useState([]);

  const [pagination, setPagination] = useState({
    current_page: 1,

    last_page: 1,
  });

  const [loading, setLoading] = useState(true);

  const [activeAssignment, setActiveAssignment] = useState(null);

  const [modalType, setModalType] = useState(null);

  const [showGroup, setShowGroup] = useState(false);

  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showGroupDetailModal,setShowGroupDetailModal] = useState(false);

  // ===============================
  // FILTER STATE
  // ===============================

  const [filters, setFilters] = useState({
    search: "",

    teacher_id: "",

    course_id: "",

    class_id: "",

    assignment_type: "",

    submission_type: "",

    status: "",

    due_from: "",

    due_to: "",
  });
  const [assignmentStats, setAssignmentStats] = useState({
    total: 0,

    homework: 0,

    assignment: 0,

    quiz: 0,

    project: 0,

    submitted: 0,

    graded: 0,

    pending: 0,
  });

  const [teachers, setTeachers] = useState([]);

  const [courses, setCourses] = useState([]);

  const [classes, setClasses] = useState([]);

  // ===============================
  // AUTH
  // ===============================

  const { user } = useAuth();

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) ?? false;
  };

  const canCreate = hasPermission("assignment.create");

  const canUpdate = hasPermission("assignment.update");

  const canDelete = hasPermission("assignment.delete");

  const canData = hasPermission("assignment.data");

  // ===============================
  // API
  // ===============================

  const API_URL = "http://192.168.100.39:8000/api/web/assignments";

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // ===============================
  // TOAST STYLE
  // ===============================

  const toastStyles = {
    success: {
      background: "#22c55e",

      color: "#fff",

      borderRadius: "10px",
    },

    error: {
      background: "#ef4444",

      color: "#fff",

      borderRadius: "10px",
    },
  };

  // ===============================
  // HANDLE FILTER CHANGE
  // ===============================

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,

      [name]: value,
    }));
  };

  // ===============================
  // LOAD DROPDOWN DATA
  // ===============================

  const fetchDropdowns = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/form-data`,

        getHeaders(),
      );

      if (response.data.success) {
        setTeachers(response.data.teachers);
        setCourses(response.data.courses);
        setClasses(response.data.classes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ===============================
  // FETCH ASSIGNMENTS
  // ===============================

  const fetchAssignments = async (page = 1) => {
    setLoading(true);

    try {
      const response = await axios.get(
        API_URL,

        {
          ...getHeaders(),

          params: {
            page,

            search: filters.search,

            teacher_id: filters.teacher_id,

            course_id: filters.course_id,

            class_id: filters.class_id,

            assignment_type: filters.assignment_type,

            submission_type: filters.submission_type,

            status: filters.status,

            due_from: filters.due_from,

            due_to: filters.due_to,
          },
        },
      );

      if (response.data.success) {
        setAssignments(response.data.data);
        calculateStats(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      toast.error("❌ Failed loading assignments", {
        style: toastStyles.error,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdowns();
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [filters]);

  // ===============================
  // DELETE ASSIGNMENT
  // ===============================

  const handleDelete = (id, title) => {
    Swal.fire({
      title: "Are you sure?",

      text: `Delete assignment ${title}?`,

      icon: "warning",

      showCancelButton: true,

      confirmButtonColor: "#ef4444",

      cancelButtonColor: "#94a3b8",

      confirmButtonText: "Yes, Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `${API_URL}/delete/${id}`,

            getHeaders(),
          );

          if (response.data.success) {
            toast.success("🗑 Assignment deleted", {
              style: toastStyles.success,
            });

            fetchAssignments(pagination.current_page);
          }
        } catch (error) {
          toast.error("❌ Delete failed", {
            style: toastStyles.error,
          });
        }
      }
    });
  };

  // ===============================
  // RESET FILTER
  // ===============================

  const resetFilter = () => {
    setFilters({
      search: "",

      teacher_id: "",

      course_id: "",

      class_id: "",

      assignment_type: "",

      submission_type: "",

      due_from: "",

      status: "",

      due_to: "",
    });
  };
  const calculateStats = (data) => {
    setAssignmentStats({
      total: data.length,

      homework: data.filter((item) => item.assignment_type === "Homework")
        .length,

      assignment: data.filter((item) => item.assignment_type === "Assignment")
        .length,

      quiz: data.filter((item) => item.assignment_type === "Quiz").length,

      project: data.filter((item) => item.assignment_type === "Project").length,

      submitted: data.filter((item) => item.status === "Submitted").length,

      graded: data.filter((item) => item.status === "Graded").length,

      pending: data.filter((item) => item.status === "Pending").length,
    });
  };

  return (
    <div className="assignment-page-wrapper">
      <Toaster position="top-right" />

      {/* ===============================
          HEADER
      ================================ */}

      <div className="assignment-header-panel">
        <div>
          <h2>📝 Assignment Management</h2>

          <p>Manage university assignments and teacher tasks.</p>
        </div>

        {canCreate && (
          <button
            className="add-assignment-btn"
            onClick={() => setModalType("create")}
          >
            ➕ Add Assignment
          </button>
        )}
      </div>
      {/* ==========================
            ASSIGNMENT SUMMARY
        ========================== */}

      <div className="assignment-summary">
        <div className="summary-card total">
          <div className="icon">📚</div>

          <div>
            <h3>{assignmentStats.total}</h3>

            <p>Total Assignment</p>
          </div>
        </div>

        <div className="summary-card homework">
          <div className="icon">📖</div>

          <div>
            <h3>{assignmentStats.homework}</h3>

            <p>Homework</p>
          </div>
        </div>

        <div className="summary-card assignment">
          <div className="icon">📝</div>

          <div>
            <h3>{assignmentStats.assignment}</h3>

            <p>Assignment</p>
          </div>
        </div>

        <div className="summary-card quiz">
          <div className="icon">❓</div>

          <div>
            <h3>{assignmentStats.quiz}</h3>

            <p>Quiz</p>
          </div>
        </div>

        <div className="summary-card graded">
          <div className="icon">✅</div>

          <div>
            <h3>{assignmentStats.graded}</h3>

            <p>Graded</p>
          </div>
        </div>

        <div className="summary-card submitted">
          <div className="icon">📤</div>

          <div>
            <h3>{assignmentStats.submitted}</h3>

            <p>Submitted</p>
          </div>
        </div>
      </div>

      {/* ===============================
          FILTER AREA
      ================================ */}

      <div className="search-filter-card">
        <div>
          <label>🔍 Search</label>

          <input
            type="text"
            name="search"
            placeholder="Search assignment..."
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>

        <div>
          <label>👨‍🏫 Teacher</label>

          <select
            name="teacher_id"
            value={filters.teacher_id}
            onChange={handleFilterChange}
          >
            <option value="">All Teachers</option>

            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.first_name_english} {teacher.last_name_english}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>📚 Course</label>

          <select
            name="course_id"
            value={filters.course_id}
            onChange={handleFilterChange}
          >
            <option value="">All Courses</option>

            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.course_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>📝 Type</label>

          <select
            name="assignment_type"
            value={filters.assignment_type}
            onChange={handleFilterChange}
          >
            <option value="">All Types</option>

            <option value="Homework">Homework</option>

            <option value="Assignment">Assignment</option>

            <option value="Quiz">Quiz</option>

            <option value="Project">Project</option>
          </select>
        </div>
        <div>
          <label>👥 Submission</label>

          <select
            name="submission_type"
            value={filters.submission_type}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="Individual">Individual</option>
            <option value="Group">Group</option>
          </select>
        </div>
        <div>
          <label>🏫 Class</label>
          <select
            name="class_id"
            value={filters.class_id}
            onChange={handleFilterChange}
          >
            <option value="">All Classes</option>

            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.class_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>📅 Created at</label>

          <input
            type="date"
            name="due_from"
            value={filters.due_from}
            onChange={handleFilterChange}
          />
        </div>

        <div>
          <label>📅 Due Until</label>

          <input
            type="date"
            name="due_to"
            value={filters.due_to}
            onChange={handleFilterChange}
          />
        </div>

        <div>
          <label>📌 Status</label>

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            <option value="Draft">Draft</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <button
          className="reset-filter-btn"
          onClick={() =>
            setFilters({
              search: "",
              teacher_id: "",
              course_id: "",
              assignment_type: "",
              due_from: "",
              due_to: "",
            })
          }
        >
          🔄 Reset
        </button>
      </div>

      {/* ===============================
          TABLE
      ================================ */}

      {canData && (
        <div className="table-container-card">
          {loading ? (
            <div className="loading">Loading assignments...</div>
          ) : (
            <table className="assignment-table">
              <thead>
                <tr>
                  <th>Code</th>

                  <th>Title</th>

                  <th>Course</th>

                  <th>Class</th>

                  <th>Type</th>

                  <th>Submissions Type</th>

                  <th>Teacher</th>

                  <th>Due Date</th>

                  <th>Score</th>

                  <th>Status</th>

                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {assignments.length > 0 ? (
                  assignments.map((assignment) => (
                    <tr key={assignment.id}>
                      {/* CODE */}

                      <td>
                        <strong>{assignment.assignment_code}</strong>
                      </td>

                      {/* TITLE */}

                      <td
                        className="clickable-name"
                        onClick={() => {
                          setActiveAssignment(assignment);

                          setModalType("show");
                        }}
                      >
                        {assignment.title}
                      </td>

                      <td>{assignment.course?.course_name}</td>
                      <td>{assignment.class?.class_name}</td>
                      {/* TYPE */}
                      <td>
                        <span
                          className={`assignment-type ${assignment.assignment_type?.toLowerCase()}`}
                        >
                          {assignment.assignment_type}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`assignment-type ${assignment.submission_type?.toLowerCase()}`}
                        >
                          {assignment.submission_type}
                        </span>
                      </td>

                      {/* TEACHER */}

                      <td>
                        {assignment.teacher?.first_name_english}{" "}
                        {assignment.teacher?.last_name_english}
                      </td>

                      {/* DUE DATE */}

                      <td>{assignment.due_date}</td>

                      {/* SCORE */}

                      <td>{assignment.total_score}</td>

                      {/* STATUS */}

                      <td>
                        <span
                          className={`badge ${
                            assignment.status === "Open"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {assignment.status}
                        </span>
                      </td>

                      {/* ACTION */}

                      <td>
                        {assignment.submission_type === "Group" && (
                          <button
                            className="group-btn"
                            onClick={() => {
                              setActiveAssignment(assignment);

                              setShowGroupModal(true);
                            }}
                          >
                            👥 Group
                          </button>
                        )}
                        {assignment.submission_type === "Group" && (
                            <button
                                className="group-btn"
                                onClick={() => {
                                    setActiveAssignment(assignment);
                                    setShowGroupDetailModal(true);
                                }}
                            >
                                👥 View Group
                            </button>
                        )}
                        {canUpdate && (
                          <button
                            className="edit-btn"
                            onClick={() => {
                              setActiveAssignment(assignment);

                              setModalType("update");
                            }}
                          >
                            ✏️ Edit
                          </button>
                        )}

                        {canDelete && (
                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(
                                assignment.id,

                                assignment.title,
                              )
                            }
                          >
                            🗑 Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9">No assignment found</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ===============================
          CREATE MODAL
      ================================ */}

      {modalType === "create" && (
        <CreateModal
          onClose={() => setModalType(null)}
          onSuccess={() => {
            setModalType(null);

            fetchAssignments();
          }}
          toastStyles={toastStyles}
        />
      )}

      {/* ===============================
          UPDATE MODAL
      ================================ */}

      {modalType === "update" && (
        <UpdateModal
          assignment={activeAssignment}
          onClose={() => setModalType(null)}
          onSuccess={() => {
            setModalType(null);

            fetchAssignments();
          }}
          toastStyles={toastStyles}
        />
      )}

      {/* ===============================
          SHOW MODAL
      ================================ */}

      {modalType === "show" && (
        <ShowModal
          assignment={activeAssignment}
          onClose={() => setModalType(null)}
        />
      )}
      {showGroupModal && (
        <GroupModal
          assignment={activeAssignment}
          onClose={() => setShowGroupModal(false)}
          onSuccess={() => {
            setShowGroupModal(false);

            fetchAssignments();
          }}
          toastStyles={toastStyles}
        />
      )}
      {showGroupDetailModal && (

        <GroupDetailModal

            assignment={activeAssignment}

            onClose={() =>
                setShowGroupDetailModal(false)
            }

        />

    )}
    </div>
  );
};

export default Index;
