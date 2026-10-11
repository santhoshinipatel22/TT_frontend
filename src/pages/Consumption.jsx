import React, { useState, useEffect } from 'react';
import { ArrowDownCircle, History, PackageCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import ConsumptionForm from '../components/ConsumptionForm';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';
import { fetchMaterials, recordConsumption, getErrorMessage } from '../services/api';

export default function Consumption() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const loadMaterials = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMaterials();
      setMaterials(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const handleConsumptionSubmit = async (data, resetFormCallback) => {
    try {
      setIsProcessing(true);
      setErrorMessage('');
      setSuccessMessage('');

      const response = await recordConsumption(data);

      setSuccessMessage(
        `Successfully logged consumption of ${response.quantity} ${response.material?.unit || 'units'} for '${response.material?.name || 'Material'}'. Stock updated in database!`
      );

      if (resetFormCallback) resetFormCallback();
      // Refresh material stock list from backend
      loadMaterials();

      setTimeout(() => setSuccessMessage(''), 6000);
    } catch (err) {
      setErrorMessage(getErrorMessage(err));
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return <LoadingIndicator message="Loading materials list for consumption..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadMaterials} />;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <Link to="/history" className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
          <History size={16} /> View Consumption Logs
        </Link>
      </div>

      <ConsumptionForm
        materials={materials}
        onSubmit={handleConsumptionSubmit}
        isProcessing={isProcessing}
        successMessage={successMessage}
        errorMessage={errorMessage}
      />

      {/* Helper guide card */}
      <div className="card" style={{ marginTop: '24px', background: '#f8fafc' }}>
        <div className="card-body" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
            <PackageCheck size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px', color: '#ea580c' }} />
            Consumption Rules & Real-Time Integrity
          </h4>
          <ul style={{ fontSize: '0.84rem', color: '#64748b', paddingLeft: '20px', lineHeight: 1.7 }}>
            <li>Stock decrements and consumption logs are processed atomically in a database transaction.</li>
            <li>Requests for more than the currently available stock are rejected automatically.</li>
            <li>Negative stock is strictly forbidden by server-side constraints.</li>
            <li>Real-time stock status is updated in the database and reflected immediately on the dashboard.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
