import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";

import CreateModal from "./CreateModal";
import UpdateModal from "./UpdateModal";
import ShowModal from "./ShowModal";

import { hasPermission } from "../../../utils/permission";

import "./users.css";

const Index = () => {
  const [users, setUsers] = useState([]);

  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
  });

  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");

  const [roles, setRoles] = useState([]);

  const [activeUser, setActiveUser] = useState(null);

  const [modalType, setModalType] = useState(null);

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

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const normalizeListData = (value) => {
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
      if (Array.isArray(value.data)) return value.data;
      if (Array.isArray(value.roles)) return value.roles;
      if (Array.isArray(value.items)) return value.items;
    }
    return [];
  };

  // ==========================
  // Fetch Users
  // ==========================

  const fetchUsers = async (page = 1) => {
    setLoading(true);

    try {
      const response = await axios.get(
        `http://192.168.100.39:8000/api/web/users?page=${page}`,

        getHeaders(),
      );

      if (
        response.data.success ||
        response.data.current_page ||
        response.data.data
      ) {
        const usersPayload = response.data?.data ?? response.data;
        const normalizedUsers = normalizeListData(usersPayload);

        setUsers(normalizedUsers);

        const paginationPayload = response.data?.pagination || {
          current_page: response.data?.current_page || 1,
          total_pages: response.data?.last_page || 1,
        };

        setPagination(paginationPayload);
      }
    } catch (error) {
      toast.error("❌ Cannot load users", {
        style: toastStyles.error,
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Fetch Roles
  // ==========================

  const fetchRoles = async () => {
    try {
      const response = await axios.get(
        "http://192.168.100.39:8000/api/web/roles",

        getHeaders(),
      );

      if (response.data.success || response.data.data || response.data.roles) {
        const rolesPayload = response.data?.data ?? response.data;
        const normalizedRoles = normalizeListData(rolesPayload);

        setRoles(normalizedRoles);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();

    fetchRoles();
  }, []);

  // ==========================
  // Delete User
  // ==========================

  const handleDelete = (id, username) => {
    Swal.fire({
      title: "Are you sure?",

      text: `Delete ${username}?`,

      icon: "warning",

      showCancelButton: true,

      confirmButtonColor: "#ef4444",

      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `http://192.168.100.39:8000/api/web/users/${id}`,

            getHeaders(),
          );

          if (response.data.success) {
            toast.success("User deleted successfully", {
              style: toastStyles.success,
            });

            fetchUsers(pagination.current_page);
          }
        } catch (error) {
          toast.error("Delete failed", {
            style: toastStyles.error,
          });
        }
      }
    });
  };

  // ==========================
  // Search
  // ==========================

  const filteredUsers = users.filter((user) => {
    return (
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="users-page-wrapper">
      <Toaster position="top-right" />

      <div className="registry-header-panel">
        <div>
          <h2>User Management</h2>

          <p>Manage system users and roles</p>
        </div>

        {hasPermission("user.create") && (
          <button
            className="add-user-btn"
            onClick={() => setModalType("create")}
          >
            ➕ Create User
          </button>
        )}
      </div>

      <div className="search-filter-card">
        <input
          className="registry-search-input"
          placeholder="🔍 Search username or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="table-container-card">
        {loading ? (
          <div className="table-loading-spinner">Loading users...</div>
        ) : (
          <table className="student-data-table">
            <thead>
              <tr>
                <th>ID</th>

                <th>Username</th>

                <th>Email</th>

                <th>Roles</th>

                <th>Status</th>

                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>

                    <td
                      className="clickable-name"
                      onClick={() => {
                        setActiveUser(user);

                        setModalType("show");
                      }}
                    >
                      {user.username}
                    </td>

                    <td>{user.email}</td>

                    <td>
                      {normalizeListData(user.roles).map((role, index) => {
                        const roleName =
                          typeof role === "string"
                            ? role
                            : role?.name || "Role";

                        return (
                          <span
                            key={`${roleName}-${index}`}
                            className="role-badge"
                          >
                            {roleName}
                          </span>
                        );
                      })}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          user.is_active ? "active" : "inactive"
                        }`}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <div className="action-row-buttons">
                        {hasPermission("user.update") && (
                          <button
                            className="row-edit-action-btn"
                            onClick={() => {
                              setActiveUser(user);

                              setModalType("update");
                            }}
                          >
                            ✏️ Edit
                          </button>
                        )}

                        {hasPermission("user.delete") && (
                          <button
                            className="row-delete-action-btn"
                            onClick={() => handleDelete(user.id, user.username)}
                          >
                            🗑 Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="pagination-footer-bar">
        <button
          disabled={pagination.current_page === 1}
          onClick={() => fetchUsers(pagination.current_page - 1)}
        >
          Previous
        </button>

        <span>
          Page {pagination.current_page}
          of
          {pagination.total_pages}
        </span>

        <button
          disabled={pagination.current_page === pagination.total_pages}
          onClick={() => fetchUsers(pagination.current_page + 1)}
        >
          Next
        </button>
      </div>

      {modalType === "create" && (
        <CreateModal
          roles={roles}
          onClose={() => setModalType(null)}
          onSuccess={() => {
            setModalType(null);

            fetchUsers();
          }}
        />
      )}

      {modalType === "update" && (
        <UpdateModal
          user={activeUser}
          roles={roles}
          onClose={() => setModalType(null)}
          onSuccess={() => {
            setModalType(null);

            fetchUsers();
          }}
        />
      )}

      {modalType === "show" && (
        <ShowModal user={activeUser} onClose={() => setModalType(null)} />
      )}
    </div>
  );
};

export default Index;
