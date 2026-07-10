import { Outlet, NavLink, useNavigate } from "react-router-dom";

import { useState } from "react";

import { useAuth } from "../hooks/useAuth";

import Swal from "sweetalert2";

import "./adminLayout.css";

const AdminLayout = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [courseOpen, setCourseOpen] = useState(false);
  const [RBACOpen, setRBACOpen] = useState(false);
  // Dark Mode

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);

    document.body.classList.toggle("dark-mode");
  };

  // Logout
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",

      text: "Do you really want to sign out?",

      icon: "warning",

      showCancelButton: true,

      confirmButtonText: "Yes, Sign Out",

      cancelButtonText: "Cancel",

      reverseButtons: true,

      confirmButtonColor: "#4f46e5",

      cancelButtonColor: "#94a3b8",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await logout();

          navigate("/login");
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  return (
    <div
      className={`admin-layout-wrapper 
                ${darkMode ? "dark" : ""}`}
    >
      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      {/* SIDEBAR */}

      <aside
        className={sidebarOpen ? "admin-sidebar show" : "admin-sidebar hide"}
      >
        <div className="sidebar-brand">
          <img 
              src="/public/images/logo.png" 
              alt="UniTrack Logo"
              className="sidebar-logo"
          />

          <div className="brand-text">
              <h3>Univeristy Track</h3>
          </div>
      </div>
        <ul className="sidebar-menu-links">
          <li>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                isActive ? "nav-link-item active" : "nav-link-item"
              }
            >
              📊 Dashboard
            </NavLink>
            </li>
            <li>
            <button
                className="nav-link-item dropdown-btn"
                onClick={() => setRBACOpen(!RBACOpen)}
            >
                📚 RBAC
                <span>
                    {RBACOpen ? "▲" : "▼"}
                </span>
            </button>
            {
                RBACOpen && (
                    <ul className="submenu">
                        <li>
                            <NavLink
                                to="/admin/courses"
                                className={({isActive}) =>
                                    isActive
                                    ?
                                    "submenu-link active"
                                    :
                                    "submenu-link"
                                }
                            >
                                👤 Users

                            </NavLink>

                        </li>
                        <li>
                            <NavLink
                                to="/admin/courses/create"
                                className={({isActive}) =>
                                    isActive
                                    ?
                                    "submenu-link active"
                                    :
                                    "submenu-link"
                                }
                            >
                                ⚖️ Roles
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/admin/course-category"
                                className={({isActive}) =>
                                    isActive
                                    ?
                                    "submenu-link active"
                                    :
                                    "submenu-link"
                                }
                            >
                                🔐 Permissions
                            </NavLink>
                        </li>
                    </ul>
                )
            }
        </li>

          <li>
            <NavLink
              to="/admin/students"
              className={({ isActive }) =>
                isActive ? "nav-link-item active" : "nav-link-item"
              }
            >
              👥 Students
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/teachers"
              className={({ isActive }) =>
                isActive ? "nav-link-item active" : "nav-link-item"
              }
            >
              👨‍🏫 Teachers
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/departments"
              className={({ isActive }) =>
                isActive ? "nav-link-item active" : "nav-link-item"
              }
            >
              🏢 Departments
            </NavLink>
          </li>

            <li>
              <button
                  className="nav-link-item dropdown-btn"
                  onClick={() => setCourseOpen(!courseOpen)}
              >
                  📚 Courses
                  <span>
                      {courseOpen ? "▲" : "▼"}
                  </span>
              </button>
              {
                  courseOpen && (
                      <ul className="submenu">
                          <li>
                              <NavLink
                                  to="/admin/courses"
                                  className={({isActive}) =>
                                      isActive
                                      ?
                                      "submenu-link active"
                                      :
                                      "submenu-link"
                                  }
                              >
                                  📋 All Courses

                              </NavLink>

                          </li>
                          <li>
                              <NavLink
                                  to="/admin/courses/create"
                                  className={({isActive}) =>
                                      isActive
                                      ?
                                      "submenu-link active"
                                      :
                                      "submenu-link"
                                  }
                              >
                                  ➕ Add Course
                              </NavLink>
                          </li>
                          <li>
                              <NavLink
                                  to="/admin/course-category"
                                  className={({isActive}) =>
                                      isActive
                                      ?
                                      "submenu-link active"
                                      :
                                      "submenu-link"
                                  }
                              >
                                  🗂 Categories
                              </NavLink>
                          </li>
                      </ul>
                  )
              }
          </li>
          <li>
            <NavLink
              to="/admin/assigments"
              className={({ isActive }) =>
                isActive ? "nav-link-item active" : "nav-link-item"
              }
            >
              📝 Assignments
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/schedules"
              className={({ isActive }) =>
                isActive ? "nav-link-item active" : "nav-link-item"
              }
            >
              📅 Schedules
            </NavLink>
          </li>
        </ul>
      </aside>

      {/* MAIN AREA */}

      <div
        className={
          sidebarOpen ? "app-container-body" : "app-container-body full"
        }
      >
        {/* NAVBAR */}
        <nav className="admin-navbar">
          {/* MOBILE MENU BUTTON */}

          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            ☰
          </button>
          <div className="navbar-actions">
            {/* DARK MODE */}

            <button className="icon-btn" onClick={toggleDarkMode}>
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* NOTIFICATION */}

            <div className="dropdown-container">
              <button
                className="icon-btn"
                onClick={() => setNotificationOpen(!notificationOpen)}
              >
                🔔
                <span className="notification-badge">3</span>
              </button>

              {notificationOpen && (
                <div className="dropdown-menu">
                  <h4>Notifications</h4>

                  <p>🎓 New student registered</p>

                  <p>📅 New schedule added</p>

                  <p>⚙ System update</p>
                </div>
              )}
            </div>
            {/* USER DROPDOWN */}
            <div className="dropdown-container">
              <button
                className="user-profile-badge"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                👤
                <span>{user?.username || "User"}</span>▼
              </button>
              {profileOpen && (
                <div className="dropdown-menu user-menu">
                  <button>👤 Profile</button>
                  <button>⚙ Settings</button>
                  <button onClick={handleLogout}>🚪 Logout</button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* CONTENT */}

        <main className="admin-main-content">
          <Outlet />
        </main>

        {/* FOOTER */}

        <footer className="admin-footer">
          <p>
            © {new Date().getFullYear()}
            UniTrack University Database System
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
