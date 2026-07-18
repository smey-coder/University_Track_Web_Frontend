const StatCard = ({ title, value, icon, loading }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-content">
        <div>
          <span>{title}</span>

          <h2>{loading ? "..." : value}</h2>
        </div>

        <div className="stat-icon">{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;
