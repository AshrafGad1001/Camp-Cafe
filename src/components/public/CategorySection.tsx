import React from 'react';
import { Box, Typography, Grid, Avatar } from '@mui/material';
import MenuItemCard from './MenuItemCard';

interface CategorySectionProps {
  id: string;
  name: string;
  image?: { url: string; publicId: string };
  items: Array<{
    _id: string;
    name: string;
    description: string;
    price: number | null;
    hasSizes?: boolean;
    sizes?: { name: string; price: number }[];
    image?: { url: string; publicId: string };
  }>;
}

export default function CategorySection({ id, name, image, items }: CategorySectionProps) {
  return (
    <Box id={id} className="scrollspy-section" sx={{ mb: 6, pt: 4, mt: -4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 4, mt: 2 }}>
        <Box sx={{ borderLeft: '3px solid #C49A45', pl: 2 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 800, color: '#0A2947', m: 0 }}>
            {name}
          </Typography>
        </Box>
      </Box>
      <Grid container spacing={3}>
        {items.map(item => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item._id}>
            <MenuItemCard 
              name={item.name}
              description={item.description}
              price={item.price}
              hasSizes={item.hasSizes}
              sizes={item.sizes}
              image={item.image}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
