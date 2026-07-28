import React from 'react';
import { Box, Typography, Grid, Avatar } from '@mui/material';
import MenuItemCard from './MenuItemCard';

interface CategorySectionProps {
  name: string;
  image?: { url: string; publicId: string };
  items: Array<{
    _id: string;
    name: string;
    description: string;
    price: number;
    image?: { url: string; publicId: string };
  }>;
}

export default function CategorySection({ name, image, items }: CategorySectionProps) {
  return (
    <Box sx={{ mb: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, mt: 2 }}>
        <Box sx={{ textAlign: 'right', borderRight: '3px solid #C49A45', pr: 2 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 800, color: '#1E3A5F', mb: 0.5 }}>
            {name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            لذة الأصالة في كل قطعة
          </Typography>
        </Box>
        {image?.url && (
          <Avatar 
            src={image.url} 
            alt={name}
            sx={{ width: 72, height: 72, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '4px solid #fff' }} 
          />
        )}
      </Box>
      <Grid container spacing={3}>
        {items.map(item => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item._id}>
            <MenuItemCard 
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
