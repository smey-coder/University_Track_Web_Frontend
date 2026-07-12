import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import CreateModal from "./students/CreateModal"; 
import "./adminDashboard.css";

const AdminDashboard = () => {
  const { user } = useAuth();

  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  const canViewDashboard = hasPermission("dashboard.view");
  const canShowData = hasPermission("data.show");

  /* =====================================
      STATE CONFIGURATION
  ===================================== */
  const [metrics, setMetrics] = useState({
    total_students: 0,
    total_classes: 0,
    total_departments: 0,
    total_system_users: 0,
  });

  const [departmentsList, setDepartmentsList] = useState([]);
  const [classesList, setClassesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Normalize user roles to clean lowercase array strings for simple evaluation
  const roleNames = [user?.role, user?.roles]
    .flat()
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());

  const isAdmin = roleNames.includes("admin");
  const isTeacher = roleNames.includes("teacher");
  const isStudent = roleNames.includes("student");

  /* =====================================
      REAL-TIME DATA STREAM SYNC
  ===================================== */
  const fetchDashboardMetrics = async () => {
    // FIX: Allow any authenticated system user (admin, teacher, or student) to view stats data
    const canAccessMetrics = isAdmin || isTeacher || isStudent;

    if (!canAccessMetrics) {
      setMetrics({ total_students: 0, total_departments: 0, total_classes: 0, total_system_users: 0 });
      setDepartmentsList([]);
      setClassesList([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        "http://192.168.100.39:8000/api/web/dashboards",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        const { metrics: apiMetrics, departments, classes } = response.data.data;

        setMetrics({
          total_students: apiMetrics?.total_students || 0,
          total_departments: apiMetrics?.total_departments || 0,
          total_classes: apiMetrics?.total_classes || 0,
          total_system_users: apiMetrics?.total_system_users || 0,
        });

        setDepartmentsList(departments || []);
        setClassesList(classes || []);
      }
    } catch (error) {
      console.error("Dashboard metric sync engine crash:", error);
      setMetrics({ total_students: 0, total_departments: 0, total_classes: 0, total_system_users: 0 });
      setDepartmentsList([]);
      setClassesList([]);
      if (error?.response?.status !== 403) {
        toast.error("Failed to fetch live database statistics.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardMetrics();
    }
  }, [user]);

  /* =====================================
      DYNAMIC WELCOME BANNER UTILS
  ===================================== */
  const getWelcomeMessage = () => {
    if (isAdmin) return "Welcome back, Administrative Admin! 👑";
    if (isTeacher) return "Welcome back, Professor! 👨‍🏫";
    return "Welcome back to your Portal! 🎓";
  };

  /* =====================================
      UI CARD LAYOUT OBJECT MAP
  ===================================== */
  const statsLayout = [
    {
      title: "Total Students",
      count: loading ? "..." : metrics.total_students,
      icon: "👨‍Grad",
      color: "#4f46e5",
    },
    {
      title: "Departments",
      count: loading ? "..." : metrics.total_departments,
      icon: "🏢",
      color: "#06b6d4",
    },
    {
      title: "Active Classes",
      count: loading ? "..." : metrics.total_classes,
      icon: "📅",
      color: "#10b981",
    },
    {
      title: "System Operators",
      count: loading ? "..." : metrics.total_system_users,
      icon: "🏫",
      color: "#f59e0b",
    },
  ];

  return (
    <div className="dashboard-view-container">
      <Toaster position="top-right" />

      {/* Dynamic Welcome Banner Row */}
      <div className="dashboard-welcome-banner">
        <h1>{getWelcomeMessage()}</h1>
        <p>
          Logged in as: <strong>{user?.username || user?.name || "User"}</strong> (
          {user?.email || "No email handle bound"})
        </p>
      </div>

      {/* Grid Row Metrics Section Cards */}
      {canShowData && (
        <div className="stats-grid-row">
            {statsLayout.map((item, index) => (
              <div key={index} className="metric-card-box">
                <div className="metric-card-body">
                  <div className="metric-info">
                    <span className="metric-title">{item.title}</span>
                    <span className="metric-counter">{item.count}</span>
                  </div>
                  <div
                    className="metric-icon-avatar"
                    style={{
                      backgroundColor: `${item.color}15`,
                      color: item.color,
                    }}
                  >
                    {item.icon}
                  </div>
                </div>
                <div
                  className="metric-card-footer"
                  style={{ borderLeft: `4px solid ${item.color}` }}
                >
                  <span>Live System Metrics Status Active</span>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Split Details Section */}
      <div className="dashboard-details-split">
        {/* Activity Stream */}
        <div className="activity-panel-card">
          <h3>Recent System Activity</h3>
          <ul className="activity-list-tree">
            <li>
              <span className="activity-time">Just Now</span>
              <p>New attendance scan recorded in <strong>Room 302</strong></p>
            </li>
            <li>
              <span className="activity-time">10 mins ago</span>
              <p>Assignment submission updated for <strong>Advanced Mobile App Development</strong></p>
            </li>
            <li>
              <span className="activity-time">1 hour ago</span>
              <p>Department configuration modified for <strong>Computer Science Group</strong></p>
            </li>
          </ul>
        </div>

        {/* Shortcut Action Controls Panel (Context-aware layout values) */}
        <div className="activity-panel-card shortcut-panel">
          <h3>Quick Actions</h3>
          <p>
            {isAdmin 
              ? "Administrative shortcut controls mapped directly to your routing profiles."
              : "Portal shortcut controls mapped to your current role workspace."
            }
          </p>
          <div className="action-button-group">
            {/* FIX: Hide administrative functional adjustments from students/teachers */}
            {isAdmin && (
              <button
                className="dashboard-action-btn"
                onClick={() => setShowCreateModal(true)}
              >
                Add New Student Profile
              </button>
            )}
            <button className="dashboard-action-btn variant-secondary">
              {isAdmin || isTeacher ? "Modify Subject Schedule" : "View My Schedule Calendar"}
            </button>
          </div>
        </div>
      </div>

      {/* Conditional Create Student Modal Wrapper */}
      {showCreateModal && isAdmin && (
        <CreateModal
          departments={departmentsList}
          classes={classesList}
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchDashboardMetrics} 
        />
      )}
    </div>
  );
};

export default AdminDashboard;