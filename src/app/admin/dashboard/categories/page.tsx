'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Category } from '@/types';
import Modal from '@/components/ui/Modal';
import CategoryForm from '@/components/admin/CategoryForm';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/categories');
      setCategories(res.data.data);
    } catch {
      showToast('Failed to load categories', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddClick = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('Are you sure? This will also delete all items in this category.')) {
      try {
        await api.delete(`/categories/${id}`);
        showToast('Category deleted successfully', 'success');
        fetchCategories();
      } catch {
        showToast('Failed to delete category', 'error');
      }
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Category updated successfully', 'success');
      } else {
        await api.post('/categories', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Category added successfully', 'success');
      }
      setShowModal(false);
      setEditingCategory(null);
      fetchCategories();
    } catch {
      showToast('Failed to save category', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      <div className="page-header">
        <h1 className="page-title">Categories</h1>
        <button className="btn btn-primary" onClick={handleAddClick}>
          + Add Category
        </button>
      </div>

      {isLoading ? (
        <div className="loading">
          <div className="spinner" />
        </div>
      ) : categories.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📁</div>
          <p>No categories yet. Add your first category!</p>
        </div>
      ) : (
        <div className="item-list">
          {categories.map((category) => (
            <div key={category._id} className="item-row">
              <div style={{ width: '60px', height: '60px', overflow: 'hidden', borderRadius: 'var(--radius-md)', flexShrink: 0 }}>
                {category.image?.url ? (
                  <img src={category.image.url} alt={category.name} className="item-image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'var(--bg-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📁</div>
                )}
              </div>
              <div className="item-info">
                <div className="item-name">{category.name}</div>
                <div className="item-meta">Order: {category.displayOrder}</div>
              </div>
              <div className="item-actions">
                <button className="btn-icon" onClick={() => handleEditClick(category)} aria-label="Edit">✏️</button>
                <button className="btn-icon" onClick={() => handleDeleteClick(category._id)} aria-label="Delete">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingCategory(null); }}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
      >
        <CategoryForm
          initialData={editingCategory ? { name: editingCategory.name, imageUrl: editingCategory.image?.url } : undefined}
          onSubmit={handleFormSubmit}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
}
