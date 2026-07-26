import React from 'react';
import CategorySection from '@/components/public/CategorySection';

interface MenuCategory {
  _id: string;
  name: string;
  image: { url: string; publicId: string };
  displayOrder: number;
  items: Array<{
    _id: string;
    name: string;
    description: string;
    price: number;
    image: { url: string; publicId: string };
  }>;
}

async function getMenu(): Promise<MenuCategory[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  try {
    const res = await fetch(`${apiUrl}/menu`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Failed to fetch menu:', error);
    return [];
  }
}

export default async function MenuPage() {
  const menu = await getMenu();

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', width: '100%' }}>
      <header style={{ textAlign: 'center', padding: '60px 20px 40px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '-1px', margin: 0 }}>
          Camp Cafe
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '1.125rem' }}>
          Explore our delicious menu
        </p>
      </header>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px 60px' }}>
        {menu.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0' }}>
            <p>Our menu is currently being updated. Please check back later.</p>
          </div>
        ) : (
          menu.map(category => (
            <CategorySection
              key={category._id}
              name={category.name}
              image={category.image}
              items={category.items}
            />
          ))
        )}
      </main>

      <footer style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        © 2024 Camp Cafe. All rights reserved.
      </footer>
    </div>
  );
}
