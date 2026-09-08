import { memo } from "react";

function ToolCard({
  icon,
  title,
  description,
  color,
  onClick,
}) {
  return (
    <button className={`tool-card ${color}`} onClick={onClick}>
      <div className="tool-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <span className="tool-link">Explore tools →</span>
    </button>
  );
}

export default memo(ToolCard);
