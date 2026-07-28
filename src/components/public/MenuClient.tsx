'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  const [stickyTop, setStickyTop] = useState(76);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const header = document.querySelector('header');
    if (header) {
      const rect = header.getBoundingClientRect();
      setStickyTop(rect.bottom + 8);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;
        
        const visibleEntries = entries.filter(e => e.isIntersecting);
        if (visibleEntries.length > 0) {
          const mostVisible = visibleEntries.reduce((prev, curr) => 
            curr.intersectionRatio > prev.intersectionRatio ? curr : prev
          );
          
          const id = mostVisible.target.id;
          if (id && id.startsWith('category-')) {
            setActiveCategory(id.replace('category-', ''));
          } else if (id === 'best-sellers-section') {
            setActiveCategory('all');
          }
        }
      },
      { rootMargin: '-100px 0px -50% 0px', threshold: 0 }
    );

    document.querySelectorAll('.scrollspy-section').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, [menu]);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    isScrollingRef.current = true;
    
    if (categoryId === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => { isScrollingRef.current = false; }, 1000);
      return;
    }

    const section = document.getElementById(`category-${categoryId}`);
    if (section) {
      // Calculate scroll position accounting for header + sticky tabs
      const yOffset = -(stickyTop + 60); 
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({ top: y, behavior: 'smooth' });
      setTimeout(() => { isScrollingRef.current = false; }, 1000);
    }
  };

  if (menu.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', color: 'text.secondary', py: 5 }}>
        <Typography>Our menu is currently being updated. Please check back later.</Typography>
      </Box>
    );
  }

  const bestSellers = menu.flatMap(cat => cat.items.filter(item => item.isBestSeller));

  return (
    <Box sx={{ mb: 4 }}>
      <Box 
        sx={{ 
          display: 'flex',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          gap: 1.5,
          pt: 1.5,
          pb: 1.5,
          px: { xs: 2, md: 3 },
          position: 'sticky',
          top: stickyTop,
          zIndex: 1000,
          bgcolor: 'rgba(248, 250, 252, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          // Hide scrollbar but keep functionality
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        }}
      >
          <Box
            onClick={() => handleCategoryClick('all')}
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
              onClick={() => handleCategoryClick(category._id)}
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

      {/* Show Best Sellers */}
      {bestSellers.length > 0 && (
        <Box id="best-sellers-section" className="scrollspy-section" sx={{ pt: 2 }}>
          <BestSellersRow items={bestSellers} />
        </Box>
      )}

      {/* Menu Sections */}
      <Box component="main">
        {menu.map(category => (
          <CategorySection
            key={category._id}
            id={`category-${category._id}`}
            name={category.name}
            image={category.image}
            items={category.items}
          />
        ))}
      </Box>
    </Box>
  );
}
