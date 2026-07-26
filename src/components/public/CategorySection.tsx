import React from 'react';
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
    <section style={{ marginBottom: '40px' }}>
      <h2 style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '1.5rem', marginBottom: '16px' }}>
        {name}
      </h2>
      {image && (
        <img 
          src={image.url} 
          alt={name} 
          style={{ 
            maxHeight: '200px', 
            width: '100%', 
            objectFit: 'cover', 
            borderRadius: 'var(--radius-lg)', 
            marginBottom: '20px' 
          }} 
        />
      )}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '16px' 
      }}>
        {items.map(item => (
          <MenuItemCard 
            key={item._id}
            name={item.name}
            description={item.description}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>
    </section>
  );
}
