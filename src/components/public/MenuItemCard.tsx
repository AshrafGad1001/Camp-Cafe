import React from 'react';

interface MenuItemCardProps {
  name: string;
  description: string;
  price: number;
  image?: { url: string; publicId: string };
}

export default function MenuItemCard({ name, description, price, image }: MenuItemCardProps) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {image && (
        <img 
          src={image.url} 
          alt={name} 
          style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} 
        />
      )}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 style={{ fontWeight: 600, margin: '12px 0 4px', fontSize: '1.25rem' }}>{name}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.4, margin: '0 0 12px', flexGrow: 1 }}>
          {description}
        </p>
        <div style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '1.2rem', marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
          ${price.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
