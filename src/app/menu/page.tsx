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
import MenuNavbar from '@/components/public/MenuNavbar';
import Footer from '@/components/public/Footer';

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

async function getMenu(): Promise<{ data: MenuCategory[], error: string | null }> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  try {
    const res = await fetch(`${apiUrl}/menu`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return { data: [], error: 'حدث خطأ أثناء تحميل المنيو. يرجى المحاولة مرة أخرى.' };
    const json = await res.json();
    return { data: json.data || [], error: null };
  } catch (error) {
    console.error('Failed to fetch menu:', error);
    return { data: [], error: 'يبدو أن هناك مشكلة في الاتصال بالخادم. يرجى التأكد من اتصالك بالإنترنت والمحاولة لاحقاً.' };
  }
}

export default async function MenuPage() {
  const { data: menu, error } = await getMenu();
  const bestSellers = menu.flatMap(cat => cat.items.filter(item => item.isBestSeller));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      {/* Master Sticky Header */}
      <Box sx={{ position: 'sticky', top: 0, zIndex: 1100, bgcolor: 'background.default', width: '100%' }}>
        <MenuNavbar />
        <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 2 } }}>
          {menu.length > 0 && !error && (
            <MenuStickyTabs menu={menu} />
          )}
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pt: 1, pb: 2, px: { xs: 1, sm: 2, md: 2 }, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {error ? (
          <Box sx={{ my: 10, textAlign: 'center', p: 4, bgcolor: 'rgba(211, 47, 47, 0.05)', borderRadius: '24px', border: '1px solid rgba(211, 47, 47, 0.1)' }}>
            <Typography variant="h6" color="error" sx={{ fontWeight: 800, mb: 2 }}>
              {error}
            </Typography>
            <IconButton component="a" href="/menu" sx={{ bgcolor: 'error.main', color: '#fff', '&:hover': { bgcolor: 'error.dark' }, p: 1.5 }}>
              <Typography sx={{ fontWeight: 700, px: 2 }}>إعادة المحاولة</Typography>
            </IconButton>
          </Box>
        ) : menu.length === 0 ? (
          <Box sx={{ my: 10, textAlign: 'center', p: 4 }}>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 800 }}>
              لا يوجد عناصر في المنيو حالياً.
            </Typography>
          </Box>
        ) : (
          <>
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
          </>
        )}

        <Footer />
      </Container>
    </Box>
  );
}
