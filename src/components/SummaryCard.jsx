import React from 'react';

export default function SummaryCard({ title, value, description, icon: Icon, colorClass = 'icon-blue' }) {
  return (
    <div className="summary-card">
      <div className="summary-info">
        <h3>{title}</h3>
        <div className="summary-value">{value}</div>
        {description && <div className="summary-desc">{description}</div>}
      </div>
      {Icon && (
        <div className={`summary-icon-box ${colorClass}`}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
}
