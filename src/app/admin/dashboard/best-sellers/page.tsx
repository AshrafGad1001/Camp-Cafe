'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { MenuItem } from '@/types';
import { Box, Typography, Button, Snackbar, Alert, Grid, Card, CardMedia, CardContent, CardActions, Chip, CircularProgress } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

export default function BestSellersPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchBestSellers = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/items/best-sellers');
      setItems(res.data.data);
    } catch (error) {
      console.error('Failed to load best sellers:', error);
      showToast('Failed to load Best Sellers', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBestSellers();
  }, [fetchBestSellers]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRemoveBestSeller = async (itemId: string) => {
    try {
      // Create a FormData just to update isBestSeller to false
      const formData = new FormData();
      formData.append('isBestSeller', 'false');
      
      await api.put(`/items/${itemId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      showToast('تمت الإزالة بنجاح', 'success');
      fetchBestSellers();
    } catch (error: any) {
      console.error('Failed to remove:', error);
      showToast(error.response?.data?.message || 'Failed to remove from Best Sellers', 'error');
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <StarIcon sx={{ color: 'warning.main', fontSize: 32 }} />
            الأكثر مبيعاً
          </Typography>
          <Typography variant="body1" color="text.secondary">
            إدارة العناصر المميزة (حد أقصى 10 عناصر)
          </Typography>
        </Box>
        <Chip 
          label={`${items.length} / 10`} 
          color={items.length >= 10 ? 'error' : 'success'} 
          sx={{ fontWeight: 'bold', fontSize: '1.1rem', px: 1 }} 
        />
      </Box>

      {items.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'background.paper', borderRadius: 4, border: '1px dashed #ccc' }}>
          <StarIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">لا توجد عناصر في قائمة الأكثر مبيعاً</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {items.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id || item.id}>
              <Card sx={{ 
                borderRadius: 4, 
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: '2px solid transparent',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'warning.main',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
                }
              }}>
                {item.image?.url && (
                  <CardMedia
                    component="img"
                    height="160"
                    image={item.image.url}
                    alt={item.name}
                  />
                )}
                <CardContent sx={{ pb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {typeof item.category === 'object' ? (item.category as any).name : 'Category'}
                  </Typography>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                  <Button 
                    size="small" 
                    color="error" 
                    variant="outlined" 
                    fullWidth 
                    startIcon={<RemoveCircleOutlineIcon />}
                    onClick={() => handleRemoveBestSeller(item._id || item.id as string)}
                    sx={{ borderRadius: 2 }}
                  >
                    إزالة
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toast?.type} variant="filled" sx={{ width: '100%' }}>
          {toast?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
