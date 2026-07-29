'use client';

import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, ButtonBase } from '@mui/material';
import Image from 'next/image';

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
      alignItems: 'stretch',
      justifyContent: 'space-between',
      borderRadius: '20px',
      background: 'linear-gradient(135deg, #ffffff 0%, #f4f6f8 100%)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
      border: '1px solid rgba(0,0,0,0.02)',
      p: 0,
      overflow: 'hidden',
      height: '100%',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 28px rgba(10, 41, 71, 0.08)',
        borderColor: 'rgba(10, 41, 71, 0.1)',
      }
    }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', height: '100%', p: { xs: 1.5, sm: 2 } }}>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 900, color: '#0A2947', mb: 0.5, fontSize: '1.2rem', lineHeight: 1.3 }}>
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
                        minWidth: { xs: 28, sm: 32 },
                        height: { xs: 28, sm: 32 },
                        px: { xs: 0.5, sm: 1 },
                        borderRadius: { xs: '14px', sm: '16px' },
                        fontSize: { xs: '0.75rem', sm: '0.8rem' },
                        fontWeight: isSelected ? 800 : 700,
                        bgcolor: isSelected ? '#0A2947' : 'transparent',
                        color: isSelected ? '#fff' : '#0A2947',
                        border: isSelected ? '1px solid #0A2947' : '1px solid rgba(10, 41, 71, 0.2)',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'scale(1.08)',
                          bgcolor: isSelected ? '#0A2947' : 'rgba(10, 41, 71, 0.04)',
                        }
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
                  fontWeight: 900, 
                  color: '#C49A45', // Gold Accent
                  fontSize: { xs: '1.05rem', sm: '1.25rem' },
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
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#C49A45', fontSize: { xs: '1.05rem', sm: '1.25rem' } }}>
              {displayPrice} <Typography component="span" variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, ml: 0.5 }}>ج.م</Typography>
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
              السعر غير متاح
            </Typography>
          )}
        </Box>
      </Box>

      {image?.url && (
        <Box sx={{ 
          width: { xs: '35%', sm: '33.33%' }, 
          flexShrink: 0, 
          background: '#ffffff',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          '& img': {
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          },
          '&:hover img': {
            transform: 'scale(1.08)'
          }
        }}>
          <Image 
            src={image.url} 
            alt={name} 
            fill
            sizes="(max-width: 600px) 35vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
        </Box>
      )}
    </Card>
  );
}
