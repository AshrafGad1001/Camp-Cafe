import type { Metadata } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import ThemeRegistry from '@/theme/ThemeRegistry';
import { Cairo } from 'next/font/google';

const cairo = Cairo({ subsets: ['latin', 'arabic'] });

export const metadata: Metadata = {
  title: "Camp Cafe | Restaurant Menu",
  description: "Browse our delicious menu at Camp Cafe. Fresh ingredients, amazing flavors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={cairo.className} style={{ margin: 0, padding: 0 }}>
        <AppRouterCacheProvider options={{ key: 'mui' }}>
          <ThemeRegistry>
            {children}
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
