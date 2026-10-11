import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Boxes, 
  ArrowDownCircle, 
  History, 
  Hammer,
  Database
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/materials', label: 'Materials', icon: Boxes },
    { to: '/consumption', label: 'Stock Consumption', icon: ArrowDownCircle },
    { to: '/history', label: 'Consumption History', icon: History },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="brand-icon">
          <Hammer size={22} />
        </div>
        <div>
          <div className="brand-title">SmartBuild Mini</div>
          <div className="brand-subtitle">Material Management</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span>MySQL Connected</span>
        </div>
        <Database size={15} color="#64748b" />
      </div>
    </aside>
  );
}
