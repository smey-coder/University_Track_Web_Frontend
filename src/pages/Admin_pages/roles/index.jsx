import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";

import { useAuth } from "../../../hooks/useAuth";

import CreateModal from "./CreateModal";
import UpdateModal from "./UpdateModal";
import ShowModal from "./ShowModal";

import "./roles.css";

const Index = () => {
  const { user } = useAuth();

  // ===============================
  // STATE
  // ===============================

  const [roles, setRoles] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
    current_page: 1,

    last_page: 1,
  });

  const [activeRole, setActiveRole] = useState(null);

  const [modalType, setModalType] = useState(null);

  // ===============================
  // PERMISSION CHECK
  // ===============================

  const hasPermission = (permission) => {
    if (!user) return false;

    return user.permissions && user.permissions.includes(permission);
  };

  const canViewRole = hasPermission("role.view");

  const canCreateRole = hasPermission("role.create");

  const canUpdateRole = hasPermission("role.update");

  const canDeleteRole = hasPermission("role.delete");

  // ===============================
  // API
  // ===============================

  const API_URL = "http://192.168.100.39:8000/api/web/roles";

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // ===============================
  // FETCH ROLES
  // ===============================

  const fetchRoles = async (page = 1) => {
    if (!canViewRole) {
      setLoading(false);

      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}?page=${page}&search=${search}`,

        getHeaders(),
      );

      if (response.data.success) {
        setRoles(response.data.data.data || []);

        setPagination({
          current_page: response.data.data.current_page,

          last_page: response.data.data.last_page,
        });
      }
    } catch (error) {
      console.error(error);

      toast.error("Failed loading roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [canViewRole]);

  // ===============================
  // DELETE ROLE
  // ===============================

  const handleDelete = (id, name) => {
    Swal.fire({
      title: "Are you sure?",

      text: `Delete role ${name}?`,

      icon: "warning",

      showCancelButton: true,

      confirmButtonColor: "#ef4444",

      cancelButtonColor: "#94a3b8",

      confirmButtonText: "Yes, Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `${API_URL}/${id}`,

            getHeaders(),
          );

          if (response.data.success) {
            toast.success("Role deleted successfully");

            fetchRoles(pagination.current_page);
          }
        } catch (error) {
          toast.error("Delete failed");
        }
      }
    });
  };

  // ===============================
  // SEARCH
  // ===============================

  const handleSearch = () => {
    fetchRoles(1);
  };

  return (
    <div className="role-page">
      <Toaster position="top-right" />

      {/* ===============================
    NO PERMISSION
================================ */}

      {!canViewRole && (
        <div className="permission-denied-box">
          403 - You don't have permission to view roles.
        </div>
      )}

      {canViewRole && (
        <>
          {/* HEADER */}

          <div className="role-header">
            <div>
              <h2>🛡 Role Management</h2>

              <p>Manage user roles and system access.</p>
            </div>

            {canCreateRole && (
              <button
                className="add-role-btn"
                onClick={() => setModalType("create")}
              >
                ➕ Add Role
              </button>
            )}
          </div>

          {/* SEARCH */}

          <div className="role-search">
            <input
              type="text"
              placeholder="Search role name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
          </div>

          {/* TABLE */}

          <div className="role-table-card">
            {loading ? (
              <div className="loading">Loading roles...</div>
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
                  {roles.length > 0 ? (
                    roles.map((role) => (
                      <tr key={role.id}>
                        <td>{role.id}</td>

                        <td
                          className="clickable"
                          onClick={() => {
                            setActiveRole(role);

                            setModalType("show");
                          }}
                        >
                          <strong>{role.name}</strong>
                        </td>

                        <td>
                          <span className="guard-badge">{role.guard_name}</span>
                        </td>

                        <td>
                          {canUpdateRole && (
                            <button
                              className="edit-btn"
                              onClick={() => {
                                setActiveRole(role);

                                setModalType("update");
                              }}
                            >
                              ✏ Edit
                            </button>
                          )}

                          {canDeleteRole && (
                            <button
                              className="delete-btn"
                              onClick={() => {
                                handleDelete(
                                  role.id,

                                  role.name,
                                );
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
                      <td colSpan="4">No roles found</td>
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
              onClick={() => fetchRoles(pagination.current_page - 1)}
            >
              Previous
            </button>

            <span>
              Page {pagination.current_page}/{pagination.last_page}
            </span>

            <button
              disabled={pagination.current_page === pagination.last_page}
              onClick={() => fetchRoles(pagination.current_page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* CREATE */}

      {modalType === "create" && (
        <CreateModal
          onClose={() => setModalType(null)}
          onSuccess={() => {
            setModalType(null);

            fetchRoles();
          }}
        />
      )}

      {/* UPDATE */}

      {modalType === "update" && (
        <UpdateModal
          role={activeRole}
          onClose={() => setModalType(null)}
          onSuccess={() => {
            setModalType(null);

            fetchRoles();
          }}
        />
      )}

      {/* SHOW */}

      {modalType === "show" && (
        <ShowModal role={activeRole} onClose={() => setModalType(null)} />
      )}
    </div>
  );
};

export default Index;
