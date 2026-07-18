const ClassroomCard = ({ title, value, icon }) => {
  return (
    <div className="classroom-card">
      <div className="card-icon">{icon}</div>

      <div className="card-content">
        <h3>{value}</h3>

        <p>{title}</p>
      </div>
    </div>
  );
};

export default ClassroomCard;
