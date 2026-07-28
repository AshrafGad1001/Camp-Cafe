import React, { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Box, ButtonBase } from '@mui/material';

interface MenuItemCardProps {
  name: string;
  description: string;
  price: number | null;
  hasSizes?: boolean;
  sizes?: { name: string; price: number }[];
  image?: { url: string; publicId: string };
}

export default function MenuItemCard({ name, description, price, hasSizes, sizes, image }: MenuItemCardProps) {
  const validSizes = sizes?.filter(s => s.name && s.price > 0) || [];
  
  // Find index of 'M' (Medium), or default to the first valid size (0)
  const defaultSizeIndex = validSizes.findIndex(s => s.name === 'M');
  const initialIndex = defaultSizeIndex !== -1 ? defaultSizeIndex : 0;
  
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number>(initialIndex);

  const isSizesAvailable = hasSizes && validSizes.length > 0;
  
  const displayPrice = isSizesAvailable 
    ? validSizes[selectedSizeIndex]?.price 
    : price;
  return (
    <Card sx={{ 
      display: 'flex', 
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      borderRadius: '20px', // slightly softer corners
      boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
      border: '1px solid rgba(0,0,0,0.03)',
      p: 2,
      height: '100%',
      gap: 2,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 28px rgba(30, 58, 95, 0.08)',
        borderColor: 'rgba(30, 58, 95, 0.1)',
      }
    }}>
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', height: '100%' }}>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 800, color: '#1E3A5F', mb: 0.5, fontSize: '1.05rem', lineHeight: 1.3 }}>
          {name}
        </Typography>
        {description && (
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem', mb: 1, flexGrow: 1 }}>
            {description}
          </Typography>
        )}
        <Box sx={{ 
          width: '100%', 
          mt: 'auto', 
          pt: 1.5, 
          borderTop: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 -4px 12px rgba(0,0,0,0.02)' 
        }}>
          {isSizesAvailable ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {validSizes.map((size, index) => {
                  const isSelected = index === selectedSizeIndex;
                  return (
                    <ButtonBase
                      key={size.name}
                      onClick={() => setSelectedSizeIndex(index)}
                      sx={{
                        minWidth: 28,
                        height: 28,
                        px: 1,
                        borderRadius: '14px',
                        fontSize: '0.75rem',
                        fontWeight: isSelected ? 800 : 600,
                        bgcolor: isSelected ? '#1E3A5F' : '#f0f2f5',
                        color: isSelected ? '#fff' : '#1E3A5F',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {size.name}
                    </ButtonBase>
                  );
                })}
              </Box>
              <Typography 
                variant="h6" 
                key={displayPrice}
                sx={{ 
                  fontWeight: 800, 
                  color: '#C49A45', // Gold Accent
                  fontSize: '1.15rem',
                  animation: 'fadeIn 0.3s ease-in-out',
                  '@keyframes fadeIn': {
                    '0%': { opacity: 0.3, transform: 'translateY(2px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' }
                  }
                }}
              >
                {displayPrice} <Typography component="span" variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, ml: 0.5 }}>ج.م</Typography>
              </Typography>
            </Box>
          ) : displayPrice !== null && displayPrice !== undefined ? (
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#C49A45', fontSize: '1.15rem' }}>
              {displayPrice} <Typography component="span" variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, ml: 0.5 }}>ج.م</Typography>
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              السعر غير متاح
            </Typography>
          )}
        </Box>
      </Box>

      {image?.url && (
        <Box sx={{ width: 100, height: 100, flexShrink: 0, ml: 2, position: 'relative' }}>
          <Box sx={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            borderRadius: '16px',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.04)',
            zIndex: 1,
            pointerEvents: 'none'
          }} />
          <CardMedia 
            component="img" 
            image={image.url} 
            alt={name} 
            sx={{ borderRadius: '16px', width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
      )}
    </Card>
  );
}
