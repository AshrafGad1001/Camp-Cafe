'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Typography, Avatar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LogoutIcon from '@mui/icons-material/Logout';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';

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
    { href: '/admin/dashboard/items', icon: <RestaurantMenuIcon />, label: 'عناصر القائمة' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 260,
        flexShrink: 0,
        '& .MuiDrawer-paper': { 
          width: 260, 
          boxSizing: 'border-box', 
          backgroundColor: '#EBEDE3', 
          borderLeft: 'none',
          borderRight: '1px solid rgba(15, 48, 64, 0.08)',
          display: 'flex',
          flexDirection: 'column'
        },
      }}
    >
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <LocalCafeIcon sx={{ color: 'success.main', fontSize: 32 }} />
        <Typography variant="h6" component="div" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: 1 }}>
          CAMP CAFE
        </Typography>
      </Box>
      <List sx={{ px: 2 }}>
        {navLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <ListItem key={link.href} disablePadding sx={{ mb: 1 }}>
              <ListItemButton 
                component={Link} 
                href={link.href} 
                sx={{
                  borderRadius: 2,
                  backgroundColor: active ? '#D3D4C0' : 'transparent',
                  '&:hover': {
                    backgroundColor: active ? '#D3D4C0' : 'rgba(211, 212, 192, 0.4)'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: active ? 'primary.main' : 'text.secondary' }}>
                  {link.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography 
                      sx={{ 
                        fontWeight: active ? 700 : 500,
                        color: active ? 'primary.main' : 'text.primary'
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
      
      <Box sx={{ p: 2, mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1 }}>
          <Avatar sx={{ bgcolor: '#D3D4C0', color: 'primary.main', width: 40, height: 40, fontWeight: 'bold' }}>A</Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>Admin</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Administrator</Typography>
          </Box>
        </Box>
      </Box>

      <List sx={{ px: 2, pb: 3 }}>
        <ListItem disablePadding>
          <ListItemButton 
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              '&:hover': { backgroundColor: 'rgba(211, 212, 192, 0.4)' }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}><LogoutIcon /></ListItemIcon>
            <ListItemText primary={<Typography sx={{ fontWeight: 500 }}>تسجيل الخروج</Typography>} />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}
