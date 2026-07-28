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

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2, mb: { xs: 3, md: 4 } }}>
        <Typography sx={{ typography: { xs: 'h5', md: 'h4' }, fontWeight: 800, color: 'text.primary', textAlign: { xs: 'center', sm: 'right' } }} component="h1">
          عناصر القائمة
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ py: 1.5, px: 3, borderRadius: 3, fontWeight: 700, boxShadow: '0 8px 16px rgba(44, 30, 22, 0.2)' }}
          startIcon={<AddIcon />}
          onClick={() => { setEditingItem(null); setShowModal(true); }}
        >
          إضافة عنصر جديد
        </Button>
      </Box>

      {/* Category Filters */}
      <Stack direction="row" spacing={1} sx={{ mb: 4, flexWrap: 'wrap', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
        <Chip
          label="الكل"
          onClick={() => setFilterCategory('')}
          color={filterCategory === '' ? 'primary' : 'default'}
          variant={filterCategory === '' ? 'filled' : 'outlined'}
          sx={{ borderRadius: '16px', fontWeight: 600, px: 1, height: 36 }}
          clickable
        />
        {categories.map((cat) => (
          <Chip
            key={cat._id}
            label={cat.name}
            onClick={() => setFilterCategory(cat._id)}
            color={filterCategory === cat._id ? 'primary' : 'default'}
            variant={filterCategory === cat._id ? 'filled' : 'outlined'}
            sx={{ borderRadius: '16px', fontWeight: 600, px: 1, height: 36 }}
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
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 }, width: '100%' }}>
                    {/* Top Row: Info */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%' }}>
                      {item.image?.url ? (
                        <Box component="img" src={item.image.url} alt={item.name} sx={{ width: 64, height: 64, borderRadius: 2, objectFit: 'cover', border: '1px solid', borderColor: 'divider' }} />
                      ) : (
                        <Box sx={{ width: 64, height: 64, borderRadius: 2, bgcolor: 'background.paper', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid', borderColor: 'divider' }}>
                          <LocalCafeOutlinedIcon sx={{ color: 'text.secondary' }} />
                        </Box>
                      )}

                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.15rem' }, fontWeight: 800 }}>{item.name}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>{getCategoryName(item.category)}</Typography>
                      </Box>

                      <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', minWidth: 'max-content', textAlign: 'right' }}>
                        {item.hasSizes && item.sizes && item.sizes.length > 0 ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                              متعدد الأحجام
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                              {item.sizes.map(s => (
                                <Chip key={s.name} label={`${s.name}: ${s.price}`} size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: '0.7rem', height: 20 }} />
                              ))}
                            </Box>
                          </Box>
                        ) : (
                          <>{item.price} ج.م</>
                        )}
                      </Typography>
                    </Box>

                    {/* Divider */}
                    <Box sx={{ height: '1px', bgcolor: 'rgba(0,0,0,0.04)', width: '100%' }} />

                    {/* Bottom Row: Actions */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Switch
                          checked={item.isAvailable}
                          onChange={() => handleToggleAvailability(item)}
                          size="small"
                          color="success"
                        />
                        <Chip 
                          label={item.isAvailable ? 'متاح (Available)' : 'غير متاح (Unavailable)'} 
                          color={item.isAvailable ? 'success' : 'default'} 
                          size="small" 
                          variant={item.isAvailable ? 'filled' : 'outlined'}
                          sx={{ fontWeight: 700, borderRadius: 2 }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="error" 
                          startIcon={<DeleteIcon fontSize="small" />} 
                          onClick={() => handleDeleteItem(item._id)}
                          sx={{ borderRadius: 1.5, px: 2, fontWeight: 700, textTransform: 'none' }}
                        >
                          Delete
                        </Button>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="inherit" 
                          startIcon={<EditIcon fontSize="small" />} 
                          onClick={() => { setEditingItem(item); setShowModal(true); }}
                          sx={{ borderRadius: 1.5, px: 2, fontWeight: 700, color: 'text.primary', borderColor: 'rgba(0,0,0,0.2)', textTransform: 'none' }}
                        >
                          Edit
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
            hasSizes: editingItem.hasSizes,
            sizes: editingItem.sizes,
            imageUrl: editingItem.image?.url,
          } : undefined}
          onSubmit={handleFormSubmit}
          isLoading={isSubmitting}
        />
      </Modal>
    </Box>
  );
}
