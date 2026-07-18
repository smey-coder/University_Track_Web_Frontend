import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Swal from "sweetalert2";
import "./adminLayout.css";

const AppLayout = () => {
  const { user, logout } = useAuth();
  console.log("Logged in user details:", user);
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [courseOpen, setCourseOpen] = useState(false);
  const [RBACOpen, setRBACOpen] = useState(false);
  const [AssignmentOpen, setAssignmentOpen] = useState(false);
  const [classOpen, setClassOpen] = useState(false);

  // Helper function to check if a user has a specific permission
  // Handles cases where permissions might be an array or string
  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };
  // Inside AppLayout.jsx
  const getRolePrefix = () => {
    const currentRole = (user?.role || "student" || "admin" || "teacher").toLowerCase();
    return `/${currentRole}`; // Returns "/admin", "/teacher", or "/student"
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode");
  };

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
          console.error("Logout failed:", error);
        }
      }
    });
  };

  // Pre-calculate what sections the user can see to keep the JSX clean
  const canViewDashboard = hasPermission("dashboard.view");
  const canViewUsers = hasPermission("user.view");
  const canViewStudents = hasPermission("student.view");
  const canViewTeachers = hasPermission("teacher.view");
  const canViewDepartments = hasPermission("department.view");
  const canViewClassroom = hasPermission("class_room.view");
  
  // RBAC dropdown is visible if the user can see users, roles, or permissions
  const canViewRBAC = canViewUsers || hasPermission("role.view") || hasPermission("permission.view") || hasPermission("role_permission.view");
  
  // Courses dropdown is visible if they can see courses or categories
  const canViewCourses = hasPermission("course.view") || hasPermission("category.view");

  const canViewAssignment = hasPermission("assignment.view") || hasPermission("assigment_submission.view");

  const canViewClass = hasPermission("class.view" || hasPermission("class_manager.view"));

  return (
    <div className={`admin-layout-wrapper ${darkMode ? "dark" : ""}`}>
      {sidebarOpen && (
        <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={sidebarOpen ? "admin-sidebar show" : "admin-sidebar hide"}>
        <div className="sidebar-brand">
          <img src="/images/logo.png" alt="UniTrack Logo" className="sidebar-logo" />
          <div className="brand-text">
            <h3>University Track</h3>
          </div>
        </div>

        <ul className="sidebar-menu-links">
          {/* Dashboard Link */}
          {/* Inside the sidebar menu links ul in AppLayout.jsx */}
          {canViewDashboard && (
            <li>
              <NavLink
                to={`${getRolePrefix()}/dashboard`} /* 👈 THIS MUST MATCH EXACTLY */
                className={({ isActive }) => (isActive ? "nav-link-item active" : "nav-link-item")}
              >
                📊 Dashboard
              </NavLink>
            </li>
          )}

          {/* RBAC Dropdown Link */}
          {canViewRBAC && (
            <li>
              <button className="nav-link-item dropdown-btn" onClick={() => setRBACOpen(!RBACOpen)}>
                📚 RBAC <span>{RBACOpen ? "▲" : "▼"}</span>
              </button>
              {RBACOpen && (
                <ul className="submenu">
                  {canViewUsers && (
                    <li>
                      <NavLink to={`${getRolePrefix()}/users`} className={({ isActive }) => (isActive ? "submenu-link active" : "submenu-link")}>
                        👤 Users
                      </NavLink>
                    </li>
                  )}
                  {hasPermission("role.view") && (
                    <li>
                      <NavLink to={`${getRolePrefix()}/roles`} className={({ isActive }) => (isActive ? "submenu-link active" : "submenu-link")}>
                        ⚖️ Roles
                      </NavLink>
                    </li>
                  )}
                  {hasPermission("permission.view") && (
                    <li>
                      <NavLink to={`${getRolePrefix()}/permissions`} className={({ isActive }) => (isActive ? "submenu-link active" : "submenu-link")}>
                        🔐 Permissions
                      </NavLink>
                    </li>
                  )}
                  {hasPermission("role_permission.view") && (
                    <li>
                      <NavLink to={`${getRolePrefix()}/role_permission`} className={({ isActive }) => (isActive ? "submenu-link active" : "submenu-link")}>
                        🔐 Role Permissions
                      </NavLink>
                    </li>
                  )}
                </ul>
              )}
            </li>
          )}

          {/* Students Link */}
          {canViewStudents && (
            <li>
              <NavLink
                to={`${getRolePrefix()}/students`} /* 👈 FIX: Changed from /admin/students to dynamic role prefix */
                className={({ isActive }) => (isActive ? "nav-link-item active" : "nav-link-item")}
              >
                👨‍🎓 Students
              </NavLink>
            </li>
          )}
          {/* Teachers Link */}
          {canViewTeachers && (
            <li>
              <NavLink
                to={`${getRolePrefix()}/teachers`}
                className={({ isActive }) => (isActive ? "nav-link-item active" : "nav-link-item")}
              >
                👨‍🏫 Teachers
              </NavLink>
            </li>
          )}
          {/* Class Dropdown Link */}
          {canViewClass && (
            <li>
              <button className="nav-link-item dropdown-btn" onClick={() => setClassOpen(!classOpen)}>
                📚 Class <span>{classOpen ? "▲" : "▼"}</span>
              </button>
              {classOpen && (
                <ul className="submenu">
                  {hasPermission("class.view") && (
                    <li>
                      <NavLink to={`${getRolePrefix()}/classes`} className={({ isActive }) => (isActive ? "submenu-link active" : "submenu-link")}>
                        📋 Class
                      </NavLink>
                    </li>
                  )}
                  {hasPermission("class_manager.view") && (
                    <li>
                      <NavLink to={`${getRolePrefix()}/class_managers`} className={({ isActive }) => (isActive ? "submenu-link active" : "submenu-link")}>
                        🗂 Class Manager
                      </NavLink>
                    </li>
                  )}
                </ul>
              )}
            </li>
          )}
          {/* Departments Link */}
          {canViewClassroom && (
            <li>
              <NavLink
                to={`${getRolePrefix()}/class_rooms`}
                className={({ isActive }) => (isActive ? "nav-link-item active" : "nav-link-item")}
              >
                🏫 Classroom
              </NavLink>
            </li>
          )}
          {/* Departments Link */}
          {canViewDepartments && (
            <li>
              <NavLink
                to={`${getRolePrefix()}/departments`}
                className={({ isActive }) => (isActive ? "nav-link-item active" : "nav-link-item")}
              >
                🏢 Departments
              </NavLink>
            </li>
          )}

          {/* Courses Dropdown Link */}
          {canViewCourses && (
            <li>
              <button className="nav-link-item dropdown-btn" onClick={() => setCourseOpen(!courseOpen)}>
                📚 Courses <span>{courseOpen ? "▲" : "▼"}</span>
              </button>
              {courseOpen && (
                <ul className="submenu">
                  {hasPermission("course.view") && (
                    <li>
                      <NavLink to={`${getRolePrefix()}/courses`} className={({ isActive }) => (isActive ? "submenu-link active" : "submenu-link")}>
                        📋 Courses Management
                      </NavLink>
                    </li>
                  )}
                  {hasPermission("course.create") && (
                    <li>
                      <NavLink to={`${getRolePrefix()}/course/create`} className={({ isActive }) => (isActive ? "submenu-link active" : "submenu-link")}>
                        ➕ Student Course
                      </NavLink>
                    </li>
                  )}
                  {hasPermission("category.view") && (
                    <li>
                      <NavLink to={`${getRolePrefix()}/course-category`} className={({ isActive }) => (isActive ? "submenu-link active" : "submenu-link")}>
                        🗂 Categories
                      </NavLink>
                    </li>
                  )}
                </ul>
              )}
            </li>
          )}
          {/* Assignments Link */}
          {canViewAssignment && (
            <li>
              <button className="nav-link-item dropdown-btn" onClick={() => setAssignmentOpen(!AssignmentOpen)}>
                📝 Assignments <span>{AssignmentOpen ? "▲" : "▼"}</span>
              </button>
              {AssignmentOpen && (
                <ul className="submenu">
                  {hasPermission("assignment.view") && (
                    <li>
                      <NavLink to={`${getRolePrefix()}/assignments`} className={({ isActive }) => (isActive ? "submenu-link active" : "submenu-link")}>
                        📋 Assignment Management
                      </NavLink>
                    </li>
                  )}
                  {hasPermission("assignment_submission.view") && (
                    <li>
                      <NavLink to={`${getRolePrefix()}/assignment_submissions`} className={({ isActive }) => (isActive ? "submenu-link active" : "submenu-link")}>
                        📥 Submissions
                      </NavLink>
                    </li>
                  )}
                </ul>
              )}
            </li>
          )}

          {/* Schedules Link */}
          {hasPermission("schedule.view") && (
            <li>
              <NavLink
                to={`${getRolePrefix()}/schedules`}
                className={({ isActive }) => (isActive ? "nav-link-item active" : "nav-link-item")}
              >
                📅 Schedules
              </NavLink>
            </li>
          )}

          {/* Schedules Link */}
          {hasPermission("student_classroom.view") && (
            <li>
              <NavLink
                to={`${getRolePrefix()}/student_classrooms`}
                className={({ isActive }) => (isActive ? "nav-link-item active" : "nav-link-item")}
              >
                📅 My Classroom
              </NavLink>
            </li>
          )}
        </ul>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className={sidebarOpen ? "app-container-body" : "app-container-body full"}>
        <nav className="admin-navbar">
          <button className="mobile-menu-btn" onClick={() => setSidebarOpen((prev) => !prev)}>
            ☰
          </button>

          <div className="navbar-actions">
            <button className="icon-btn" onClick={toggleDarkMode}>
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* Notification Dropdown */}
            <div className="dropdown-container">
              <button type="button" className="icon-btn" onClick={() => setNotificationOpen((prev) => !prev)}>
                🔔 <span className="notification-badge">3</span>
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

            {/* Profile Dropdown */}
            <div className="dropdown-container">
              <button
                type="button"
                className="user-profile-badge"
                onClick={() => setProfileOpen((prev) => !prev)}
              >
                <img
                  src={
                    user?.photo ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.full_name || user?.username || "User"
                    )}`
                  }
                  alt="Profile"
                  className="profile-avatar"
                />

                <div className="user-info">
                  <strong>{user?.full_name || user?.username}</strong>
                  <small>{user?.role || "User"}</small>
                </div>

                <span className="dropdown-arrow">▼</span>
              </button>

              {profileOpen && (
                <div className="user-menu">
                  <button type="button">
                    👤 My Profile
                  </button>

                  <button type="button">
                    ⚙ Account Settings
                  </button>

                  <button
                    type="button"
                    className="logout-btn"
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        <main className="admin-main-content">
          <Outlet />
        </main>

        <footer className="admin-footer">
          <p>© {new Date().getFullYear()} UniTrack University Database System</p>
        </footer>
      </div>
    </div>
  );
};

export default AppLayout;