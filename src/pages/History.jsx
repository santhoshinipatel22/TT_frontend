import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, RefreshCw, Calendar, Package, ArrowDownRight, Layers } from 'lucide-react';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';
import { fetchConsumptions, getErrorMessage } from '../services/api';

export default function History() {
  const [consumptions, setConsumptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchConsumptions();
      setConsumptions(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return <LoadingIndicator message="Loading consumption transaction history..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadHistory} />;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <HistoryIcon size={20} color="#ea580c" />
            Stock Consumption Audit Log ({consumptions.length})
          </h2>

          <button 
            className="btn btn-secondary btn-sm" 
            onClick={loadHistory}
            title="Refresh history"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        <div className="card-body">
          {consumptions.length === 0 ? (
            <div className="empty-state">
              <HistoryIcon className="empty-icon" />
              <h4 className="empty-title">No Consumption Records Yet</h4>
              <p className="empty-subtitle">
                Material consumptions recorded on the "Stock Consumption" page will be tracked here.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>Log ID</th>
                    <th>Material Name</th>
                    <th>Category</th>
                    <th style={{ textAlign: 'right' }}>Quantity Consumed</th>
                    <th>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {consumptions.map((item) => (
                    <tr key={item.id}>
                      <td style={{ color: '#64748b', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                        #{item.id}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Package size={16} color="#64748b" />
                          {item.material ? item.material.name : 'Unknown Material'}
                        </div>
                      </td>
                      <td>
                        <span style={{ 
                          background: '#f1f5f9', 
                          padding: '3px 8px', 
                          borderRadius: '4px', 
                          fontSize: '0.8rem',
                          color: '#475569' 
                        }}>
                          {item.material?.category || 'General'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span style={{ 
                          color: '#ea580c', 
                          fontWeight: 700, 
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.95rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px'
                        }}>
                          <ArrowDownRight size={14} />
                          {item.quantity}
                        </span>{' '}
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          {item.material?.unit || 'units'}
                        </span>
                      </td>
                      <td style={{ color: '#475569', fontSize: '0.86rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={14} color="#94a3b8" />
                          {formatDate(item.consumptionDate)}
                        </div>
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
  );
}
