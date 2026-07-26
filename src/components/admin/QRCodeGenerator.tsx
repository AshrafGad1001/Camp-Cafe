'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Card, Typography, Button, CircularProgress, Box } from '@mui/material';

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
    <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '100%' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Menu QR Code
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        Customers can scan this QR code to view the menu on their devices.
      </Typography>
      
      {qrCodeDataUrl ? (
        <Box sx={{ background: '#fff', p: 1.25, borderRadius: 2, mb: 3, boxShadow: 1 }}>
          <img src={qrCodeDataUrl} alt="Menu QR Code" style={{ width: '200px', height: '200px' }} />
        </Box>
      ) : (
        <Box sx={{ width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, mb: 3 }}>
          <CircularProgress />
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center', mt: 'auto' }}>
        <Button 
          component="a"
          href={qrCodeDataUrl} 
          download="camp-cafe-qr.png"
          variant="contained" 
          color="primary"
        >
          📥 Download
        </Button>
        <Button 
          component="a"
          href={menuUrl}
          target="_blank"
          rel="noopener noreferrer" 
          variant="outlined"
        >
          🔗 View Menu
        </Button>
      </Box>
    </Card>
  );
}
