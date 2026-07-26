'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('campcafe_token');
    router.push('/admin/login');
  };

  const navLinks = [
    { href: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { href: '/admin/dashboard/categories', icon: '📁', label: 'Categories' },
    { href: '/admin/dashboard/items', icon: '🍽️', label: 'Menu Items' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Camp Cafe</div>
      <nav className="sidebar-nav">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`sidebar-link ${pathname === link.href ? 'active' : ''}`}
          >
            <span className="icon">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
      <div style={{ marginTop: 'auto', padding: '1rem' }}>
        <button onClick={handleLogout} className="btn-icon" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}
