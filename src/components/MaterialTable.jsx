import React, { useState, useMemo } from 'react';
import StatusBadge from './StatusBadge';
import { Edit2, Trash2, ArrowUpDown, ArrowUp, ArrowDown, PackageX } from 'lucide-react';

export default function MaterialTable({
  materials = [],
  onEdit,
  onDelete,
  onSelectForConsumption
}) {
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedMaterials = useMemo(() => {
    return [...materials].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'name') {
        valA = (valA || '').toLowerCase();
        valB = (valB || '').toLowerCase();
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else if (sortField === 'currentStock' || sortField === 'reorderLevel') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      return 0;
    });
  }, [materials, sortField, sortOrder]);

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} style={{ opacity: 0.4, marginLeft: '4px' }} />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp size={14} style={{ color: '#ea580c', marginLeft: '4px' }} />
    ) : (
      <ArrowDown size={14} style={{ color: '#ea580c', marginLeft: '4px' }} />
    );
  };

  if (!materials || materials.length === 0) {
    return (
      <div className="empty-state">
        <PackageX className="empty-icon" />
        <h4 className="empty-title">No Materials Found</h4>
        <p className="empty-subtitle">Try adjusting your search criteria or add a new material above.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '60px' }}>ID</th>
            <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                Material Name {renderSortIcon('name')}
              </div>
            </th>
            <th>Category</th>
            <th>Unit</th>
            <th onClick={() => handleSort('currentStock')} style={{ cursor: 'pointer', textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                Current Stock {renderSortIcon('currentStock')}
              </div>
            </th>
            <th onClick={() => handleSort('reorderLevel')} style={{ cursor: 'pointer', textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                Reorder Level {renderSortIcon('reorderLevel')}
              </div>
            </th>
            <th style={{ textAlign: 'center' }}>Status</th>
            <th style={{ textAlign: 'center', width: '120px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedMaterials.map((material) => (
            <tr key={material.id}>
              <td style={{ color: '#64748b', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                #{material.id}
              </td>
              <td>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>{material.name}</div>
              </td>
              <td>
                <span style={{ 
                  background: '#f1f5f9', 
                  padding: '3px 8px', 
                  borderRadius: '4px', 
                  fontSize: '0.8rem',
                  color: '#475569' 
                }}>
                  {material.category}
                </span>
              </td>
              <td style={{ color: '#475569' }}>{material.unit}</td>
              <td style={{ textAlign: 'right' }}>
                <span className="stock-value">{material.currentStock}</span>{' '}
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{material.unit}</span>
              </td>
              <td style={{ textAlign: 'right' }}>
                <span className="stock-value" style={{ color: '#64748b' }}>{material.reorderLevel}</span>{' '}
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{material.unit}</span>
              </td>
              <td style={{ textAlign: 'center' }}>
                <StatusBadge 
                  currentStock={material.currentStock} 
                  reorderLevel={material.reorderLevel} 
                />
              </td>
              <td>
                <div className="action-buttons" style={{ justifyContent: 'center' }}>
                  <button
                    className="icon-btn edit"
                    title="Edit Material"
                    onClick={() => onEdit(material)}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="icon-btn delete"
                    title="Delete Material"
                    onClick={() => onDelete(material)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
