import React, { useState, useEffect } from 'react';
import { 
  Boxes, 
  Layers, 
  AlertTriangle, 
  XCircle, 
  Plus, 
  ArrowRight,
  TrendingDown,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SummaryCard from '../components/SummaryCard';
import StatusBadge from '../components/StatusBadge';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';
import { fetchDashboardSummary } from '../services/api';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDashboardSummary();
      setSummary(data);
    } catch (err) {
      setError(err.message || 'Failed to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return <LoadingIndicator message="Loading dashboard metrics..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadDashboard} />;
  }

  const {
    totalMaterials = 0,
    totalStockQuantity = 0,
    lowStockCount = 0,
    outOfStockCount = 0,
    stockByUnit = {},
    recentlyAddedMaterials = [],
    lowStockAlerts = []
  } = summary || {};

  return (
    <div>
      {/* KPI Metric Cards */}
      <div className="summary-grid">
        <SummaryCard
          title="Total Materials"
          value={totalMaterials}
          description="Cataloged building items"
          icon={Boxes}
          colorClass="icon-blue"
        />

        <SummaryCard
          title="Stock In Reserve"
          value={Object.keys(stockByUnit).length > 0 ? Object.keys(stockByUnit).length : 0}
          description="Distinct inventory unit types"
          icon={Layers}
          colorClass="icon-orange"
        />

        <SummaryCard
          title="Low Stock Items"
          value={lowStockCount}
          description="Below reorder threshold"
          icon={AlertTriangle}
          colorClass="icon-amber"
        />

        <SummaryCard
          title="Out of Stock"
          value={outOfStockCount}
          description="Zero inventory available"
          icon={XCircle}
          colorClass="icon-red"
        />
      </div>

      {/* Stock Breakdown by Measurement Unit */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Layers size={20} color="#ea580c" />
            Available Stock Breakdown by Unit
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Units of measure are tracked independently
          </span>
        </div>
        <div className="card-body">
          {Object.keys(stockByUnit).length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No inventory recorded yet.</p>
          ) : (
            <div className="unit-tags">
              {Object.entries(stockByUnit).map(([unit, count]) => (
                <div key={unit} className="unit-tag">
                  <span className="unit-tag-name">{unit}:</span>
                  <span className="unit-tag-value">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Two Column Layout: Low Stock Alerts & Recently Added */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
        
        {/* Low Stock Alerts */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title" style={{ color: '#ea580c' }}>
              <TrendingDown size={20} />
              Low Stock & Depletion Alerts
            </h2>
            <Link to="/materials" className="btn btn-secondary btn-sm" style={{ gap: '4px' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="card-body" style={{ padding: '0' }}>
            {lowStockAlerts.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#059669' }}>
                <ShieldCheck size={36} style={{ margin: '0 auto 8px' }} />
                <p style={{ fontWeight: 600 }}>All materials are sufficiently stocked!</p>
                <p style={{ fontSize: '0.82rem', color: '#64748b' }}>No materials below reorder thresholds.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Material</th>
                      <th style={{ textAlign: 'right' }}>Stock / Reorder</th>
                      <th style={{ textAlign: 'center' }}>Status</th>
                      <th style={{ textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockAlerts.slice(0, 5).map((mat) => (
                      <tr key={mat.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{mat.name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{mat.category}</div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span className="stock-value" style={{ color: mat.currentStock <= 0 ? '#dc2626' : '#d97706' }}>
                            {mat.currentStock}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}> / {mat.reorderLevel} {mat.unit}</span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <StatusBadge 
                            currentStock={mat.currentStock} 
                            reorderLevel={mat.reorderLevel} 
                          />
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <Link 
                            to="/consumption" 
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                          >
                            Consume
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Recently Added Materials */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <Clock size={20} color="#2563eb" />
              Recently Added Materials
            </h2>
            <Link to="/materials" className="btn btn-primary btn-sm" style={{ gap: '4px' }}>
              <Plus size={14} /> Add Material
            </Link>
          </div>
          <div className="card-body" style={{ padding: '0' }}>
            {recentlyAddedMaterials.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                <p>No materials cataloged yet.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Material</th>
                      <th>Category</th>
                      <th style={{ textAlign: 'right' }}>Current Stock</th>
                      <th style={{ textAlign: 'center' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentlyAddedMaterials.map((mat) => (
                      <tr key={mat.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{mat.name}</div>
                        </td>
                        <td>
                          <span style={{ 
                            background: '#f1f5f9', 
                            padding: '2px 8px', 
                            borderRadius: '4px', 
                            fontSize: '0.8rem',
                            color: '#475569' 
                          }}>
                            {mat.category}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span className="stock-value">{mat.currentStock}</span>{' '}
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{mat.unit}</span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <StatusBadge 
                            currentStock={mat.currentStock} 
                            reorderLevel={mat.reorderLevel} 
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
