'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import api from '@/lib/api';
import { Category, MenuItem } from '@/types';
import Modal from '@/components/ui/Modal';
import MenuItemForm from '@/components/admin/MenuItemForm';
import SortableItem from '@/components/admin/SortableItem';

export default function MenuItemsPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSorting, setIsSorting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [filterCategory, setFilterCategory] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [catRes, itemRes] = await Promise.all([
        api.get('/categories'),
        api.get('/items'),
      ]);
      setCategories(catRes.data.data);
      setItems(itemRes.data.data);
    } catch {
      showToast('Failed to load data', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getCategoryName = (categoryRef: string | Category): string => {
    if (typeof categoryRef === 'object' && categoryRef?.name) return categoryRef.name;
    const cat = categories.find((c) => c._id === categoryRef);
    return cat ? cat.name : 'Unknown';
  };

  const getCategoryId = (categoryRef: string | Category): string => {
    if (typeof categoryRef === 'object') return categoryRef._id;
    return categoryRef;
  };

  const filteredItems = filterCategory
    ? items.filter((item) => getCategoryId(item.category) === filterCategory)
    : items;

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filteredItems.findIndex((i) => i._id === active.id);
    const newIndex = filteredItems.findIndex((i) => i._id === over.id);
    const newOrder = arrayMove(filteredItems, oldIndex, newIndex);

    // Update local state for immediate feedback
    if (filterCategory) {
      setItems((prev) => {
        const others = prev.filter((i) => getCategoryId(i.category) !== filterCategory);
        return [...others, ...newOrder];
      });
    } else {
      setItems(newOrder);
    }

    setIsSorting(true);
    try {
      await api.put('/items/reorder', {
        orderedIds: newOrder.map((i) => i._id),
      });
      showToast('Order updated', 'success');
    } catch {
      showToast('Failed to reorder', 'error');
      fetchData();
    } finally {
      setIsSorting(false);
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      await api.put(`/items/${item._id}`, { isAvailable: !item.isAvailable });
      setItems((prev) =>
        prev.map((i) => (i._id === item._id ? { ...i, isAvailable: !i.isAvailable } : i))
      );
      showToast(`Item marked as ${!item.isAvailable ? 'available' : 'unavailable'}`, 'success');
    } catch {
      showToast('Failed to update availability', 'error');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/items/${id}`);
      showToast('Item deleted', 'success');
      fetchData();
    } catch {
      showToast('Failed to delete item', 'error');
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      if (editingItem) {
        await api.put(`/items/${editingItem._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Item updated successfully', 'success');
      } else {
        await api.post('/items', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Item added successfully', 'success');
      }
      setShowModal(false);
      setEditingItem(null);
      fetchData();
    } catch {
      showToast('Failed to save item', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="loading"><div className="spinner" /></div>;
  }

  return (
    <div>
      {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}

      <div className="page-header">
        <h1 className="page-title">Menu Items</h1>
        <button className="btn btn-primary" onClick={() => { setEditingItem(null); setShowModal(true); }}>
          + Add Item
        </button>
      </div>

      {/* Category Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          className={`btn btn-sm ${filterCategory === '' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setFilterCategory('')}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            className={`btn btn-sm ${filterCategory === cat._id ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilterCategory(cat._id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Items List with DnD */}
      {filteredItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🍽️</div>
          <p>No items found.</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filteredItems.map((i) => i._id)} strategy={verticalListSortingStrategy}>
            <div className="item-list" style={{ opacity: isSorting ? 0.7 : 1, pointerEvents: isSorting ? 'none' : 'auto' }}>
              {filteredItems.map((item) => (
                <SortableItem key={item._id} id={item._id}>
                  <div className="item-row">
                    <div style={{ width: '60px', height: '60px', overflow: 'hidden', borderRadius: 'var(--radius-md)', flexShrink: 0 }}>
                      {item.image?.url ? (
                        <img src={item.image.url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: 'var(--bg-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🍽️</div>
                      )}
                    </div>

                    <div className="item-info">
                      <div className="item-name">{item.name}</div>
                      <div className="item-meta">{getCategoryName(item.category)}</div>
                    </div>

                    <div className="item-price">${item.price.toFixed(2)}</div>

                    <span className={`badge ${item.isAvailable ? 'badge-available' : 'badge-unavailable'}`}>
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </span>

                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={item.isAvailable}
                        onChange={() => handleToggleAvailability(item)}
                      />
                      <span className="toggle-slider" />
                    </label>

                    <div className="item-actions">
                      <button className="btn-icon" onClick={() => { setEditingItem(item); setShowModal(true); }} aria-label="Edit">✏️</button>
                      <button className="btn-icon" onClick={() => handleDeleteItem(item._id)} aria-label="Delete">🗑️</button>
                    </div>
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingItem(null); }}
        title={editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
      >
        <MenuItemForm
          categories={categories}
          initialData={editingItem ? {
            name: editingItem.name,
            description: editingItem.description,
            price: editingItem.price,
            category: getCategoryId(editingItem.category),
            isAvailable: editingItem.isAvailable,
            imageUrl: editingItem.image?.url,
          } : undefined}
          onSubmit={handleFormSubmit}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
}
