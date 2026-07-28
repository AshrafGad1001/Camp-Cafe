'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Category, MenuItem } from '@/types';
import QRCodeGenerator from '@/components/admin/QRCodeGenerator';
import { Grid, Card, Typography, CircularProgress, Box, IconButton, Button } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import FolderIcon from '@mui/icons-material/Folder';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Use ArrowBack for RTL arrow pointing left (which is visually forward)
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState({ categories: 0, items: 0, available: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [catRes, itemRes] = await Promise.all([
          api.get('/categories'),
          api.get('/items'),
        ]);
        const categories: Category[] = catRes.data.data;
        const items: MenuItem[] = itemRes.data.data;
        setStats({
          categories: categories.length,
          items: items.length,
          available: items.filter((i) => i.isAvailable).length,
        });
      } catch {
        console.error('Failed to fetch stats');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, height: '80vh', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  const statCards = [
    { label: 'عناصر متاحة', subtitle: 'إجمالي المتاح', value: stats.available, icon: <CheckCircleOutlinedIcon fontSize="large" />, color: 'success.main', bg: '#D3D4C0' },
    { label: 'عناصر القائمة', subtitle: 'كل العناصر', value: stats.items, icon: <LocalCafeIcon fontSize="large" />, color: 'primary.main', bg: '#D3D4C0' },
    { label: 'التصنيفات', subtitle: 'إجمالي الأقسام', value: stats.categories, icon: <FolderIcon fontSize="large" />, color: 'success.main', bg: '#D3D4C0' },
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', mb: 0.5 }}>
            لوحة التحكم
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            مرحباً بعودتك، Admin 🍃
          </Typography>
        </Box>
        <IconButton sx={{ bgcolor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', p: 1.5, '&:hover': { bgcolor: '#f5f5f5' } }}>
          <NotificationsNoneIcon sx={{ color: 'primary.main' }} />
        </IconButton>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
            <Card sx={{ 
              p: 3, 
              display: 'flex', 
              alignItems: 'center',
              gap: 2, 
              bgcolor: '#fff', 
              borderRadius: 4,
              boxShadow: '0 4px 20px rgba(15, 48, 64, 0.04)',
              position: 'relative'
            }}>
              <Box sx={{ 
                bgcolor: stat.bg, 
                color: stat.color, 
                p: 2, 
                borderRadius: 3, 
                display: 'flex'
              }}>
                {stat.icon}
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', lineHeight: 1.2 }}>
                  {stat.value}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mt: 0.5 }}>
                  {stat.label}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {stat.subtitle}
                </Typography>
              </Box>
              <IconButton size="small" sx={{ border: '1px solid #e0e0e0', color: 'text.secondary', ml: -1 }}>
                <ArrowBackIcon fontSize="small" />
              </IconButton>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Bottom Section */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <QRCodeGenerator />
        </Grid>
        
        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
              روابط سريعة 🔗
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              قم بإدارة التصنيفات وعناصر القائمة الخاصة بك بسهولة.
            </Typography>
          </Box>
          
          <Card 
            component={Link} 
            href="/admin/dashboard/categories"
            sx={{ 
              p: 3, 
              mb: 2,
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              bgcolor: '#fff', 
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(15, 48, 64, 0.04)',
              textDecoration: 'none',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-2px)' }
            }}
          >
            <Box sx={{ bgcolor: 'success.main', color: '#fff', p: 1.5, borderRadius: 2 }}>
              <FolderIcon />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                إدارة التصنيفات
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                إضافة، تعديل أو حذف التصنيفات
              </Typography>
            </Box>
            <ArrowBackIcon sx={{ color: 'text.secondary' }} />
          </Card>

          <Card 
            component={Link} 
            href="/admin/dashboard/items"
            sx={{ 
              p: 3, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              bgcolor: '#fff', 
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(15, 48, 64, 0.04)',
              textDecoration: 'none',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-2px)' }
            }}
          >
            <Box sx={{ bgcolor: 'primary.main', color: '#fff', p: 1.5, borderRadius: 2 }}>
              <LocalCafeIcon />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                إدارة عناصر القائمة
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                إضافة، تعديل أو حذف عناصر القائمة
              </Typography>
            </Box>
            <ArrowBackIcon sx={{ color: 'text.secondary' }} />
          </Card>

        </Grid>
      </Grid>
    </Box>
  );
}
