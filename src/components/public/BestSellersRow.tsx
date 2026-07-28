'use client';

import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

interface BestSellerItem {
  _id: string;
  name: string;
  description: string;
  price: number | null;
  hasSizes?: boolean;
  sizes?: { name: string; price: number }[];
  image: { url: string; publicId: string };
}

interface BestSellersRowProps {
  items: BestSellerItem[];
}

export default function BestSellersRow({ items }: BestSellersRowProps) {
  if (!items || items.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, px: { xs: 2, md: 3 } }}>
        <StarIcon sx={{ color: 'warning.main', fontSize: 28 }} />
        <Typography variant="h5" sx={{ fontWeight: 900, color: '#0A2947' }}>
          الأكثر مبيعاً
        </Typography>
      </Box>

      {/* Horizontal Scroll Container */}
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 2,
          pb: 2,
          px: { xs: 2, md: 3 },
          scrollSnapType: 'x mandatory',
          // Hide scrollbar but keep functionality
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        }}
      >
        {items.map((item) => (
          <Card
            key={item._id}
            sx={{
              minWidth: { xs: 240, sm: 280 },
              maxWidth: { xs: 240, sm: 280 },
              scrollSnapAlign: 'start',
              borderRadius: 4,
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'visible',
              bgcolor: '#0A2947', // Dark Premium Background
              color: '#fff',
              boxShadow: '0 12px 24px rgba(10, 41, 71, 0.25)',
              border: '1px solid rgba(196, 154, 69, 0.3)', // Gold border
            }}
          >
            {/* Gold Badge */}
            <Box
              sx={{
                position: 'absolute',
                top: -10,
                left: -10,
                bgcolor: 'warning.main',
                color: '#fff',
                px: 1.5,
                py: 0.5,
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '0.75rem',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <StarIcon sx={{ fontSize: 14 }} /> Top
            </Box>

            <Box sx={{ p: 1 }}>
              <Box
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  position: 'relative',
                  height: 180,
                }}
              >
                {item.image?.url ? (
                  <CardMedia
                    component="img"
                    height="180"
                    image={item.image.url}
                    alt={item.name}
                    sx={{ transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}
                  />
                ) : (
                  <Box sx={{ height: 180, bgcolor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <StarIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.2)' }} />
                  </Box>
                )}
                {/* Gold Gradient overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '50%',
                    background: 'linear-gradient(to top, #0A2947 0%, transparent 100%)',
                  }}
                />
              </Box>
            </Box>

            <CardContent sx={{ pt: 1, pb: '16px !important', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5, color: '#C49A45' }}>
                {item.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2, flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.description}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                {item.hasSizes && item.sizes && item.sizes.length > 0 ? (
                  <Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>تبدأ من</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff' }}>
                      {Math.min(...item.sizes.map(s => s.price))} ج.م
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff' }}>
                    {item.price} ج.م
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
