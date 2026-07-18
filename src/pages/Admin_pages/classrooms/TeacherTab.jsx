import './TeacherTab.css';
const TeacherTab = ({ teachers }) => {
  return (
    <div className="teacher-tab">
      <h3>👨‍🏫 Teachers ({teachers.length})</h3>

      {teachers.length > 0 ? (
        <div className="teacher-grid">
          {teachers.map((teacher) => (
            <div className="teacher-card" key={teacher.id}>
              <img src={teacher.photo_url} alt={teacher.full_name_english} />

              <div>
                <h4>{teacher.full_name_english}</h4>

                <p>🆔 Code: {teacher.teacher_code}</p>

                <p>📧 {teacher.email}</p>

                <p>📱 {teacher.phone}</p>

                <p>👤 Gender: {teacher.gender}</p>

                <span
                  className={
                    teacher.status === "Active"
                      ? "status-active"
                      : "status-inactive"
                  }
                >
                  {teacher.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No teacher found</p>
      )}
    </div>
  );
};

export default TeacherTab;
