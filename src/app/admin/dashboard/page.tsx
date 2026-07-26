'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Category, MenuItem } from '@/types';
import QRCodeGenerator from '@/components/admin/QRCodeGenerator';
import { Grid, Card, Typography, CircularProgress, Box, Button } from '@mui/material';

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
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const statCards = [
    { label: 'Categories', value: stats.categories, icon: '📁', color: 'var(--accent)' },
    { label: 'Menu Items', value: stats.items, icon: '🍽️', color: 'var(--success)' },
    { label: 'Available', value: stats.available, icon: '✅', color: '#a78bfa' },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={stat.label}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" sx={{ mb: 1 }}>{stat.icon}</Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: stat.color, mb: 1 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {stat.label}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flexDirection: 'column' }}>
              <Button href="/admin/dashboard/categories" variant="outlined" sx={{ justifyContent: 'flex-start' }}>
                📁 Manage Categories
              </Button>
              <Button href="/admin/dashboard/items" variant="outlined" sx={{ justifyContent: 'flex-start' }}>
                🍽️ Manage Menu Items
              </Button>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <QRCodeGenerator />
        </Grid>
      </Grid>
    </Box>
  );
}
