import React from "react";

const ClassCard = ({ title, value, icon, description, type = "" }) => {
  return (
    <div className={`class-card ${type}`}>
      <div className="class-card-icon">{icon}</div>

      <div className="class-card-content">
        <h3>{title}</h3>

        <h1>{value}</h1>

        {description && <p>{description}</p>}
      </div>
    </div>
  );
};

export default ClassCard;
