import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import CreateModal from "./students/CreateModal";
import StatCard from "./components/StatCard";
import ActivityPanel from "./components/ActivityPanel";
import QuickActions from "./components/QuickActions";
import DashboardChat from "./components/DashboardChat";

import { useAuth } from "../../hooks/useAuth";
import "./adminDashboard.css";



const AdminDashboard = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [metrics, setMetrics] = useState({
    total_students: 0,
    total_departments: 0,
    total_classes: 0,
    total_system_users: 0,

    total_teachers: 0,
    total_courses: 0,
    total_assignments: 0,
    total_assignment_submissions: 0,
  });

  const [departmentsList, setDepartmentsList] = useState([]);

  const [classesList, setClassesList] = useState([]);

  // ===============================
  // PERMISSION
  // ===============================
  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) ?? false;
  };
  const canView = hasPermission("data.show");
  // const canCreate = hasPermission("student.create");
  // const canUpdate = hasPermission("student.update");
  // const canDelete = hasPermission("student.delete");
  const isAdmin = user?.roles?.includes("Admin");
  const isTeacher = user?.roles?.includes("Teacher");
  const isStudent = user?.roles?.includes("Student");
  const getGreeting = () => {
  const hour = new Date().getHours();
  if(hour < 12){
    return "Good Morning";
  }
  if(hour < 18){

    return "Good Afternoon";
  }
  return "Good Evening";

};

  // ================================
  // LOAD DASHBOARD DATA
  // ================================

  const fetchDashboard = async () => {
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
        const data = response.data.data;

        setMetrics({
          total_students: data.metrics.total_students || 0,

          total_departments: data.metrics.total_departments || 0,

          total_classes: data.metrics.total_classes || 0,

          total_system_users: data.metrics.total_system_users || 0,

          total_teachers: data.metrics.total_teachers || 0,

          total_courses: data.metrics.total_courses || 0,

          total_assignments: data.metrics.total_assignments || 0,

          total_assignment_submissions: data.metrics.total_assignment_submissions || 0,
        });

        setDepartmentsList(data.departments || []);

        setClassesList(data.classes || []);
      }
    } catch (error) {
      console.log(error);

      toast.error("Cannot load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboard();
    }
  }, [user]);

  const welcomeText = () => {
    if (isAdmin) return "Welcome back, Administrator 👑";

    if (isTeacher) return "Welcome back, Professor 👨‍🏫";

    if (isStudent) return "Welcome back, Student 🎓";

    return "Welcome back";
  };

  const cards = [
    {
      title: "Students",
      value: metrics.total_students,
      icon: "👨‍🎓",
    },

    {
      title: "Teachers",
      value: metrics.total_teachers,
      icon: "👨‍🏫",
    },

    {
      title: "Departments",
      value: metrics.total_departments,
      icon: "🏢",
    },

    {
      title: "Courses",
      value: metrics.total_courses,
      icon: "📚",
    },

    {
      title: "Classes",
      value: metrics.total_classes,
      icon: "🏫",
    },

    {
      title: "Assignments",
      value: metrics.total_assignments,
      icon: "📝",
    },

    {
      title: "Submissions",
      value: metrics.total_assignment_submissions,
      icon: "📤",
    },

    {
      title: "System Users",
      value: metrics.total_system_users,
      icon: "👥",
    },
  ];

  return (
    <div className="dashboard-container">
      <Toaster position="top-right" />

      {/* HEADER */}

      <section className="dashboard-header">
        <div className="welcome-area">
          <h1>
            {welcomeText()}
          </h1>
          <h2>
            {getGreeting()}, <span>{user?.username || "User"}</span>
          </h2>
          <p>
            Manage your University Track system
          </p>
          <div className="student-information">
            <div className="info-row">
              <span>
                ID:
                <strong>
                  {" "}
                  {user?.student?.student_code || "N/A"}
                </strong>
              </span>
              <span>
                •
              </span>
              <span>
                {
                  user?.student?.department?.department_name_english
                  ||
                  "Software Development"
                }
              </span>
              <span>
                •
              </span>
              <span>
                {
                  user?.student?.classes?.class_name
                  ||
                  "Com3ES2"
                }
              </span>
            </div>

            <div className="academic-info">
              <span>
                Academic Year:
                <strong>
                  {" "}
                  {
                    user?.student?.academic_year
                    ||
                    "2025-2026"
                  }
                </strong>
              </span>



              <span>
                Semester:
                <strong>
                  {" "}
                  {
                    user?.student?.semester?.semester_name
                    ||
                    "2"
                  }
                </strong>
              </span>


            </div>


          </div>
        </div>



        <div className="profile-mini">
          <span>
            📅 {new Date().toLocaleDateString(
              "en-US",
              {
                weekday:"long",
                year:"numeric",
                month:"long",
                day:"numeric"
              }
            )}
          </span>
        </div>
      </section>
      {/* STATISTICS */}
      {canView && (
        <section className="stats-grid">
          {cards.map((item, index) => (
            <StatCard key={index} {...item} loading={loading} />
          ))}
        </section>
      )}
      {/* CONTENT */}
      <section className="dashboard-columns">
        <ActivityPanel />

        <QuickActions
          isAdmin={isAdmin}
          setShowCreateModal={setShowCreateModal}
        />
      </section>

      {/* AI CHAT */}

      <DashboardChat />

      {showCreateModal && isAdmin && (
        <CreateModal
          departments={departmentsList}
          classes={classesList}
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchDashboard}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
