import React from "react";
import { useNavigate } from "react-router-dom";

const QuickActions = ({ isAdmin, isTeacher, setShowCreateModal }) => {
  const navigate = useNavigate();

  const actions = [];

  if (isAdmin) {
    actions.push(
      {
        title: "Add Student",
        icon: "👨‍🎓",
        action: () => setShowCreateModal(true),
      },

      {
        title: "Manage Users",
        icon: "👥",
        action: () => navigate("/users"),
      },

      {
        title: "Departments",
        icon: "🏢",
        action: () => navigate("/departments"),
      },
    );
  }

  if (isTeacher) {
    actions.push(
      {
        title: "Create Assignment",
        icon: "📝",
        action: () => navigate("/assignments"),
      },

      {
        title: "View Submission",
        icon: "📤",
        action: () => navigate("/assignment-submissions"),
      },

      {
        title: "Attendance",
        icon: "✅",
        action: () => navigate("/attendance"),
      },
    );
  }

  if (!isAdmin && !isTeacher) {
    actions.push(
      {
        title: "Submit Assignment",
        icon: "📚",
        action: () => navigate("/assignment-submissions"),
      },

      {
        title: "My Schedule",
        icon: "📅",
        action: () => navigate("/schedule"),
      },

      {
        title: "My Score",
        icon: "🎯",
        action: () => navigate("/grades"),
      },
    );
  }

  return (
    <div className="quick-card">
      <div className="panel-header">
        <h3>⚡ Quick Actions</h3>
      </div>

      <div className="quick-grid">
        {actions.map((item, index) => (
          <button key={index} className="quick-button" onClick={item.action}>
            <span className="quick-icon">{item.icon}</span>

            <span>{item.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
