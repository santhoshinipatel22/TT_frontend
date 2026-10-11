import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Boxes, 
  CheckCircle2, 
  RefreshCw 
} from 'lucide-react';
import MaterialTable from '../components/MaterialTable';
import MaterialForm from '../components/MaterialForm';
import ConfirmationDialog from '../components/ConfirmationDialog';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';
import { 
  fetchMaterials, 
  createMaterial, 
  updateMaterial, 
  deleteMaterial,
  getErrorMessage 
} from '../services/api';

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMaterials(search, category);
      setMaterials(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, [category]); // reload when category filter changes

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadMaterials();
  };

  const handleOpenAdd = () => {
    setEditingMaterial(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (material) => {
    setEditingMaterial(material);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setIsProcessing(true);
      setError(null);
      if (editingMaterial) {
        await updateMaterial(editingMaterial.id, formData);
        setSuccessMessage(`Successfully updated '${formData.name}'.`);
      } else {
        await createMaterial(formData);
        setSuccessMessage(`Successfully added '${formData.name}' to inventory.`);
      }
      setIsFormOpen(false);
      loadMaterials();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeletePrompt = (material) => {
    setDeleteTarget(material);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsProcessing(true);
      setError(null);
      await deleteMaterial(deleteTarget.id);
      setSuccessMessage(`Successfully removed '${deleteTarget.name}' from inventory.`);
      setDeleteTarget(null);
      loadMaterials();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setError(getErrorMessage(err));
      setDeleteTarget(null);
    } finally {
      setIsProcessing(false);
    }
  };

  // Derive unique categories for the dropdown filter
  const categoriesList = ['ALL', ...new Set(materials.map(m => m.category).filter(Boolean))];

  return (
    <div>
      {/* Notifications */}
      {successMessage && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {error && <ErrorMessage message={error} onRetry={loadMaterials} />}

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Boxes size={20} color="#ea580c" />
            Material Inventory ({materials.length})
          </h2>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="btn btn-secondary" 
              onClick={loadMaterials}
              title="Refresh list"
            >
              <RefreshCw size={16} />
            </button>

            <button 
              className="btn btn-primary"
              onClick={handleOpenAdd}
            >
              <Plus size={16} /> Add Material
            </button>
          </div>
        </div>

        <div className="card-body">
          {/* Search and Category Filter Toolbar */}
          <div className="toolbar">
            <form onSubmit={handleSearchSubmit} className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search materials by name..."
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Filter size={16} style={{ color: '#64748b' }} />
              <select
                className="filter-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'ALL' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table or Loading */}
          {loading ? (
            <LoadingIndicator message="Loading material catalog..." />
          ) : (
            <MaterialTable
              materials={materials}
              onEdit={handleOpenEdit}
              onDelete={handleDeletePrompt}
            />
          )}
        </div>
      </div>

      {/* Add / Edit Material Modal */}
      <MaterialForm
        isOpen={isFormOpen}
        initialData={editingMaterial}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isProcessing={isProcessing}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationDialog
        isOpen={!!deleteTarget}
        title="Confirm Material Deletion"
        message={
          deleteTarget
            ? `Are you sure you want to permanently delete '${deleteTarget.name}'? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete Material"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        isProcessing={isProcessing}
      />
    </div>
  );
}
