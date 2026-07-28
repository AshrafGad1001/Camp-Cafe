'use client';

import React, { useState } from 'react';
import { Box, Typography, Stack, Avatar } from '@mui/material';
import CategorySection from '@/components/public/CategorySection';
import BestSellersRow from '@/components/public/BestSellersRow';

interface MenuCategory {
  _id: string;
  name: string;
  image: { url: string; publicId: string };
  displayOrder: number;
  items: Array<{
    _id: string;
    name: string;
    description: string;
    price: number | null;
    hasSizes?: boolean;
    isBestSeller?: boolean;
    sizes?: { name: string; price: number }[];
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

  const bestSellers = menu.flatMap(cat => cat.items.filter(item => item.isBestSeller));

  const displayedMenu = activeCategory === 'all' 
    ? menu 
    : menu.filter(c => c._id === activeCategory);

  return (
    <Box sx={{ mb: 4 }}>
      <Box 
        sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center', // Center the wrapped items
          gap: 1.5, // ~12px gap horizontal and vertical
          pt: 0,
          pb: 2, 
        }}
      >
          <Box
            onClick={() => setActiveCategory('all')}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              height: 36, // Good touch target min height
              cursor: 'pointer',
              px: 1.5, // Reduced padding
              borderRadius: '18px', 
              bgcolor: activeCategory === 'all' ? '#0A2947' : '#fff',
              color: activeCategory === 'all' ? '#fff' : '#0A2947',
              border: '1px solid',
              borderColor: activeCategory === 'all' ? '#0A2947' : 'rgba(0,0,0,0.06)',
              boxShadow: activeCategory === 'all' ? '0 4px 12px rgba(10, 41, 71, 0.3)' : '0 2px 8px rgba(0,0,0,0.05)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: activeCategory === 'all' ? '#0A2947' : '#f8f9fa',
                transform: 'translateY(-2px)',
                boxShadow: activeCategory === 'all' ? '0 6px 16px rgba(10, 41, 71, 0.4)' : '0 4px 12px rgba(0,0,0,0.08)',
              }
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: activeCategory === 'all' ? 800 : 700, fontSize: '13px' }}>
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
                flexShrink: 0,
                height: 36, // Ensure good touch target
                gap: 0.5, // 4px gap between icon and text
                cursor: 'pointer',
                px: 1, // Reduced horizontal padding to 8px
                borderRadius: '18px',
                bgcolor: activeCategory === category._id ? '#0A2947' : '#fff',
                color: activeCategory === category._id ? '#fff' : '#0A2947',
                border: '1px solid',
                borderColor: activeCategory === category._id ? '#0A2947' : 'rgba(0,0,0,0.06)',
                boxShadow: activeCategory === category._id ? '0 4px 12px rgba(10, 41, 71, 0.3)' : '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: activeCategory === category._id ? '#0A2947' : '#f8f9fa',
                  transform: 'translateY(-2px)',
                  boxShadow: activeCategory === category._id ? '0 6px 16px rgba(10, 41, 71, 0.4)' : '0 4px 12px rgba(0,0,0,0.08)',
                }
              }}
            >
              {category.image?.url && (
                <Avatar 
                  src={category.image.url}
                  sx={{ 
                    width: 18, // Reduced from 20-24
                    height: 18,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
                  }}
                />
              )}
              <Typography variant="body2" sx={{ fontWeight: activeCategory === category._id ? 800 : 700, fontSize: '13px' }}>
                {category.name}
              </Typography>
            </Box>
          ))}
      </Box>

      {/* Show Best Sellers ONLY when 'all' is selected */}
      {activeCategory === 'all' && bestSellers.length > 0 && (
        <BestSellersRow items={bestSellers} />
      )}

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
