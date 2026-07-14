import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";

import CreateModal from "./CreateModal";
import UpdateModal from "./UpdateModal";
import ShowModal from "./ShowModal";

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

  const [searchQuery, setSearchQuery] = useState("");

  const [activeAssignment, setActiveAssignment] = useState(null);

  const [modalType, setModalType] = useState(null);

  const { user } = useAuth();

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) ?? false;
  };

  const canCreate = hasPermission("assignment.create");

  const canUpdate = hasPermission("assignment.update");

  const canDelete = hasPermission("assignment.delete");

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
  // FETCH ASSIGNMENTS
  // ===============================

  const fetchAssignments = async (page = 1) => {
    setLoading(true);

    try {
      const response = await axios.get(`${API_URL}?page=${page}`, getHeaders());

      if (response.data.success) {
        setAssignments(response.data.data);

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
    fetchAssignments();
  }, []);

  // ===============================
  // DELETE
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
  // SEARCH
  // ===============================

  const filteredAssignments = assignments.filter((item) => {
    const title = item.title?.toLowerCase() || "";

    const code = item.assignment_code?.toLowerCase() || "";

    return (
      title.includes(searchQuery.toLowerCase()) ||
      code.includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="assignment-page-wrapper">
      <Toaster position="top-right" />

      {/* HEADER */}

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

      {/* SEARCH */}

      <div className="search-filter-card">
        <input
          type="text"
          placeholder="🔍 Search assignment..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* TABLE */}

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

                <th>Teacher</th>

                <th>Due Date</th>

                <th>Score</th>

                <th>Status</th>

                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredAssignments.length > 0 ? (
                filteredAssignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td>
                      <strong>{assignment.assignment_code}</strong>
                    </td>

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

                    <td>
                      {assignment.teacher?.first_name_english}{" "}
                      {assignment.teacher?.last_name_english}
                    </td>

                    <td>{assignment.due_date}</td>

                    <td>{assignment.total_score}</td>

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

                    <td>
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
                  <td colSpan="8">No assignment found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* CREATE */}

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

      {/* UPDATE */}

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

      {/* SHOW */}

      {modalType === "show" && (
        <ShowModal
          assignment={activeAssignment}
          onClose={() => setModalType(null)}
        />
      )}
    </div>
  );
};

export default Index;
