import React from 'react';
import { Box, Container, Typography, AppBar, Toolbar, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LanguageIcon from '@mui/icons-material/Language';
import EmailIcon from '@mui/icons-material/Email';
import MenuStickyTabs from '@/components/public/MenuStickyTabs';
import CategorySection from '@/components/public/CategorySection';
import BestSellersRow from '@/components/public/BestSellersRow';

interface MenuCategory {
  _id: string;
  name: string;
  image: { url: string; publicId: string };
  displayOrder: number;
  items: Array<{
    _id: string;
    name: string;
    description: string;
    price: number | null;
    hasSizes?: boolean;
    isBestSeller?: boolean;
    sizes?: { name: string; price: number }[];
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
  const bestSellers = menu.flatMap(cat => cat.items.filter(item => item.isBestSeller));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: { xs: 1, sm: 2, md: 2 }, pt: { xs: 2, md: 1.5 }, pb: 0, position: 'sticky', top: 0, zIndex: 1100, width: '100%', pointerEvents: 'none' }}>
        <AppBar position="static" sx={{ 
          bgcolor: 'rgba(10, 41, 71, 0.95)', 
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: '0 8px 32px rgba(10, 41, 71, 0.25)', 
          borderRadius: '20px', 
          width: '100%',
          maxWidth: '1200px',
          mx: 'auto',
          pointerEvents: 'auto',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <Toolbar sx={{ justifyContent: 'center', py: 0.5, minHeight: '52px !important' }}>
            <Box component="img" src="/logo.png" alt="Camp Cafe" sx={{ height: 38, filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))' }} />
          </Toolbar>
        </AppBar>
      </Box>

      <Container maxWidth="lg" sx={{ pt: 1, pb: 2, px: { xs: 1, sm: 2, md: 2 }, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <MenuStickyTabs menu={menu} />
        
        {bestSellers.length > 0 && (
          <Box id="best-sellers-section" className="scrollspy-section" sx={{ pt: 2 }}>
            <BestSellersRow items={bestSellers} />
          </Box>
        )}

        <Box component="main">
          {menu.map(category => (
            <CategorySection
              key={category._id}
              id={`category-${category._id}`}
              name={category.name}
              image={category.image}
              items={category.items}
            />
          ))}
        </Box>

        <Box 
          component="footer" 
          sx={{ 
            mt: 'auto',
            mb: 2,
            px: { xs: 2, md: 4 }, 
            py: 3,
            bgcolor: 'rgba(10, 41, 71, 0.95)', 
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            boxShadow: '0 8px 32px rgba(10, 41, 71, 0.25)', 
            borderRadius: '20px', 
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Box sx={{ display: 'flex', gap: { xs: 2, sm: 3 } }}>
            <IconButton 
              component="a" 
              href="https://www.facebook.com/share/1Ebbei8Ysr/?mibextid=wwXIfr" 
              target="_blank" 
              sx={{ 
                color: '#1877F2', 
                bgcolor: '#fff',
                '&:hover': { bgcolor: '#f0f2f5', transform: 'scale(1.1)' }, 
                transition: 'all 0.2s',
                width: 48,
                height: 48,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <FacebookIcon fontSize="medium" />
            </IconButton>
            <IconButton 
              component="a" 
              href="https://www.instagram.com/camp11114?igsh=MTBmMWZpOG1oYWd2bA%3D%3D&utm_source=qr" 
              target="_blank" 
              sx={{ 
                color: '#E4405F', 
                bgcolor: '#fff',
                '&:hover': { bgcolor: '#fcf1f3', transform: 'scale(1.1)' }, 
                transition: 'all 0.2s',
                width: 48,
                height: 48,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <InstagramIcon fontSize="medium" />
            </IconButton>
            <IconButton 
              component="a" 
              href="https://wa.me/+201023321047" 
              target="_blank"
              sx={{ 
                color: '#25D366', 
                bgcolor: '#fff',
                '&:hover': { bgcolor: '#f0fcf4', transform: 'scale(1.1)' }, 
                transition: 'all 0.2s',
                width: 48,
                height: 48,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <WhatsAppIcon fontSize="medium" />
            </IconButton>
          </Box>
          <Typography variant="body2" dir="ltr" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500, textAlign: 'center' }}>
            © 2026 Camp Cafe. All rights reserved.
          </Typography>
        </Box>

        {/* Developer Section */}
        <Box sx={{ 
          mt: 0,
          mb: 2, 
          p: 2, 
          px: 4,
          mx: 'auto',
          bgcolor: '#fff', 
          borderRadius: '24px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: 1.5,
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.02)'
        }}>
          <Typography variant="caption" sx={{ color: '#0A2947', fontWeight: 900, fontSize: '0.9rem', letterSpacing: 0.5 }}>
            Developed By AshrafGad
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton 
              component="a" 
              href="https://my-portfolio-frontend-pied-six.vercel.app/" 
              target="_blank" 
              sx={{ 
                color: '#4285F4', 
                bgcolor: '#e8f0fe',
                '&:hover': { transform: 'scale(1.1)', bgcolor: '#d2e3fc' }, 
                transition: 'all 0.2s',
                width: 38,
                height: 38,
              }}
            >
              <LanguageIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <IconButton 
              component="a" 
              href="https://wa.me/+201553585239" 
              target="_blank" 
              sx={{ 
                color: '#25D366', 
                bgcolor: '#e6f4ea',
                '&:hover': { transform: 'scale(1.1)', bgcolor: '#ceead6' }, 
                transition: 'all 0.2s',
                width: 38,
                height: 38,
              }}
            >
              <WhatsAppIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <IconButton 
              component="a" 
              href="mailto:ashrafmohamedgad214@gmail.com" 
              target="_blank" 
              sx={{ 
                color: '#EA4335', 
                bgcolor: '#fce8e6',
                '&:hover': { transform: 'scale(1.1)', bgcolor: '#fad2cf' }, 
                transition: 'all 0.2s',
                width: 38,
                height: 38,
              }}
            >
              <EmailIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
