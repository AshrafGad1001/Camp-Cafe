import React from 'react';
import { Box, Container, Typography, AppBar, Toolbar } from '@mui/material';
import MenuClient from '@/components/public/MenuClient';

interface MenuCategory {
  _id: string;
  name: string;
  image: { url: string; publicId: string };
  displayOrder: number;
  items: Array<{
    _id: string;
    name: string;
    description: string;
    price: number;
    image: { url: string; publicId: string };
  }>;
}

async function getMenu(): Promise<MenuCategory[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  try {
    const res = await fetch(`${apiUrl}/menu`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Failed to fetch menu:', error);
    return [];
  }
}

export default async function MenuPage() {
  const menu = await getMenu();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ px: { xs: 2, md: 4 }, pt: { xs: 2, md: 3 }, pb: 2, position: 'sticky', top: 0, zIndex: 1100, width: '100%', pointerEvents: 'none' }}>
        <AppBar position="static" sx={{ 
          bgcolor: 'rgba(10, 41, 71, 0.95)', 
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: '0 8px 32px rgba(10, 41, 71, 0.25)', 
          borderRadius: '20px', 
          width: '100%',
          maxWidth: '1200px',
          mx: 'auto',
          pointerEvents: 'auto',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <Toolbar sx={{ justifyContent: 'center', py: 0.5, minHeight: '52px !important' }}>
            <Box component="img" src="/logo.png" alt="Camp Cafe" sx={{ height: 38, filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))' }} />
          </Toolbar>
        </AppBar>
      </Box>

      <Container maxWidth="lg" sx={{ py: 2 }}>
        <MenuClient menu={menu} />

        <Box component="footer" sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            © 2024 Camp Cafe. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
