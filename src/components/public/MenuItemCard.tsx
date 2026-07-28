import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';

interface MenuItemCardProps {
  name: string;
  description: string;
  price: number;
  image?: { url: string; publicId: string };
}

export default function MenuItemCard({ name, description, price, image }: MenuItemCardProps) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {image?.url && (
        <CardMedia component="img" height="180" image={image.url} alt={name} />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mt: 2, fontWeight: 'bold' }}>
          ${price.toFixed(2)}
        </Typography>
      </CardContent>
    </Card>
  );
}
