'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Typography, Avatar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LogoutIcon from '@mui/icons-material/Logout';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('campcafe_token');
    router.push('/admin/login');
  };

  const navLinks = [
    { href: '/admin/dashboard', icon: <DashboardIcon />, label: 'لوحة التحكم' },
    { href: '/admin/dashboard/categories', icon: <FolderIcon />, label: 'التصنيفات' },
    { href: '/admin/dashboard/items', icon: <SportsEsportsIcon />, label: 'عناصر القائمة' }, // Updated to Esports for Cafe/PS vibe
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': { 
          width: 280, 
          boxSizing: 'border-box', 
          backgroundColor: '#FFFFFF', 
          borderLeft: 'none',
          borderRight: '1px solid rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column'
        },
      }}
    >
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', mb: 1 }}>
        <img src="/logo.png" alt="Camp Cafe Logo" style={{ maxWidth: '100%', height: 'auto', maxHeight: '50px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.05))' }} />
      </Box>

      <List sx={{ px: 3 }}>
        {navLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <ListItem key={link.href} disablePadding sx={{ mb: 1.5 }}>
              <ListItemButton 
                component={Link} 
                href={link.href} 
                sx={{
                  borderRadius: 3,
                  py: 1.5,
                  backgroundColor: active ? 'primary.main' : 'transparent',
                  color: active ? '#fff' : 'text.secondary',
                  boxShadow: active ? '0 8px 20px rgba(44, 30, 22, 0.15)' : 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: active ? 'primary.main' : 'rgba(0, 0, 0, 0.03)',
                    color: active ? '#fff' : 'primary.main',
                    transform: active ? 'translateY(0)' : 'translateY(-2px)'
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 44, 
                  color: 'inherit',
                  transition: 'all 0.2s ease',
                }}>
                  {link.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography 
                      sx={{ 
                        fontWeight: active ? 700 : 600,
                        fontSize: '1rem',
                        letterSpacing: '0.2px'
                      }}
                    >
                      {link.label}
                    </Typography>
                  } 
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
      
      <Box sx={{ flexGrow: 1 }} />
      
      <Box sx={{ p: 2, mx: 3, mb: 2, bgcolor: 'background.default', borderRadius: 4, border: '1px solid', borderColor: 'rgba(0,0,0,0.03)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            src="/Admin-img.jpg" 
            sx={{ 
              bgcolor: 'secondary.main', 
              color: '#fff',
              width: 44, 
              height: 44, 
              fontWeight: 800,
              boxShadow: '0 4px 12px rgba(217, 119, 6, 0.2)'
            }}
          >
            K
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
              KareemTahon
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              إدارة النظام
            </Typography>
          </Box>
        </Box>
      </Box>

      <List sx={{ px: 3, pb: 4 }}>
        <ListItem disablePadding>
          <ListItemButton 
            onClick={handleLogout}
            sx={{
              borderRadius: 3,
              py: 1.5,
              color: 'error.main',
              '&:hover': { 
                backgroundColor: 'error.light',
                color: '#fff',
                '& .MuiListItemIcon-root': { color: '#fff' }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 44, color: 'inherit' }}><LogoutIcon /></ListItemIcon>
            <ListItemText primary={<Typography sx={{ fontWeight: 700 }}>تسجيل الخروج</Typography>} />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}
