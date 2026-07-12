import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import CreateModal from "./CreateModal";
import UpdateModal from "./UpdateModal";
import ShowModal from "./ShowModal";

import "./role_permissions.css";

const Index = () => {
  const [roles, setRoles] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedRole, setSelectedRole] = useState(null);

  const [modalType, setModalType] = useState(null);

  const API_URL = "http://192.168.100.39:8000/api/web";

  const headers = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  // =================================
  // PERMISSION CHECK
  // =================================

  const user = JSON.parse(localStorage.getItem("user"));

  const hasPermission = (permission) => {
    if (!user) return false;

    return user.permissions && user.permissions.includes(permission);
  };

  // =================================
  // FETCH ROLES
  // =================================

  const fetchRoles = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/roles`,

        headers,
      );

      if (response.data.success) {
        setRoles(response.data.data.data);
      }
    } catch (error) {
      console.error(error);

      if (error.response?.status === 403) {
        toast.error("You don't have permission");
      } else {
        toast.error("Failed loading roles");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="permission-page">
      <Toaster position="top-right" />

      {/* HEADER */}

      <div className="permission-header">
        <div>
          <h2>🔐 Role Permission Management</h2>

          <p>Assign permissions to system roles</p>
        </div>

        {/* {hasPermission("role_permission.create") && (
          <button
            className="create-btn"
            onClick={() => {
              setSelectedRole(null);

              setModalType("create");
            }}
          >
            ➕ Assign Permission
          </button>
        )} */}
      </div>

      {/* TABLE */}

      <div className="permission-table-card">
        {loading ? (
          <h3 className="loading">Loading roles...</h3>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>

                <th>Role</th>

                <th>Guard</th>

                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {roles.length > 0 ? (
                roles.map((role) => (
                  <tr key={role.id}>
                    <td>{role.id}</td>

                    <td>
                      <span className="role-badge">{role.name}</span>
                    </td>

                    <td>
                      <span className="guard-badge">{role.guard_name}</span>
                    </td>

                    <td>
                      {hasPermission("role_permission.view") && (
                        <button
                          className="show-btn"
                          onClick={() => {
                            setSelectedRole(role);

                            setModalType("show");
                          }}
                        >
                          👁 View
                        </button>
                      )}

                      {hasPermission("role_permission.update") && (
                        <button
                          className="edit-btn"
                          onClick={() => {
                            setSelectedRole(role);

                            setModalType("update");
                          }}
                        >
                          ✏ Manage
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
          role={selectedRole}
          onClose={() => setModalType(null)}
          onSuccess={() => {
            setModalType(null);

            fetchRoles();
          }}
        />
      )}

      {/* SHOW */}

      {modalType === "show" && (
        <ShowModal role={selectedRole} onClose={() => setModalType(null)} />
      )}
    </div>
  );
};

export default Index;
