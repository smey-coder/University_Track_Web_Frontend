import React from "react";

const ActivityPanel = () => {
  const activities = [
    {
      icon: "📤",
      title: "Assignment Submitted",
      description:
        "Student submitted Mobile Application Development assignment",
      time: "5 minutes ago",
    },

    {
      icon: "📅",
      title: "Attendance Recorded",
      description: "Attendance scan completed in Room 302",
      time: "20 minutes ago",
    },

    {
      icon: "👨‍🎓",
      title: "New Student Added",
      description: "A new student profile was created",
      time: "1 hour ago",
    },

    {
      icon: "📚",
      title: "Course Updated",
      description: "Advanced Database System information updated",
      time: "2 hours ago",
    },
  ];

  return (
    <div className="activity-card">
      <div className="panel-header">
        <h3>🕒 Recent Activity</h3>

        <button>View All</button>
      </div>

      <div className="activity-list">
        {activities.map((item, index) => (
          <div className="activity-item" key={index}>
            <div className="activity-icon">{item.icon}</div>

            <div className="activity-content">
              <h4>{item.title}</h4>

              <p>{item.description}</p>

              <small>{item.time}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityPanel;
