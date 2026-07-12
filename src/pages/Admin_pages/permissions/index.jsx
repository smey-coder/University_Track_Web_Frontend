import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";

import CreateModal from "./CreateModal";
import UpdateModal from "./UpdateModal";
import ShowModal from "./ShowModal";

import "./permissions.css";

const Index = () => {
  // ===============================
  // STATE
  // ===============================

  const [permissions, setPermissions] = useState([]);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [activePermission, setActivePermission] = useState(null);

  const [modalType, setModalType] = useState(null);

  // ===============================
  // PERMISSION CHECK
  // ===============================

  const user = JSON.parse(localStorage.getItem("user"));

  const hasPermission = (permission) => {
    if (!user?.permissions) return false;

    return user.permissions.includes(permission);
  };

  const canCreate = hasPermission("permission.create");

  const canUpdate = hasPermission("permission.update");

  const canDelete = hasPermission("permission.delete");

  // ===============================
  // API
  // ===============================

  const API_URL = "http://192.168.100.39:8000/api/web/permissions";

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,

      Accept: "application/json",
    },
  });

  // ===============================
  // TOAST STYLE
  // ===============================

  const toastStyles = {
    success: {
      background: "#22c55e",
      color: "#fff",
    },

    error: {
      background: "#ef4444",
      color: "#fff",
    },
  };

  // ===============================
  // FETCH
  // ===============================

  const fetchPermissions = async (page = 1) => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}?page=${page}&search=${search}`,

        getHeaders(),
      );

      if (response.data.success) {
        const result = response.data.data;

        setPermissions(result.data || []);

        setPagination({
          current_page: result.current_page,

          last_page: result.last_page,
        });
      }
    } catch (error) {
      toast.error("Failed loading permissions", {
        style: toastStyles.error,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  // ===============================
  // SEARCH
  // ===============================

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPermissions(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // ===============================
  // DELETE
  // ===============================

  const handleDelete = (id, name) => {
    Swal.fire({
      title: "Are you sure?",

      text: `Delete permission ${name}?`,

      icon: "warning",

      showCancelButton: true,

      confirmButtonColor: "#ef4444",

      confirmButtonText: "Yes Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `${API_URL}/${id}`,

            getHeaders(),
          );

          if (response.data.success) {
            toast.success(
              "Permission deleted",

              {
                style: toastStyles.success,
              },
            );

            fetchPermissions(pagination.current_page);
          }
        } catch (error) {
          toast.error("Delete failed", {
            style: toastStyles.error,
          });
        }
      }
    });
  };

  return (
    <div className="permission-page">
      <Toaster position="top-right" />

      {/* HEADER */}

      <div className="permission-header">
        <div>
          <h2>🔐 Permission Management</h2>

          <p>Manage system permissions.</p>
        </div>

        {canCreate && (
          <button
            className="add-permission-btn"
            onClick={() => setModalType("create")}
          >
            ➕ Add Permission
          </button>
        )}
      </div>

      {/* SEARCH */}

      <div className="permission-search">
        <input
          type="text"
          placeholder="Search permission..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      {/* TABLE */}

      <div className="permission-table-card">
        {loading ? (
          <h3>Loading...</h3>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>

                <th>Name</th>

                <th>Guard</th>

                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {permissions.length > 0 ? (
                permissions.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>

                    <td
                      className="clickable"
                      onClick={() => {
                        setActivePermission(item);

                        setModalType("show");
                      }}
                    >
                      {item.name}
                    </td>

                    <td>
                      <span className="guard-badge">{item.guard_name}</span>
                    </td>

                    <td>
                      {canUpdate && (
                        <button
                          className="edit-btn"
                          onClick={() => {
                            setActivePermission(item);

                            setModalType("update");
                          }}
                        >
                          ✏️ Edit
                        </button>
                      )}

                      {canDelete && (
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(item.id, item.name)}
                        >
                          🗑 Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No Permission Found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}

      <div className="pagination">
        <button
          disabled={pagination.current_page === 1}
          onClick={() => fetchPermissions(pagination.current_page - 1)}
        >
          Previous
        </button>

        <span>
          Page {pagination.current_page} of {pagination.last_page}
        </span>

        <button
          disabled={pagination.current_page === pagination.last_page}
          onClick={() => fetchPermissions(pagination.current_page + 1)}
        >
          Next
        </button>
      </div>

      {/* MODALS */}

      {modalType === "create" && (
        <CreateModal
          onClose={() => setModalType(null)}
          onSuccess={() => fetchPermissions()}
          toastStyles={toastStyles}
        />
      )}

      {modalType === "update" && (
        <UpdateModal
          permission={activePermission}
          onClose={() => setModalType(null)}
          onSuccess={() => fetchPermissions()}
          toastStyles={toastStyles}
        />
      )}

      {modalType === "show" && (
        <ShowModal
          permission={activePermission}
          onClose={() => setModalType(null)}
        />
      )}
    </div>
  );
};

export default Index;
