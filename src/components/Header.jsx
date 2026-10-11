import React from 'react';
import { Menu, Layers } from 'lucide-react';

export default function Header({ title, onToggleSidebar }) {
  return (
    <header className="top-header">
      <div className="header-title-container">
        <button 
          className="mobile-toggle" 
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="page-title">{title}</h1>
      </div>

      <div className="header-actions">
        <span className="badge-tag">
          <Layers size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
          SmartBuild v1.0
        </span>
      </div>
    </header>
  );
}
