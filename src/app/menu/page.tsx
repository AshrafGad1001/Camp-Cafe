import React from 'react';
import { Box, Container, Typography, AppBar, Toolbar } from '@mui/material';
import CategorySection from '@/components/public/CategorySection';

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
      <AppBar position="sticky" sx={{ bgcolor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <Toolbar sx={{ justifyContent: 'center', py: 1 }}>
          <Box component="img" src="/logo.png" alt="Camp Cafe" sx={{ height: 40 }} />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>

        <Box component="main">
          {menu.length === 0 ? (
            <Box sx={{ textAlign: 'center', color: 'text.secondary', py: 5 }}>
              <Typography>Our menu is currently being updated. Please check back later.</Typography>
            </Box>
          ) : (
            menu.map(category => (
              <CategorySection
                key={category._id}
                name={category.name}
                image={category.image}
                items={category.items}
              />
            ))
          )}
        </Box>

        <Box component="footer" sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            © 2024 Camp Cafe. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
