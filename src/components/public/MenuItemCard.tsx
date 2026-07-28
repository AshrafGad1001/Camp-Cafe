import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';

interface MenuItemCardProps {
  name: string;
  description: string;
  price: number;
  image?: { url: string; publicId: string };
}

export default function MenuItemCard({ name, description, price, image }: MenuItemCardProps) {
  return (
    <Card sx={{ 
      display: 'flex', 
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      borderRadius: '16px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      border: '1px solid rgba(0,0,0,0.04)',
      p: 2,
      height: '100%',
      gap: 2
    }}>
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', textAlign: 'right', height: '100%' }}>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 800, color: '#1E3A5F', mb: 0.5, fontSize: '1.05rem', lineHeight: 1.3 }}>
          {name}
        </Typography>
        {description && (
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem', mb: 1, flexGrow: 1 }}>
            {description}
          </Typography>
        )}
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E3A5F', fontSize: '1.1rem', mt: 'auto' }}>
          {price} <Typography component="span" variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, ml: 0.5 }}>ج.م</Typography>
        </Typography>
      </Box>

      {image?.url && (
        <Box sx={{ width: 100, height: 100, flexShrink: 0, ml: 2 }}>
          <CardMedia 
            component="img" 
            image={image.url} 
            alt={name} 
            sx={{ borderRadius: '12px', width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
      )}
    </Card>
  );
}
