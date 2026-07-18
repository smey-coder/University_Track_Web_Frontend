const CourseCard = ({ course }) => {
  return (
    <div className="course-card">
      <div className="course-image">📚</div>

      <div className="course-content">
        <h3>{course.course_name}</h3>

        <p>Code: {course.course_code}</p>

        <p>Credit: {course.credits}</p>
      </div>
    </div>
  );
};

export default CourseCard;
