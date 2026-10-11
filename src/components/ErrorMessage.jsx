import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="alert alert-error">
      <AlertCircle size={20} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, fontSize: '0.88rem' }}>
        <strong>Error: </strong> {message}
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary btn-sm" style={{ gap: '4px' }}>
          <RefreshCw size={14} /> Retry
        </button>
      )}
    </div>
  );
}
