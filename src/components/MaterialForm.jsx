import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

const COMMON_CATEGORIES = [
  'Binding Material',
  'Structural Material',
  'Masonry',
  'Aggregate',
  'Finishing',
  'Woodwork',
  'Plumbing',
  'Electrical',
  'Other'
];

const COMMON_UNITS = [
  'Bags',
  'Kg',
  'Tonnes',
  'Pieces',
  'Litres',
  'Metres',
  'Cubic Metres',
  'Sq. Metres'
];

export default function MaterialForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isProcessing = false
}) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    unit: '',
    currentStock: '',
    reorderLevel: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || '',
        unit: initialData.unit || '',
        currentStock: initialData.currentStock ?? '',
        reorderLevel: initialData.reorderLevel ?? ''
      });
    } else {
      setFormData({
        name: '',
        category: '',
        unit: '',
        currentStock: '',
        reorderLevel: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Material name is required.';
    if (!formData.category.trim()) errs.category = 'Category is required.';
    if (!formData.unit.trim()) errs.unit = 'Unit is required.';
    
    if (formData.currentStock === '' || isNaN(formData.currentStock) || Number(formData.currentStock) < 0) {
      errs.currentStock = 'Current stock must be a non-negative number (>= 0).';
    }
    if (formData.reorderLevel === '' || isNaN(formData.reorderLevel) || Number(formData.reorderLevel) < 0) {
      errs.reorderLevel = 'Reorder level must be a non-negative number (>= 0).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: formData.name.trim(),
      category: formData.category.trim(),
      unit: formData.unit.trim(),
      currentStock: parseFloat(formData.currentStock),
      reorderLevel: parseFloat(formData.reorderLevel)
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {initialData ? 'Edit Material' : 'Add New Material'}
          </h2>
          <button className="modal-close" onClick={onClose} disabled={isProcessing}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">
                Material Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Cement, Steel Rods 12mm"
                className="form-control"
                disabled={isProcessing}
                autoFocus
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Category <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="category"
                  list="categories-list"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Binding Material"
                  className="form-control"
                  disabled={isProcessing}
                />
                <datalist id="categories-list">
                  {COMMON_CATEGORIES.map(cat => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
                {errors.category && <div className="form-error">{errors.category}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Unit of Measure <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="unit"
                  list="units-list"
                  value={formData.unit}
                  onChange={handleChange}
                  placeholder="e.g. Bags, Kg, Tonnes"
                  className="form-control"
                  disabled={isProcessing}
                />
                <datalist id="units-list">
                  {COMMON_UNITS.map(unit => (
                    <option key={unit} value={unit} />
                  ))}
                </datalist>
                {errors.unit && <div className="form-error">{errors.unit}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Current Stock <span className="required">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  name="currentStock"
                  value={formData.currentStock}
                  onChange={handleChange}
                  placeholder="e.g. 100"
                  className="form-control"
                  disabled={isProcessing}
                />
                {errors.currentStock && <div className="form-error">{errors.currentStock}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Reorder Level <span className="required">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  name="reorderLevel"
                  value={formData.reorderLevel}
                  onChange={handleChange}
                  placeholder="e.g. 20"
                  className="form-control"
                  disabled={isProcessing}
                />
                {errors.reorderLevel && <div className="form-error">{errors.reorderLevel}</div>}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isProcessing}
            >
              <Save size={16} />
              {isProcessing ? 'Saving...' : (initialData ? 'Update Material' : 'Save Material')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
