import { useEffect, useState } from "react";
import axios from "axios";

const StudentListModal = ({ classId, onClose }) => {
  const [students, setStudents] = useState([]);

  const [classInfo, setClassInfo] = useState(null);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const API = "http://192.168.100.39:8000/api/web/classes";

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  // =========================
  // LOAD STUDENTS
  // =========================

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `${API}/${classId}/students`,

        config,
      );

      if (response.data.success) {
        setStudents(response.data.students);

        setClassInfo(response.data.class);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // =========================
  // SEARCH
  // =========================

  const filteredStudents = students.filter((student) => {
    const name = `${student.first_name_english}
        ${student.last_name_english}`.toLowerCase();

    return (
      name.includes(search.toLowerCase()) ||
      student.student_code?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="modal-overlay">
      <div className="class-modal large-modal">
        <div className="modal-header">
          <div>
            <h2>👨‍🎓 Students List</h2>

            <small>Class: {classInfo?.class_name}</small>
          </div>

          <button onClick={onClose}>✖</button>
        </div>

        <div className="student-toolbar">
          <input
            type="text"
            placeholder="🔍 Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <span>
            Total:
            <strong>{filteredStudents.length}</strong>
            Students
          </span>
        </div>

        {loading ? (
          <div className="loading">Loading students...</div>
        ) : (
          <table className="class-table">
            <thead>
              <tr>
                <th>#</th>

                <th>Student Code</th>

                <th>Name</th>

                <th>Gender</th>

                <th>Department</th>

                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr key={student.id}>
                    <td>{index + 1}</td>

                    <td>
                      <strong>{student.student_code}</strong>
                    </td>

                    <td>
                      {student.first_name_english} {student.last_name_english}
                    </td>

                    <td>{student.gender}</td>

                    <td>
                      {student.department?.department_name_english || "-"}
                    </td>

                    <td>
                      <span
                        className={
                          student.status === "Active"
                            ? "status-active"
                            : "status-inactive"
                        }
                      >
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentListModal;
