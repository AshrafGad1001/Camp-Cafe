'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export default function QRCodeGenerator() {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [menuUrl, setMenuUrl] = useState('');

  useEffect(() => {
    // Generate the URL for the menu based on current origin
    const url = `${window.location.origin}/menu`;
    setMenuUrl(url);

    // Generate the QR code
    QRCode.toDataURL(url, {
      width: 250,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })
      .then(url => {
        setQrCodeDataUrl(url);
      })
      .catch(err => {
        console.error('Error generating QR code', err);
      });
  }, []);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '100%' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '16px' }}>
        Menu QR Code
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>
        Customers can scan this QR code to view the menu on their devices.
      </p>
      
      {qrCodeDataUrl ? (
        <div style={{ background: '#fff', padding: '10px', borderRadius: '8px', marginBottom: '20px', boxShadow: 'var(--shadow-sm)' }}>
          <img src={qrCodeDataUrl} alt="Menu QR Code" style={{ width: '200px', height: '200px' }} />
        </div>
      ) : (
        <div style={{ width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-glass)', borderRadius: '8px', marginBottom: '20px' }}>
          <div className="spinner" />
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: 'auto' }}>
        <a 
          href={qrCodeDataUrl} 
          download="camp-cafe-qr.png"
          className="btn btn-primary"
        >
          📥 Download
        </a>
        <a 
          href={menuUrl}
          target="_blank"
          rel="noopener noreferrer" 
          className="btn btn-ghost"
        >
          🔗 View Menu
        </a>
      </div>
    </div>
  );
}
