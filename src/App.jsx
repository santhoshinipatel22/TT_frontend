import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Materials from './pages/Materials';
import Consumption from './pages/Consumption';
import History from './pages/History';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/dashboard':
        return 'Construction Dashboard';
      case '/materials':
        return 'Material Inventory Management';
      case '/consumption':
        return 'Record Material Consumption';
      case '/history':
        return 'Consumption Audit Log';
      default:
        return 'SmartBuild Mini';
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <div className="main-wrapper">
        <Header 
          title={getPageTitle(location.pathname)} 
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} 
        />

        <main className="page-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/consumption" element={<Consumption />} />
            <Route path="/history" element={<History />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
