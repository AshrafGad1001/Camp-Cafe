'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import { Box, CircularProgress, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('campcafe_token');
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [pathname, router]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Login page gets no sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!isAuthenticated) return null;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', zoom: { xs: 1, md: 0.85 } }}>
      {/* Mobile AppBar */}
      <Box 
        component="header" 
        sx={{ 
          display: { xs: 'grid', md: 'none' }, 
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          px: 2,
          py: 1.5,
          bgcolor: '#fff',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          position: 'sticky',
          top: 0,
          zIndex: 1100
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            sx={{ color: 'text.primary' }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <img src="/logo.png" alt="Logo" style={{ maxHeight: '26px' }} />
        </Box>
        <Box />
      </Box>

      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar mobileOpen={mobileOpen} onClose={handleDrawerToggle} />
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: { xs: 2, sm: 3, md: 4 }, 
            width: { md: `calc(100% - 280px)` } 
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
