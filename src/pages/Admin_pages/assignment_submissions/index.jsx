import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";

import CreateModal from "./CreateModal";
import UpdateModal from "./UpdateModal";
import ShowModal from "./ShowModal";
import GradeModal from "./GradeModal";

import { useAuth } from "../../../hooks/useAuth";

import "./assignment_submissions.css";

const Index = () => {
  const { user } = useAuth();

  // ==============================
  // STATE
  // ==============================

  const [submissions, setSubmissions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const [modalType, setModalType] = useState(null);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });

  // ==============================
  // API
  // ==============================

  const API_URL = "http://192.168.100.39:8000/api/web/assignment-submissions";

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // ==============================
  // PERMISSION
  // ==============================

  const hasPermission = (permission) => {
    if (!user?.permissions) return false;

    return user.permissions.includes(permission);
  };

  const isAdmin = user?.roles?.includes("Admin");

  const isTeacher = user?.roles?.includes("Teacher");

  const isStudent = user?.roles?.includes("Student");

  const canView = hasPermission("assignment_submission.view");

  const canCreate = hasPermission("assignment_submission.create");

  const canUpdate = hasPermission("assignment_submission.update");

  const canDelete = hasPermission("assignment_submission.delete");

  const canGrade = hasPermission("assignment_submission.grade");

  // ==============================
  // TOAST STYLE
  // ==============================

  const toastStyles = {
    success: {
      background: "#16a34a",
      color: "#fff",
    },

    error: {
      background: "#dc2626",
      color: "#fff",
    },
  };

  // ==============================
  // LOAD SUBMISSIONS
  // ==============================

  const fetchSubmissions = async (page = 1) => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}?page=${page}`, getHeaders());

      if (response.data.success) {
        setSubmissions(response.data.data || []);

        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.log(error);

      toast.error("Failed loading submissions", {
        style: toastStyles.error,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // ==============================
  // SEARCH
  // ==============================

  const filteredSubmissions =
Array.isArray(submissions)

?
submissions.filter((item)=>{


    const title =
    item.assignment?.title || "";



    const student =
    item.student?.first_name_english || "";



    return (

        title
        .toLowerCase()
        .includes(
            search.toLowerCase()
        )

        ||

        student
        .toLowerCase()
        .includes(
            search.toLowerCase()
        )

    );


})

:

[];

  // ==============================
  // DELETE
  // ==============================

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Submission?",

      text: "This action cannot be undone",

      icon: "warning",

      showCancelButton: true,

      confirmButtonText: "Delete",

      confirmButtonColor: "#dc2626",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `${API_URL}/delete/${id}`,

            getHeaders(),
          );

          if (response.data.success) {
            toast.success("Submission deleted", {
              style: toastStyles.success,
            });

            fetchSubmissions(pagination.current_page);
          }
        } catch (error) {
          toast.error("Delete failed", {
            style: toastStyles.error,
          });
        }
      }
    });
  };
  // ==============================
  // STATUS BADGE
  // ==============================

  const statusBadge = (status) => {
    switch (status) {
      case "Submitted":
        return "bg-primary";

      case "Graded":
        return "bg-success";

      case "Late":
        return "bg-danger";

      case "Pending":
        return "bg-warning text-dark";

      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="submission-page">
      <Toaster position="top-right" />

      {/* ==============================
          HEADER
      ============================== */}

      <div className="submission-header">
        <div>
          <h2>📚 Assignment Submission Management</h2>

          <p>Manage student assignment submissions, grading and feedback.</p>
        </div>

        {/* STUDENT CREATE */}

        {isStudent && canCreate && (
          <button
            className="add-submission-btn"
            onClick={() => {
              setModalType("create");
            }}
          >
            ➕ Submit Assignment
          </button>
        )}
      </div>

      {/* ==============================
            SEARCH
      ============================== */}

      <div className="submission-search">
        <input
          type="text"
          placeholder="🔍 Search student or assignment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ==============================
            TABLE
      ============================== */}

      <div className="submission-table-card">
        {loading ? (
          <div className="loading">Loading submissions...</div>
        ) : (
          <table className="submission-table">
            <thead>
              <tr>
                <th>Assignment</th>

                <th>Student</th>

                <th>Course</th>

                <th>Teacher</th>

                <th>Submitted</th>

                <th>Score</th>

                <th>Status</th>

                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((submission) => (
                  <tr key={submission.id}>
                    {/* Assignment */}

                    <td>
                      <strong>{submission.assignment?.title}</strong>

                      <br />

                      <small>{submission.assignment?.assignment_code}</small>
                    </td>

                    {/* Student */}

                    <td>
                      {submission.student?.first_name_english}{" "}
                      {submission.student?.last_name_english}
                    </td>

                    {/* Course */}

                    <td>{submission.assignment?.course?.course_name}</td>

                    {/* Teacher */}

                    <td>
                      {submission.assignment?.teacher?.first_name_english}{" "}
                      {submission.assignment?.teacher?.last_name_english}
                    </td>

                    {/* Submit Date */}

                    <td>
                      {submission.submitted_at
                        ? new Date(submission.submitted_at).toLocaleDateString()
                        : "-"}
                    </td>

                    {/* Score */}

                    <td>
                      {submission.score ? `${submission.score}` : "Not graded"}
                    </td>

                    {/* Status */}

                    <td>
                      <span
                        className={`badge ${statusBadge(submission.status)}`}
                      >
                        {submission.status}
                      </span>
                    </td>

                    {/* ACTION */}

                    <td className="action-column">
                      {/* VIEW */}

                      {canView && (
                        <button
                          className="show-btn"
                          onClick={() => {
                            setSelectedSubmission(submission);

                            setModalType("show");
                          }}
                        >
                          👁 View
                        </button>
                      )}

                      {/* GRADE */}

                      {(isTeacher || isAdmin) &&
                        canGrade &&
                        (submission.status === "Graded" ||
                        submission.status === "Submitted") && (
                          <button
                            className="grade-btn"
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setModalType("grade");
                            }}
                          >
                            📝 Grade
                          </button>
                      )}

                      {/* UPDATE STUDENT */}

                      {isStudent &&
                        canUpdate &&
                        submission.status !== "Graded" && (
                          <button
                            className="edit-btn"
                            onClick={() => {
                              setSelectedSubmission(submission);

                              setModalType("update");
                            }}
                          >
                            ✏ Edit
                          </button>
                        )}

                      {/* DELETE ADMIN */}

                      {isAdmin && canDelete && (
                        <button
                          className="delete-btn"
                          onClick={() => {
                            handleDelete(submission.id);
                          }}
                        >
                          🗑 Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-data">
                    No submissions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      {/* ==============================
            PAGINATION
      ============================== */}

      <div className="pagination-footer">
        <button
          className="pagination-btn"
          disabled={pagination.current_page === 1}
          onClick={() => {
            fetchSubmissions(pagination.current_page - 1);
          }}
        >
          ◀ Previous
        </button>

        <span>
          Page {pagination.current_page} of {pagination.last_page}
        </span>

        <button
          className="pagination-btn"
          disabled={pagination.current_page === pagination.last_page}
          onClick={() => {
            fetchSubmissions(pagination.current_page + 1);
          }}
        >
          Next ▶
        </button>
      </div>

      {/* ==============================
            CREATE MODAL
      ============================== */}

      {modalType === "create" && (
        <CreateModal
          onClose={() => {
            setModalType(null);
          }}
          onSuccess={() => {
            setModalType(null);

            fetchSubmissions(pagination.current_page);
          }}
          toastStyles={toastStyles}
        />
      )}

      {/* ==============================
            UPDATE MODAL
      ============================== */}

      {modalType === "update" && (
        <UpdateModal
          submission={selectedSubmission}
          onClose={() => {
            setModalType(null);
          }}
          onSuccess={() => {
            setModalType(null);

            fetchSubmissions(pagination.current_page);
          }}
          toastStyles={toastStyles}
        />
      )}

      {/* ==============================
            SHOW MODAL
      ============================== */}

      {modalType === "show" && (
        <ShowModal
          submission={selectedSubmission}
          onClose={() => {
            setModalType(null);
          }}
        />
      )}

      {/* ==============================
            GRADE MODAL
      ============================== */}

      {modalType === "grade" && (
        <GradeModal
          submission={selectedSubmission}
          onClose={() => {
            setModalType(null);
          }}
          onSuccess={() => {
            setModalType(null);

            fetchSubmissions(pagination.current_page);
          }}
          toastStyles={toastStyles}
        />
      )}
    </div>
  );
};

export default Index;
