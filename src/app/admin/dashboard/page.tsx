'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Category, MenuItem } from '@/types';
import QRCodeGenerator from '@/components/admin/QRCodeGenerator';
import { Grid, Card, Typography, CircularProgress, Box, IconButton, Button, Avatar } from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
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
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  const statCards = [
    { label: 'عناصر متاحة', subtitle: 'إجمالي المتاح للطلب', value: stats.available, icon: <CheckCircleOutlinedIcon sx={{ fontSize: 32 }} />, color: 'success.main' },
    { label: 'عناصر القائمة', subtitle: 'كل المشروبات والألعاب', value: stats.items, icon: <SportsEsportsIcon sx={{ fontSize: 32 }} />, color: 'primary.main' },
    { label: 'التصنيفات', subtitle: 'إجمالي الأقسام بالمنيو', value: stats.categories, icon: <DashboardCustomizeOutlinedIcon sx={{ fontSize: 32 }} />, color: 'secondary.main' },
  ];

  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto', p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1, letterSpacing: '-0.5px' }}>
            لوحة التحكم
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            مرحباً بعودتك، إليك نظرة عامة على نشاط النظام ☕🎮
          </Typography>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {statCards.map((stat, idx) => (
          <Grid size={{ xs: 12, md: 4 }} key={idx}>
            <Card sx={{ 
              p: 3, 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: '#fff', 
              border: '1px solid',
              borderColor: 'rgba(0,0,0,0.03)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <Avatar sx={{ 
                  bgcolor: stat.color, 
                  color: '#fff', 
                  width: 56, 
                  height: 56, 
                  borderRadius: 3, 
                  boxShadow: `0 8px 16px ${stat.color}40`,
                }}>
                  {stat.icon}
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1, mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    {stat.subtitle}
                  </Typography>
                </Box>
              </Box>
              <IconButton size="small" sx={{ 
                bgcolor: 'background.default',
                '&:hover': { bgcolor: 'primary.main', color: '#fff' }
              }}>
                <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Bottom Section */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 5 }}>
          <QRCodeGenerator />
        </Grid>
        
        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              روابط سريعة ⚡
            </Typography>
          </Box>
          
          <Card 
            component={Link} 
            href="/admin/dashboard/categories"
            sx={{ 
              p: 3, 
              mb: 3,
              display: 'flex', 
              alignItems: 'center', 
              gap: 3,
              bgcolor: '#fff', 
              textDecoration: 'none',
              border: '1px solid',
              borderColor: 'rgba(0,0,0,0.03)',
              '&:hover .hover-icon': { transform: 'translateX(-4px)', color: 'primary.main' }
            }}
          >
            <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.dark', width: 64, height: 64, borderRadius: 3 }}>
              <DashboardCustomizeOutlinedIcon fontSize="large" />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
                إدارة التصنيفات
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                إضافة، تعديل أو ترتيب الأقسام داخل المنيو
              </Typography>
            </Box>
            <ArrowBackIosNewIcon className="hover-icon" sx={{ color: 'text.disabled', transition: 'all 0.2s ease' }} />
          </Card>

          <Card 
            component={Link} 
            href="/admin/dashboard/items"
            sx={{ 
              p: 3, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 3,
              bgcolor: '#fff', 
              textDecoration: 'none',
              border: '1px solid',
              borderColor: 'rgba(0,0,0,0.03)',
              '&:hover .hover-icon': { transform: 'translateX(-4px)', color: 'primary.main' }
            }}
          >
            <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark', width: 64, height: 64, borderRadius: 3 }}>
              <SportsEsportsIcon fontSize="large" />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
                إدارة عناصر القائمة
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                التحكم في المشروبات، الألعاب، الأسعار والتوافر
              </Typography>
            </Box>
            <ArrowBackIosNewIcon className="hover-icon" sx={{ color: 'text.disabled', transition: 'all 0.2s ease' }} />
          </Card>

        </Grid>
      </Grid>
    </Box>
  );
}
