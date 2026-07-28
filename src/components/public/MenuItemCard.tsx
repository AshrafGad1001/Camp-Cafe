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
      alignItems: 'stretch',
      borderRadius: 4,
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      border: 'none',
      p: 1.5,
      height: '100%'
    }}>
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', pr: 1, textAlign: 'right' }}>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 800, color: '#1E3A5F', mb: 0.5, fontSize: '1rem', lineHeight: 1.3 }}>
          {name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem', mb: 1, flexGrow: 1 }}>
          {description || 'وصف لذيذ لهذا العنصر'}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E3A5F', fontSize: '1.1rem' }}>
          {price} <Typography component="span" variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, ml: 0.5 }}>ج.م</Typography>
        </Typography>
      </Box>

      {image?.url && (
        <Box sx={{ width: 110, height: 110, flexShrink: 0, ml: 2 }}>
          <CardMedia 
            component="img" 
            image={image.url} 
            alt={name} 
            sx={{ borderRadius: 3, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
      )}
    </Card>
  );
}
