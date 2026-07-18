const ScheduleTab = ({ schedule }) => {
  return (
    <div className="tab-table">
      <h3>🕒 Weekly Schedule</h3>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Day</th>
            <th>Time</th>
            <th>Course</th>
            <th>Teacher</th>
            <th>Room</th>
          </tr>
        </thead>

        <tbody>
          {schedule.length > 0 ? (
            schedule.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>

                <td>{item.day_of_week}</td>

                <td>
                  {item.start_time}-{item.end_time}
                </td>

                <td>{item.course?.course_name || "-"}</td>

                <td>
                  {item.teacher
                    ? item.teacher.first_name_english +
                      " " +
                      item.teacher.last_name_english
                    : "-"}
                </td>

                <td>
                  🏫
                  {item.room || "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No schedule found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTab;
