import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import CreateModal from "./CreateModal";
import UpdateModal from "./UpdateModal";
import ShowModal from "./ShowModal";
import { useAuth } from "../../../hooks/useAuth";
import "./students.css";

const Index = () => {
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // State variables for form dependency structures (Dropdown lists)
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);

  // Pointers and visibility flags for split modals
  const [activeStudent, setActiveStudent] = useState(null);
  const [modalType, setModalType] = useState(null); // Values: 'create' | 'update' | 'show' | null

  const { user } = useAuth();

  // ===============================
  // PERMISSION
  // ===============================
  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) ?? false;
  };
  const canView = hasPermission("student.view");
  const canCreate = hasPermission("student.create");
  const canUpdate = hasPermission("student.update");
  const canDelete = hasPermission("student.delete");

  // Centralized Toast Notification Styles
  const toastStyles = {
    success: {
      background: "#22c55e",
      color: "#fff",
      fontWeight: "500",
      borderRadius: "10px",
    },
    error: {
      background: "#ef4444",
      color: "#fff",
      fontWeight: "500",
      borderRadius: "10px",
    },
  };

  // Safe header configuration extractor containing Sanctum JWT parameters
  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  // READ: Query paginated collection arrays from core API endpoint
  const fetchStudents = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://192.168.100.39:8000/api/web/students?page=${page}`,
        getHeaders(),
      );
      if (response.data.success) {
        setStudents(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      toast.error("❌ Failed to parse data stream from API registry.", {
        style: toastStyles.error,
      });
    } finally {
      setLoading(false);
    }
  };

  // INITIALIZATION: Load data grids alongside drop-down tracking dependencies
  useEffect(() => {
    fetchStudents();
    const fetchDependencies = async () => {
      try {
        const response = await axios.get(
          "http://192.168.100.39:8000/api/web/students/form-dependencies",
          getHeaders(),
        );
        if (response.data.success) {
          setDepartments(response.data.departments);
          setClasses(response.data.classes);
        }
      } catch (err) {
        console.error("Could not fetch validation lookup data.", err);
      }
    };
    fetchDependencies();
  }, []);

  // DELETE: Safe deletion execution with explicit prompt confirmations via SweetAlert2
  const handleDelete = (id, name) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to permanently delete ${name}'s registry record?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, remove profile",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `http://192.168.100.39:8000/api/web/students/${id}`,
            getHeaders(),
          );
          if (response.data.success) {
            toast.success("🗑️ Student profile removed successfully!", {
              style: toastStyles.success,
            });
            fetchStudents(pagination.current_page);
          }
        } catch (err) {
          toast.error("❌ Could not remove requested data structure item.", {
            style: toastStyles.error,
          });
        }
      }
    });
  };

  // Client side lookup computation filters
  const filteredStudents = students.filter((student) => {
    const fullName =
      `${student.first_name_english} ${student.last_name_english}`.toLowerCase();
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      student.student_code?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="students-page-wrapper">
      {/* Toast Notification Container Overlay */}
      <Toaster position="top-right" />

      {/* Action Header Banner */}
      <div className="registry-header-panel">
        <div className="header-titles">
          <h2>Student Registry Management</h2>
          <p>
            Configure, enroll, and monitor system parameters for registered
            student accounts.
          </p>
        </div>
        
        {canCreate &&(
          <button
          onClick={() => setModalType("create")}
          className="add-student-master-btn"
        >
          ➕ Register Student
        </button>
        )}
        
      </div>

      {/* Control Configuration Filter Row */}
      <div className="search-filter-card">
        <input
          type="text"
          className="registry-search-input"
          placeholder="🔍 Search entries by code or name parameters..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Data Layout Grid */}
      <div className="table-container-card">
        {loading ? (
          <div className="table-loading-spinner">
            Processing secure API records payload...
          </div>
        ) : (
          <>
            <table className="student-data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name (English)</th>
                  <th>Gender</th>
                  <th>Department</th>
                  <th>Class Unit</th>
                  <th>Status</th>
                  <th style={{ textAlign: "center" }}>Management Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <strong>{student.student_code}</strong>
                      </td>
                      {/* Name links to the individual 'Show' visualization viewport */}
                      <td
                        className="clickable-name"
                        onClick={() => {
                          setActiveStudent(student);
                          setModalType("show");
                        }}
                      >
                        {student.first_name_english} {student.last_name_english}
                      </td>
                      <td>{student.gender}</td>
                      <td>
                        {student.department?.department_name_english || "N/A"}
                      </td>
                      <td>{student.classes?.class_name || "N/A"}</td>
                      <td>
                        <span
                          className={`status-badge ${student.status.toLowerCase()}`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div className="action-row-buttons">
                          {canUpdate && (
                            <button
                              onClick={() => {
                                setActiveStudent(student);
                                setModalType("update");
                              }}
                              className="row-edit-action-btn"
                            >
                              ✏️ Edit
                            </button>
                          )}
                          {canDelete && (
                            <button
                            onClick={() =>
                              handleDelete(
                                student.id,
                                student.first_name_english,
                              )
                            }
                            className="row-delete-action-btn"
                          >
                            🗑️ Delete
                          </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="table-empty-fallback">
                      No data tracking records match your active query
                      constraints.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Segment bar */}
            <div className="pagination-footer-bar">
              <button
                disabled={pagination.current_page === 1}
                onClick={() => fetchStudents(pagination.current_page - 1)}
                className="pagination-nav-btn"
              >
                Previous
              </button>
              <span>
                Page {pagination.current_page} of {pagination.total_pages}
              </span>
              <button
                disabled={pagination.current_page === pagination.total_pages}
                onClick={() => fetchStudents(pagination.current_page + 1)}
                className="pagination-nav-btn"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* ==========================================
          DYNAMIC SUB-MODAL RENDER ENGINE 
         ========================================== */}
      {modalType === "create" && (
        <CreateModal
          departments={departments}
          classes={classes}
          onClose={() => setModalType(null)}
          onSuccess={() => {
            setModalType(null);
            fetchStudents(pagination.current_page);
          }}
          toastStyles={toastStyles}
        />
      )}

      {modalType === "update" && (
        <UpdateModal
          student={activeStudent}
          departments={departments}
          classes={classes}
          onClose={() => setModalType(null)}
          onSuccess={() => {
            setModalType(null);
            fetchStudents(pagination.current_page);
          }}
          toastStyles={toastStyles}
        />
      )}

      {modalType === "show" && (
        <ShowModal student={activeStudent} onClose={() => setModalType(null)} />
      )}
    </div>
  );
};

export default Index;
