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
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    if (!scrollContainerRef.current || isPaused) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        const maxScroll = scrollWidth - clientWidth;
        
        // In RTL, we scroll to the left (negative values). Math.abs helps normalize.
        if (Math.abs(scrollLeft) >= maxScroll - 10) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll left by roughly one card width
          scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

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
        ref={scrollContainerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 2,
          pt: 2, // Added padding top to prevent badge clipping
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
              borderRadius: '24px',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
              bgcolor: '#FFFFFF',
              color: '#1E293B',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(0, 0, 0, 0.04)',
            }}
          >
            {/* Green Badge */}
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                bgcolor: '#728A70', // Muted green
                color: '#fff',
                px: 1.5,
                py: 0.5,
                borderRadius: '20px',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                boxShadow: '0 4px 12px rgba(114, 138, 112, 0.3)',
              }}
            >
              الأكثر مبيعاً <StarIcon sx={{ fontSize: 16, mb: '2px' }} />
            </Box>

            {/* Image Area */}
            <Box
              sx={{
                width: '100%',
                height: 200,
                bgcolor: '#F8FAFC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
              }}
            >
              {item.image?.url ? (
                <CardMedia
                  component="img"
                  image={item.image.url}
                  alt={item.name}
                  sx={{ 
                    maxHeight: '100%', 
                    width: 'auto', 
                    objectFit: 'contain',
                    transition: 'transform 0.3s', 
                    '&:hover': { transform: 'scale(1.05)' },
                    filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.1))'
                  }}
                />
              ) : (
                <StarIcon sx={{ fontSize: 40, color: 'rgba(0,0,0,0.1)' }} />
              )}
            </Box>

            <CardContent sx={{ pt: 2, pb: '20px !important', flexGrow: 1, display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5, color: '#1E293B' }}>
                {item.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', mb: 2, flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.description}
              </Typography>

              {/* Dashed Separator */}
              <Box sx={{ borderTop: '2px dashed #E2E8F0', my: 2, mx: 'auto', width: '100%' }} />

              {/* Price */}
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 0.5, mt: 'auto' }}>
                {item.hasSizes && item.sizes && item.sizes.length > 0 ? (
                  <>
                    <Typography variant="body2" sx={{ color: '#64748B' }}>تبدأ من</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#728A70' }}>
                      {Math.min(...item.sizes.map(s => s.price))}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>ج.م</Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#728A70' }}>
                      {item.price}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>ج.م</Typography>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
