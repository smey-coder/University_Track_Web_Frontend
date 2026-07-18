const ScheduleCard = ({ schedule }) => {
  const LARAVEL_URL = "http://192.168.100.39:8000";

  const teacher = schedule.teacher || {};

  const getImage = () => {
    if (teacher.photo_url) {
      return teacher.photo_url;
    }

    if (teacher.photo) {
      return `${LARAVEL_URL}/storage/${teacher.photo}`;
    }

    return "/images/default-user.png";
  };

  return (
    <div className="schedule-card">
      <div className="teacher-cover">
        <img
          src={getImage()}
          style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              borderRadius: "50%",
              border: "3px solid #e2e8f0",
            }}
          alt={teacher.full_name_english || "Teacher"}
          onError={(e) => {
            e.target.src = "/images/default-user.png";
          }}
        />

        <div className="status-badge">
          {schedule.status}
        </div>
      </div>

      <div className="schedule-content">
        <h2>{schedule.course?.course_name}</h2>

        {/* <p className="course-code">
          Course {schedule.course?.course_code}
        </p> */}

        <div className="teacher-info">
          <h3>Teacher Name: {teacher.full_name_english}</h3>

          <span>👨‍🏫 Lecturer</span>
        </div>

        <div className="schedule-list">
          <div className="schedule-item">
            <span>📅 Day</span>
            <strong>{schedule.day_of_week}</strong>
          </div>

          <div className="schedule-item">
            <span>⏰ Time</span>
            <strong>
              {schedule.start_time} - {schedule.end_time}
            </strong>
          </div>

          <div className="schedule-item">
            <span>🏫 Room</span>
            <strong>{schedule.room}</strong>
          </div>

          <div className="schedule-item">
            <span>🎓 Credit</span>
            <strong>{schedule.course?.credits}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;