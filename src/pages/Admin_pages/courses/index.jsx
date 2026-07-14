import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";

import CreateModal from "./CreateModal";
import UpdateModal from "./UpdateModal";
import ShowModal from "./ShowModal";

import { useAuth } from "../../../hooks/useAuth";

import "./course.css";

const Index = () => {
  const API_URL = "http://192.168.100.39:8000/api/web/courses";

  const { user } = useAuth();

  // ===============================
  // STATE
  // ===============================

  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [activeCourse, setActiveCourse] = useState(null);

  const [modalType, setModalType] = useState(null);

  // ===============================
  // PERMISSION
  // ===============================

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) ?? false;
  };

  const canView = hasPermission("course.view");

  const canCreate = hasPermission("course.create");

  const canUpdate = hasPermission("course.update");

  const canDelete = hasPermission("course.delete");

  // ===============================
  // HEADER
  // ===============================

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const toastStyles = {
    success: {
      background: "#16a34a",
      color: "#fff",
    },

    error: {
      background: "#dc2626",
      color: "#fff",
    },
  };

  // ===============================
  // GET COURSES
  // ===============================

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API_URL, getHeaders());

      if (response.data.success) {
        setCourses(response.data.data || []);
      }
    } catch (error) {
      console.log(error);

      toast.error("Failed loading courses", {
        style: toastStyles.error,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ===============================
  // DELETE
  // ===============================

  const handleDelete = (id, name) => {
    Swal.fire({
      title: "Delete Course?",

      text: `Remove ${name}?`,

      icon: "warning",

      showCancelButton: true,

      confirmButtonText: "Yes Delete",

      confirmButtonColor: "#dc2626",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `${API_URL}/delete/${id}`,

            getHeaders(),
          );

          if (response.data.success) {
            toast.success("Course deleted", {
              style: toastStyles.success,
            });

            fetchCourses();
          }
        } catch (error) {
          toast.error("Delete failed", {
            style: toastStyles.error,
          });
        }
      }
    });
  };

  // ===============================
  // SEARCH
  // ===============================

  const filteredCourses = courses.filter((course) => {
    const keyword = search.toLowerCase();

    return (
      course.course_name?.toLowerCase().includes(keyword) ||
      course.course_code?.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="course-page">
      <Toaster position="top-right" />

      {/* HEADER */}

      <div className="course-header">
        <div>
          <h2>📚 Course Management</h2>

          <p>Manage university courses and teachers</p>
        </div>

        {canCreate && (
          <button className="add-btn" onClick={() => setModalType("create")}>
            ➕ Add Course
          </button>
        )}
      </div>

      {/* SEARCH */}

      <div className="search-card">
        <input
          placeholder="🔍 Search course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      {canView && (
        <div className="table-card">
          {loading ? (
            <h3 className="loading">Loading...</h3>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Code</th>

                  <th>Name</th>

                  <th>Department</th>

                  <th>Teacher</th>

                  <th>Credit</th>

                  <th>Status</th>

                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <tr key={course.id}>
                      <td>
                        <strong>{course.course_code}</strong>
                      </td>

                      <td
                        className="click-name"
                        onClick={() => {
                          setActiveCourse(course);

                          setModalType("show");
                        }}
                      >
                        {course.course_name}
                      </td>

                      <td>
                        {course.department
                          ? course.department.department_name_english
                          : "N/A"}
                      </td>

                      <td>
                        {course.teacher
                          ? `${course.teacher.first_name_english}
                          ${" "}
                          ${course.teacher.last_name_english}`
                          : "N/A"}
                      </td>
                      <td>{course.credits}</td>

                      <td>
                        <span
                          className={
                            course.status === "Active"
                              ? "status active"
                              : "status inactive"
                          }
                        >
                          {course.status}
                        </span>
                      </td>

                      <td>
                        {canUpdate && (
                          <button
                            className="edit-btn"
                            onClick={() => {
                              setActiveCourse(course);

                              setModalType("update");
                            }}
                          >
                            ✏️
                          </button>
                        )}

                        {canDelete && (
                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(
                                course.id,

                                course.course_name,
                              )
                            }
                          >
                            🗑
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No courses found</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* CREATE */}

      {modalType === "create" && (
        <CreateModal
          onClose={() => setModalType(null)}
          onSuccess={() => {
            setModalType(null);

            fetchCourses();
          }}
          toastStyles={toastStyles}
        />
      )}

      {/* UPDATE */}

      {modalType === "update" && (
        <UpdateModal
          course={activeCourse}
          onClose={() => setModalType(null)}
          onSuccess={() => {
            setModalType(null);

            fetchCourses();
          }}
          toastStyles={toastStyles}
        />
      )}

      {/* SHOW */}

      {modalType === "show" && (
        <ShowModal course={activeCourse} onClose={() => setModalType(null)} />
      )}
    </div>
  );
};

export default Index;
