import React from 'react';

export default function LoadingIndicator({ message = 'Loading data from server...' }) {
  return (
    <div className="loading-box">
      <div className="spinner"></div>
      <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{message}</p>
    </div>
  );
}
