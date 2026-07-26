import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
