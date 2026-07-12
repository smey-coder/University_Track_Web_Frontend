import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";

import CreateModal from "./CreateModal";
import UpdateModal from "./UpdateModal";
import ShowModal from "./ShowModal";
import { useAuth } from "../../../hooks/useAuth"; // adjust the path if needed

import "./departments.css";

const Index = () => {
  // ===============================
  // STATE
  // ===============================

  const [departments, setDepartments] = useState([]);

  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDepartment, setActiveDepartment] = useState(null);
  const [modalType, setModalType] = useState(null);

  const { user } = useAuth();

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) ?? false;
  };

  const canViewDepartment = hasPermission("department.view");
  const canCreateDepartment = hasPermission("department.create");
  const canUpdateDepartment = hasPermission("department.update");
  const canDeleteDepartment = hasPermission("department.delete");



  // ===============================
  // API CONFIG
  // ===============================

  const API_URL = "http://192.168.100.39:8000/api/web/departments";

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

  // ===============================
  // FETCH DEPARTMENT
  // ===============================

  const fetchDepartments = async (page = 1) => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${API_URL}?page=${page}`,

        getHeaders(),
      );

      if (response.data.success) {
        const fetchedDepartments = response.data.data;

        setDepartments(
          Array.isArray(fetchedDepartments)
            ? fetchedDepartments
            : (fetchedDepartments?.data ?? []),
        );

        setPagination(response.data.pagination);
      }
    } catch (error) {
      toast.error("❌ Failed loading departments", {
        style: toastStyles.error,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // ===============================
  // DELETE
  // ===============================

  const handleDelete = (id, name) => {
    Swal.fire({
      title: "Are you sure?",

      text: `Delete department ${name}?`,

      icon: "warning",

      showCancelButton: true,

      confirmButtonColor: "#ef4444",

      cancelButtonColor: "#94a3b8",

      confirmButtonText: "Yes, Delete",
    })

      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await axios.delete(
              `${API_URL}/${id}`,

              getHeaders(),
            );

            if (response.data.success) {
              toast.success(
                "🗑️ Department deleted",

                {
                  style: toastStyles.success,
                },
              );

              fetchDepartments(pagination.current_page);
            }
          } catch (error) {
            toast.error(
              "❌ Delete failed",

              {
                style: toastStyles.error,
              },
            );
          }
        }
      });
  };

  // ===============================
  // SEARCH
  // ===============================
  const filteredDepartments = Array.isArray(departments)
    ? departments.filter((department) => {
        const name = department.department_name_english?.toLowerCase();
        const code = department.department_code?.toLowerCase();
        return (
          name?.includes(searchQuery.toLowerCase()) ||
          code?.includes(searchQuery.toLowerCase())
        );
      })
    : [];

  return (
    <div className="department-page-wrapper">
      <Toaster position="top-right" />
      {/* HEADER */}

      <div className="department-header-panel">
        <div>
          <h2>🏢 Department Management</h2>

          <p>Manage university departments, courses and academic structures.</p>
        </div>
         {canCreateDepartment && (
            <button
              className="add-department-btn"
              onClick={() => setModalType("create")}
            >
              ➕ Add Department
            </button>
          )}
      </div>

      {/* SEARCH */}

      <div className="search-filter-card">
        <input
          type="text"
          placeholder="🔍 Search department code or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* TABLE */}

      <div className="table-container-card">
        {loading ? (
          <div className="loading">Loading departments...</div>
        ) : (
          <table className="department-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Khmer Name</th>
                <th>English Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map((department) => (
                  <tr key={department.id}>
                    <td>
                      <strong>{department.department_code}</strong>
                    </td>

                    <td
                      className="clickable-name"
                      onClick={() => {
                        setActiveDepartment(department);
                        setModalType("show");
                      }}
                    >
                      {department.department_name_khmer}
                    </td>

                    <td>{department.department_name_english}</td>

                    <td>
                      <span
                        className={`badge ${
                          department.status === "Active"
                            ? "bg-success"
                            : department.status === "Inactive"
                            ? "bg-danger"
                            : department.status === "Pending"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                        }`}
                      >
                        {department.status}
                      </span>
                    </td>

                    <td>
                      {canUpdateDepartment && (
                        <button
                          className="edit-btn"
                          onClick={() => {
                            setActiveDepartment(department);

                            setModalType("update");
                          }}
                        >
                          ✏️ Edit
                        </button>
                      )}

                      {canDeleteDepartment &&(
                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(
                              department.id,
                              department.department_name_english,
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
                  <td colSpan="7">No department found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ===============================
            PAGINATION
        =============================== */}
      <div className="pagination-footer-bar">
        <button
          disabled={pagination.current_page === 1}
          onClick={() => fetchDepartments(pagination.current_page - 1)}
          className="pagination-btn"
        >
          Previous
        </button>

        <span>
          Page {pagination.current_page} of {pagination.total_pages}
        </span>

        <button
          disabled={pagination.current_page === pagination.total_pages}
          onClick={() => fetchDepartments(pagination.current_page + 1)}
          className="pagination-btn"
        >
          Next
        </button>
      </div>

      {/* ===============================
            CREATE MODAL
        =============================== */}

      {modalType === "create" && (
        <CreateModal
          onClose={() => setModalType(null)}
          onSuccess={() => {
            setModalType(null);

            fetchDepartments(pagination.current_page);
          }}
          toastStyles={toastStyles}
        />
      )}

      {/* ===============================
            UPDATE MODAL
        =============================== */}

      {modalType === "update" && (
        <UpdateModal
          department={activeDepartment}
          onClose={() => setModalType(null)}
          onSuccess={() => {
            setModalType(null);

            fetchDepartments(pagination.current_page);
          }}
          toastStyles={toastStyles}
        />
      )}

      {/* ===============================
            SHOW MODAL
        =============================== */}

      {modalType === "show" && (
        <ShowModal
          department={activeDepartment}
          onClose={() => setModalType(null)}
        />
      )}
    </div>
  );
};
export default Index;
