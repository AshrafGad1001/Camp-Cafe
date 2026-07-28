'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Card, Typography, Button, CircularProgress, Box } from '@mui/material';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';

export default function QRCodeGenerator() {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [menuUrl, setMenuUrl] = useState('');

  useEffect(() => {
    const url = `${window.location.origin}/menu`;
    setMenuUrl(url);

    QRCode.toDataURL(url, {
      width: 250,
      margin: 1,
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
    <Card sx={{ 
      p: 4, 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      bgcolor: '#fff', 
      borderRadius: 4,
      boxShadow: '0 4px 20px rgba(15, 48, 64, 0.04)'
    }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        باركود المنيو <QrCode2Icon fontSize="small" sx={{ color: 'text.secondary' }}/>
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
        يمكن للعملاء مسح الباركود لعرض المنيو على أجهزتهم.
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
        {qrCodeDataUrl ? (
          <Box sx={{ background: '#fff', p: 1, borderRadius: 4, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <img src={qrCodeDataUrl} alt="Menu QR Code" style={{ width: '180px', height: '180px', display: 'block', borderRadius: '12px' }} />
          </Box>
        ) : (
          <Box sx={{ width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <CircularProgress />
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 'auto' }}>
        <Button 
          component="a"
          href={menuUrl}
          target="_blank"
          rel="noopener noreferrer" 
          variant="outlined"
          startIcon={<VisibilityIcon />}
          sx={{ borderRadius: 2, fontWeight: 600, color: 'primary.main', borderColor: '#d0d0d0', px: 3 }}
        >
          عرض المنيو
        </Button>
        <Button 
          component="a"
          href={qrCodeDataUrl} 
          download="camp-cafe-qr.png"
          variant="contained" 
          color="primary"
          startIcon={<DownloadIcon />}
          sx={{ borderRadius: 2, fontWeight: 600, px: 3 }}
        >
          تحميل
        </Button>
      </Box>
    </Card>
  );
}
