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
import { Box, Typography, Button, Snackbar, Alert, IconButton, Stack, Chip, Switch, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import LocalCafeOutlinedIcon from '@mui/icons-material/LocalCafeOutlined';

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
    } catch (error) {
      console.error('Failed to load data:', error);
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
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {toast ? (
          <Alert severity={toast.type} onClose={() => setToast(null)}>
            {toast.message}
          </Alert>
        ) : <div />}
      </Snackbar>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 3, md: 4 } }}>
        <Typography sx={{ typography: { xs: 'h5', md: 'h4' } }} component="h1">
          Menu Items
        </Typography>
        <Button
          variant="contained"
          size="medium"
          sx={{ size: { xs: 'small', md: 'medium' } }}
          startIcon={<AddIcon />}
          onClick={() => { setEditingItem(null); setShowModal(true); }}
        >
          Add Item
        </Button>
      </Box>

      {/* Category Filters */}
      <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Chip
          label="All"
          onClick={() => setFilterCategory('')}
          color={filterCategory === '' ? 'primary' : 'default'}
          variant={filterCategory === '' ? 'filled' : 'outlined'}
          clickable
        />
        {categories.map((cat) => (
          <Chip
            key={cat._id}
            label={cat.name}
            onClick={() => setFilterCategory(cat._id)}
            color={filterCategory === cat._id ? 'primary' : 'default'}
            variant={filterCategory === cat._id ? 'filled' : 'outlined'}
            clickable
          />
        ))}
      </Stack>

      {/* Items List with DnD */}
      {filteredItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <LocalCafeIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography color="text.secondary">No items found.</Typography>
        </Box>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filteredItems.map((i) => i._id)} strategy={verticalListSortingStrategy}>
            <Box sx={{ opacity: isSorting ? 0.7 : 1, pointerEvents: isSorting ? 'none' : 'auto' }}>
              {filteredItems.map((item) => (
                <SortableItem key={item._id} id={item._id}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                    {/* Top Row: Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      {item.image?.url ? (
                        <Box component="img" src={item.image.url} alt={item.name} sx={{ width: 64, height: 64, borderRadius: 2, objectFit: 'cover' }} />
                      ) : (
                        <Box sx={{ width: 64, height: 64, borderRadius: 2, bgcolor: 'background.paper', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid', borderColor: 'divider' }}>
                          <LocalCafeOutlinedIcon sx={{ color: 'text.secondary' }} />
                        </Box>
                      )}

                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, fontWeight: 700 }}>{item.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{getCategoryName(item.category)}</Typography>
                      </Box>

                      <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800 }}>{item.price} ج.م</Typography>
                    </Box>

                    {/* Bottom Row: Actions */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Switch
                          checked={item.isAvailable}
                          onChange={() => handleToggleAvailability(item)}
                          size="small"
                        />
                        <Chip 
                          label={item.isAvailable ? 'متاح (Available)' : 'غير متاح (Unavailable)'} 
                          color={item.isAvailable ? 'success' : 'default'} 
                          size="small" 
                          variant={item.isAvailable ? 'filled' : 'outlined'}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="primary" 
                          startIcon={<EditIcon />} 
                          onClick={() => { setEditingItem(item); setShowModal(true); }}
                          sx={{ borderRadius: 2 }}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="error" 
                          startIcon={<DeleteIcon />} 
                          onClick={() => handleDeleteItem(item._id)}
                          sx={{ borderRadius: 2 }}
                        >
                          Delete
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </SortableItem>
              ))}
            </Box>
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
    </Box>
  );
}
