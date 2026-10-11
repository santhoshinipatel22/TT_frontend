import React from 'react';

export const getStockStatus = (currentStock, reorderLevel) => {
  const stock = Number(currentStock) || 0;
  const reorder = Number(reorderLevel) || 0;

  // IMPORTANT: OUT OF STOCK must be checked first so 0 stock is not just marked LOW STOCK
  if (stock <= 0) {
    return {
      label: 'OUT OF STOCK',
      className: 'out-of-stock',
    };
  }
  if (stock <= reorder) {
    return {
      label: 'LOW STOCK',
      className: 'low-stock',
    };
  }
  return {
    label: 'IN STOCK',
    className: 'in-stock',
  };
};

export default function StatusBadge({ currentStock, reorderLevel, statusText }) {
  let status;
  if (statusText) {
    const normalized = statusText.toUpperCase();
    if (normalized.includes('OUT')) {
      status = { label: 'OUT OF STOCK', className: 'out-of-stock' };
    } else if (normalized.includes('LOW')) {
      status = { label: 'LOW STOCK', className: 'low-stock' };
    } else {
      status = { label: 'IN STOCK', className: 'in-stock' };
    }
  } else {
    status = getStockStatus(currentStock, reorderLevel);
  }

  return (
    <span className={`status-badge ${status.className}`}>
      <span style={{ fontSize: '10px' }}>●</span>
      {status.label}
    </span>
  );
}
