import React, { useState, useEffect } from 'react';
import { ArrowDownCircle, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ConsumptionForm({
  materials = [],
  selectedMaterialId = '',
  onSubmit,
  isProcessing = false,
  successMessage = '',
  errorMessage = ''
}) {
  const [materialId, setMaterialId] = useState(selectedMaterialId || '');
  const [quantity, setQuantity] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (selectedMaterialId) {
      setMaterialId(String(selectedMaterialId));
    } else if (materials.length > 0 && !materialId) {
      setMaterialId(String(materials[0].id));
    }
  }, [selectedMaterialId, materials]);

  const selectedMaterial = materials.find(m => String(m.id) === String(materialId));

  const availableStock = selectedMaterial ? Number(selectedMaterial.currentStock) || 0 : 0;
  const unit = selectedMaterial ? selectedMaterial.unit : '';

  const parsedQty = parseFloat(quantity) || 0;
  const remainingStock = availableStock - parsedQty;

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!materialId) {
      setValidationError('Please select a material.');
      return;
    }

    if (quantity === '' || isNaN(quantity) || parsedQty <= 0) {
      setValidationError('Quantity consumed must be greater than zero.');
      return;
    }

    if (parsedQty > availableStock) {
      setValidationError(`Cannot consume more than available stock (${availableStock} ${unit}).`);
      return;
    }

    onSubmit({
      materialId: Number(materialId),
      quantity: parsedQty
    }, () => {
      setQuantity('');
    });
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          <ArrowDownCircle size={20} color="#ea580c" />
          Record Material Consumption
        </h2>
      </div>

      <div className="card-body">
        {successMessage && (
          <div className="alert alert-success">
            <CheckCircle2 size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {validationError && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Select Material <span className="required">*</span>
            </label>
            <select
              className="form-control"
              value={materialId}
              onChange={(e) => {
                setMaterialId(e.target.value);
                setValidationError('');
              }}
              disabled={isProcessing}
            >
              <option value="" disabled>-- Select a Material --</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.category}) — Available: {m.currentStock} {m.unit}
                </option>
              ))}
            </select>
          </div>

          {selectedMaterial && (
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '14px 18px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Currently Available Stock</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                  {availableStock} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{unit}</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Reorder Threshold</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ea580c' }}>
                  {selectedMaterial.reorderLevel} {unit}
                </div>
              </div>

              {parsedQty > 0 && (
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Stock After Consumption</div>
                  <div style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 700, 
                    color: remainingStock < 0 ? '#ef4444' : remainingStock <= selectedMaterial.reorderLevel ? '#d97706' : '#10b981'
                  }}>
                    {remainingStock} {unit}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              Quantity Consumed <span className="required">*</span>
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="number"
                step="any"
                min="0.01"
                className="form-control"
                placeholder={selectedMaterial ? `Enter amount in ${unit}` : 'Enter quantity'}
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  setValidationError('');
                }}
                disabled={isProcessing}
              />
              {unit && (
                <span style={{ 
                  background: '#f1f5f9', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '6px', 
                  padding: '10px 16px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: '#475569'
                }}>
                  {unit}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isProcessing || !materialId || parsedQty <= 0 || parsedQty > availableStock}
            >
              <ArrowDownCircle size={18} />
              {isProcessing ? 'Recording Consumption...' : 'Confirm Stock Consumption'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
