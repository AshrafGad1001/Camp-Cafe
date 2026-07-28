'use client';

import React, { useState } from 'react';
import { Box, Typography, Stack, Avatar } from '@mui/material';
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

export default function MenuClient({ menu }: { menu: MenuCategory[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  if (menu.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', color: 'text.secondary', py: 5 }}>
        <Typography>Our menu is currently being updated. Please check back later.</Typography>
      </Box>
    );
  }

  const displayedMenu = activeCategory === 'all' 
    ? menu 
    : menu.filter(c => c._id === activeCategory);

  return (
    <Box>
      {/* Category Filter Bar */}
      <Box 
        sx={{ 
          overflowX: 'auto', 
          py: 2, 
          mb: 4,
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ minWidth: 'max-content', px: 1 }}>
          <Box
            onClick={() => setActiveCategory('all')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              py: 1,
              px: 2.5,
              borderRadius: '24px',
              bgcolor: activeCategory === 'all' ? 'primary.main' : 'transparent',
              color: activeCategory === 'all' ? '#fff' : 'text.primary',
              border: '1px solid',
              borderColor: activeCategory === 'all' ? 'primary.main' : 'rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: activeCategory === 'all' ? 'primary.main' : 'rgba(0,0,0,0.04)'
              }
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: activeCategory === 'all' ? 700 : 600, fontSize: '0.95rem' }}>
              All
            </Typography>
          </Box>

          {menu.map(category => (
            <Box
              key={category._id}
              onClick={() => setActiveCategory(category._id)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                py: 1,
                px: 2.5,
                borderRadius: '24px',
                bgcolor: activeCategory === category._id ? 'primary.main' : 'transparent',
                color: activeCategory === category._id ? '#fff' : 'text.primary',
                border: '1px solid',
                borderColor: activeCategory === category._id ? 'primary.main' : 'rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: activeCategory === category._id ? 'primary.main' : 'rgba(0,0,0,0.04)'
                }
              }}
            >
              {category.image?.url && (
                <Avatar 
                  src={category.image.url}
                  sx={{ 
                    width: 24, 
                    height: 24,
                  }}
                />
              )}
              <Typography variant="body2" sx={{ fontWeight: activeCategory === category._id ? 700 : 600, fontSize: '0.95rem' }}>
                {category.name}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Menu Sections */}
      <Box component="main">
        {displayedMenu.map(category => (
          <CategorySection
            key={category._id}
            name={category.name}
            image={category.image}
            items={category.items}
          />
        ))}
      </Box>
    </Box>
  );
}
