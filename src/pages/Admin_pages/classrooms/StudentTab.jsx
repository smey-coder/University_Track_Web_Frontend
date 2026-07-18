const StudentTab = ({ students }) => {
  return (
    <div className="tab-table">
      <h3>👨‍🎓 Students</h3>

      <table>
        <thead>
          <tr>
            <th>#</th>

            <th>Student Code</th>

            <th>Name</th>

            <th>Gender</th>

            <th>Phone</th>

            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {students.length > 0 ? (
            students.map((student, index) => (
              <tr key={student.id}>
                <td>{index + 1}</td>

                <td>
                  <strong>{student.student_code}</strong>
                </td>

                <td>
                  {student.first_name_english} {student.last_name_english}
                </td>

                <td>{student.gender}</td>

                <td>{student.phone || "-"}</td>

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
              <td colSpan="6">No students found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTab;
