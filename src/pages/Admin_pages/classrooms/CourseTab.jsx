const CourseTab = ({ courses }) => {
  return (
    <div className="tab-table">
      <h3>📖 Courses</h3>

      <table>
        <thead>
          <tr>
            <th>#</th>

            <th>Course Code</th>

            <th>Course Name</th>

            <th>Credit</th>

            <th>Teacher</th>
          </tr>
        </thead>

        <tbody>
          {courses.length > 0 ? (
            courses.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>

                <td>
                  <strong>{item.course_code}</strong>
                </td>

                <td>{item.course_name}</td>

                <td>{item.credits || "-"}</td>

                <td>
                {
                item.teacher
                ?
                item.teacher.full_name_english
                :
                "-"
                }
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No courses found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CourseTab;
