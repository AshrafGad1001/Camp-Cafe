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
      <Box 
        sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 1, // reduced gap
          py: 2, 
          mb: 4,
          px: 2,
        }}
      >
          <Box
            onClick={() => setActiveCategory('all')}
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                verticalAlign: 'middle',
                height: 36, // reduced height
                cursor: 'pointer',
                px: 2, // reduced padding
                borderRadius: '20px', // slightly smaller border radius
              bgcolor: activeCategory === 'all' ? '#1E3A5F' : '#fff',
              color: activeCategory === 'all' ? '#fff' : '#1E3A5F',
              border: '1px solid',
              borderColor: activeCategory === 'all' ? '#1E3A5F' : 'rgba(0,0,0,0.06)',
              boxShadow: activeCategory === 'all' ? '0 4px 10px rgba(30,58,95,0.25)' : '0 2px 6px rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: activeCategory === 'all' ? '#1E3A5F' : '#f8f9fa',
                transform: 'translateY(-1px)',
                boxShadow: activeCategory === 'all' ? '0 6px 14px rgba(30,58,95,0.3)' : '0 4px 8px rgba(0,0,0,0.06)',
              }
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: activeCategory === 'all' ? 800 : 700, fontSize: '0.85rem' }}>
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
                height: 36, // reduced height
                gap: 0.75, // reduced gap between image and text
                cursor: 'pointer',
                px: 1.5, // reduced padding
                borderRadius: '20px',
                bgcolor: activeCategory === category._id ? '#1E3A5F' : '#fff',
                color: activeCategory === category._id ? '#fff' : '#1E3A5F',
                border: '1px solid',
                borderColor: activeCategory === category._id ? '#1E3A5F' : 'rgba(0,0,0,0.06)',
                boxShadow: activeCategory === category._id ? '0 4px 10px rgba(30,58,95,0.25)' : '0 2px 6px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: activeCategory === category._id ? '#1E3A5F' : '#f8f9fa',
                  transform: 'translateY(-1px)',
                  boxShadow: activeCategory === category._id ? '0 6px 14px rgba(30,58,95,0.3)' : '0 4px 8px rgba(0,0,0,0.06)',
                }
              }}
            >
              {category.image?.url && (
                <Avatar 
                  src={category.image.url}
                  sx={{ 
                    width: 22, // reduced avatar size
                    height: 22,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
                  }}
                />
              )}
              <Typography variant="body2" sx={{ fontWeight: activeCategory === category._id ? 800 : 700, fontSize: '0.85rem' }}>
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
