'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Category, MenuItem } from '@/types';

export default function DashboardPage() {
  const [stats, setStats] = useState({ categories: 0, items: 0, available: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [catRes, itemRes] = await Promise.all([
          api.get('/categories'),
          api.get('/items'),
        ]);
        const categories: Category[] = catRes.data.data;
        const items: MenuItem[] = itemRes.data.data;
        setStats({
          categories: categories.length,
          items: items.length,
          available: items.filter((i) => i.isAvailable).length,
        });
      } catch {
        console.error('Failed to fetch stats');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner" />
      </div>
    );
  }

  const statCards = [
    { label: 'Categories', value: stats.categories, icon: '📁', color: 'var(--accent)' },
    { label: 'Menu Items', value: stats.items, icon: '🍽️', color: 'var(--success)' },
    { label: 'Available', value: stats.available, icon: '✅', color: '#a78bfa' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '32px',
      }}>
        {statCards.map((stat) => (
          <div className="card" key={stat.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{stat.icon}</div>
            <div style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: stat.color,
              marginBottom: '4px',
            }}>
              {stat.value}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px' }}>
          Quick Links
        </h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/admin/dashboard/categories" className="btn btn-ghost">
            📁 Manage Categories
          </a>
          <a href="/admin/dashboard/items" className="btn btn-ghost">
            🍽️ Manage Menu Items
          </a>
        </div>
      </div>
    </div>
  );
}
