import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
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
      <Typography variant="h4" component="h2" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
        {name}
      </Typography>
      {image?.url && (
        <Box 
          component="img" 
          src={image.url} 
          alt={name}
          sx={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 2, mb: 3 }} 
        />
      )}
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
