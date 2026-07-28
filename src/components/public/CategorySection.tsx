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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h2" color="text.primary" sx={{ fontWeight: 800, m: 0 }}>
          {name}
        </Typography>
        {image?.url && (
          <Avatar 
            src={image.url} 
            alt={name}
            sx={{ width: 56, height: 56, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} 
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
