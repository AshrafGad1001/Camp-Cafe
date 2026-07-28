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
import { Category } from '@/types';
import Modal from '@/components/ui/Modal';
import CategoryForm from '@/components/admin/CategoryForm';
import SortableItem from '@/components/admin/SortableItem';
import { Box, Typography, Button, Snackbar, Alert, IconButton, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSorting, setIsSorting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/categories');
      setCategories(res.data.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = categories.findIndex((c) => c._id === active.id);
    const newIndex = categories.findIndex((c) => c._id === over.id);
    const newOrder = arrayMove(categories, oldIndex, newIndex);

    setCategories(newOrder);
    setIsSorting(true);

    try {
      await api.put('/categories/reorder', {
        orderedIds: newOrder.map((c) => c._id),
      });
      showToast('Order updated', 'success');
    } catch {
      showToast('Failed to reorder', 'error');
      fetchCategories();
    } finally {
      setIsSorting(false);
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

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('Are you sure? This will also delete all items in this category.')) {
      try {
        await api.delete(`/categories/${id}`);
        showToast('Category deleted', 'success');
        fetchCategories();
      } catch {
        showToast('Failed to delete category', 'error');
      }
    }
  };

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
          Categories
        </Typography>
        <Button
          variant="contained"
          size="medium"
          sx={{ size: { xs: 'small', md: 'medium' } }}
          startIcon={<AddIcon />}
          onClick={() => { setEditingCategory(null); setShowModal(true); }}
        >
          Add Category
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : categories.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <FolderIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography color="text.secondary">No categories yet. Add your first category!</Typography>
        </Box>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={categories.map((c) => c._id)} strategy={verticalListSortingStrategy}>
            <Box sx={{ opacity: isSorting ? 0.7 : 1, pointerEvents: isSorting ? 'none' : 'auto' }}>
              {categories.map((category) => (
                <SortableItem key={category._id} id={category._id}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                    {/* Top Row: Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      {category.image?.url ? (
                        <Box component="img" src={category.image.url} alt={category.name} sx={{ width: 64, height: 64, borderRadius: 2, objectFit: 'cover' }} />
                      ) : (
                        <Box sx={{ width: 64, height: 64, borderRadius: 2, bgcolor: 'background.paper', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid', borderColor: 'divider' }}>
                          <FolderIcon sx={{ color: 'text.secondary' }} />
                        </Box>
                      )}
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, fontWeight: 700 }}>{category.name}</Typography>
                        <Typography variant="body2" color="text.secondary">Order: {category.displayOrder}</Typography>
                      </Box>
                    </Box>

                    {/* Bottom Row: Actions */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end', gap: 1, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="primary" 
                        startIcon={<EditIcon />} 
                        onClick={() => { setEditingCategory(category); setShowModal(true); }}
                        sx={{ borderRadius: 2 }}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="error" 
                        startIcon={<DeleteIcon />} 
                        onClick={() => handleDeleteClick(category._id)}
                        sx={{ borderRadius: 2 }}
                      >
                        Delete
                      </Button>
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
        onClose={() => { setShowModal(false); setEditingCategory(null); }}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
      >
        <CategoryForm
          initialData={editingCategory ? { name: editingCategory.name, imageUrl: editingCategory.image?.url } : undefined}
          onSubmit={handleFormSubmit}
          isLoading={isSubmitting}
        />
      </Modal>
    </Box>
  );
}
