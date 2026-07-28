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
          display: 'block',
          whiteSpace: 'nowrap',
          overflowX: 'auto', 
          width: '100%',
          maxWidth: '100vw',
          py: 2, 
          mb: 4,
          px: 2,
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
        }}
      >
          <Box
            onClick={() => setActiveCategory('all')}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              verticalAlign: 'middle',
              height: 44,
              gap: 1,
              cursor: 'pointer',
              px: 3,
              ml: 1.5,
              borderRadius: '24px',
              bgcolor: activeCategory === 'all' ? '#1E3A5F' : '#fff',
              color: activeCategory === 'all' ? '#fff' : '#1E3A5F',
              border: '1px solid',
              borderColor: activeCategory === 'all' ? '#1E3A5F' : 'rgba(0,0,0,0.08)',
              boxShadow: activeCategory === 'all' ? '0 4px 12px rgba(30,58,95,0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: activeCategory === 'all' ? '#1E3A5F' : '#f8f9fa'
              }
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: activeCategory === 'all' ? 800 : 700, fontSize: '0.95rem' }}>
              الكل
            </Typography>
          </Box>

          {menu.map(category => (
            <Box
              key={category._id}
              onClick={() => setActiveCategory(category._id)}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                verticalAlign: 'middle',
                height: 44,
                gap: 1,
                cursor: 'pointer',
                px: 2.5,
                ml: 1.5,
                borderRadius: '24px',
                bgcolor: activeCategory === category._id ? '#1E3A5F' : '#fff',
                color: activeCategory === category._id ? '#fff' : '#1E3A5F',
                border: '1px solid',
                borderColor: activeCategory === category._id ? '#1E3A5F' : 'rgba(0,0,0,0.08)',
                boxShadow: activeCategory === category._id ? '0 4px 12px rgba(30,58,95,0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: activeCategory === category._id ? '#1E3A5F' : '#f8f9fa'
                }
              }}
            >
              {category.image?.url && (
                <Avatar 
                  src={category.image.url}
                  sx={{ 
                    width: 28, 
                    height: 28,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
              )}
              <Typography variant="body2" sx={{ fontWeight: activeCategory === category._id ? 800 : 700, fontSize: '0.95rem' }}>
                {category.name}
              </Typography>
            </Box>
          ))}
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
