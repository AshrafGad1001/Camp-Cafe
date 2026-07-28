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
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      borderRadius: 4,
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      border: 'none',
    }}>
      {image?.url && (
        <Box sx={{ p: 1.5, pb: 0 }}>
          <CardMedia 
            component="img" 
            height="220" 
            image={image.url} 
            alt={name} 
            sx={{ borderRadius: 3 }}
          />
        </Box>
      )}
      <CardContent sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ flexGrow: 1, textAlign: 'right' }}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 800, color: '#1E3A5F', mb: 0.5, fontSize: '1.1rem' }}>
            {name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
            {description || 'وصف لذيذ لهذا العنصر'}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2, pl: 2, borderLeft: '2px solid #C49A45' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E3A5F', lineHeight: 1 }}>
              {price}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              ج.م
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
