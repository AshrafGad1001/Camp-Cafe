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
        <Stack direction="row" spacing={2} sx={{ minWidth: 'max-content', px: 1 }}>
          <Box
            onClick={() => setActiveCategory('all')}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              opacity: activeCategory === 'all' ? 1 : 0.6,
              transition: 'all 0.3s ease',
              transform: activeCategory === 'all' ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            <Avatar 
              sx={{ 
                width: 64, 
                height: 64, 
                bgcolor: activeCategory === 'all' ? 'primary.main' : 'grey.300',
                border: activeCategory === 'all' ? '3px solid' : 'none',
                borderColor: 'primary.main',
                boxShadow: activeCategory === 'all' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              الكل
            </Avatar>
            <Typography variant="body2" sx={{ fontWeight: activeCategory === 'all' ? 800 : 600 }}>
              All
            </Typography>
          </Box>

          {menu.map(category => (
            <Box
              key={category._id}
              onClick={() => setActiveCategory(category._id)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                opacity: activeCategory === category._id ? 1 : 0.6,
                transition: 'all 0.3s ease',
                transform: activeCategory === category._id ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              <Avatar 
                src={category.image?.url}
                sx={{ 
                  width: 64, 
                  height: 64,
                  border: activeCategory === category._id ? '3px solid' : 'none',
                  borderColor: 'primary.main',
                  boxShadow: activeCategory === category._id ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                }}
              />
              <Typography variant="body2" sx={{ fontWeight: activeCategory === category._id ? 800 : 600 }}>
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
