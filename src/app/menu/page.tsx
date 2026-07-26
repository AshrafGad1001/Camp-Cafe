export default function MenuPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent)' }}>
          Camp Cafe
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          Menu coming soon...
        </p>
      </div>
    </div>
  );
}
