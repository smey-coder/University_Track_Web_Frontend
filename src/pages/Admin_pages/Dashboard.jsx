import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import CreateModal from "./students/CreateModal"; // Adjust path based on your file tree
import "./adminDashboard.css";

const AdminDashboard = () => {
  const { user } = useAuth();

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

  /* =====================================
      REAL-TIME DATA STREAM SYNC
  ===================================== */
  const fetchDashboardMetrics = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://192.168.100.39:8000/api/web/dashboards", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        const { metrics: apiMetrics, departments, classes } = response.data.data;
        
        setMetrics({
          total_students: apiMetrics.total_students,
          total_departments: apiMetrics.total_departments,
          total_classes: apiMetrics.total_classes,
          total_system_users: apiMetrics.total_system_users,
        });
        
        setDepartmentsList(departments);
        setClassesList(classes);
      }
    } catch (error) {
      console.error("Dashboard metric sync engine crash:", error);
      toast.error("Failed to fetch live database statistics.");
    } finally {
      setLoading(false);
    }
  };

  // Run synchronization hook immediately upon mount
  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  /* =====================================
      UI CARD LAYOUT OBJECT MAP
  ===================================== */
  const statsLayout = [
    { 
      title: "Total Students", 
      count: loading ? "..." : metrics.total_students, 
      icon: "👨‍🎓", 
      color: "#4f46e5" 
    },
    { 
      title: "Departments", 
      count: loading ? "..." : metrics.total_departments, 
      icon: "🏢", 
      color: "#06b6d4" 
    },
    { 
      title: "Active Classes", 
      count: loading ? "..." : metrics.total_classes, 
      icon: "📅", 
      color: "#10b981" 
    },
    { 
      title: "System Operators", 
      count: loading ? "..." : metrics.total_system_users, 
      icon: "🏫", 
      color: "#f59e0b" 
    }
  ];

  return (
    <div className="dashboard-view-container">
      <Toaster position="top-right" />

      {/* Welcome Banner Row */}
      <div className="dashboard-welcome-banner">
        <h1>Welcome back, Administrative Admin! 👑</h1>
        <p>Logged in as: <strong>{user?.name || "System Operator"}</strong> ({user?.email || "No email handle binded"})</p>
      </div>

      {/* Grid Row Metrics Section Cards */}
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
                style={{ backgroundColor: `${item.color}15`, color: item.color }}
              >
                {item.icon}
              </div>
            </div>
            <div className="metric-card-footer" style={{ borderLeft: `4px solid ${item.color}` }}>
              <span>Live System Metrics Status Active</span>
            </div>
          </div>
        ))}
      </div>

      {/* Overview Platform Operational Status Blocks */}
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

        {/* Shortcut Action Controls Panel */}
        <div className="activity-panel-card shortcut-panel">
          <h3>Quick Administration Tools</h3>
          <p>Quick access controls mapped directly to your active route management paths.</p>
          <div className="action-button-group">
            <button 
              className="dashboard-action-btn"
              onClick={() => setShowCreateModal(true)}
            >
              Add New Student Profile
            </button>
            <button className="dashboard-action-btn variant-secondary">
              Modify Subject Schedule Calendar
            </button>
          </div>
        </div>

      </div>

      {/* Conditional Create Student Modal Wrapper */}
      {showCreateModal && (
        <CreateModal
          departments={departmentsList}
          classes={classesList}
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchDashboardMetrics} // Refresh totals card values automatically after entry 
        />
      )}
    </div>
  );
};

export default AdminDashboard;