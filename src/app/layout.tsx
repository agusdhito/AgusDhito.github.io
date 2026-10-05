import type { Metadata } from "next";
import "./globals.css";
import ResponsiveAppBar from "@/app/ui/NavBar";
import { Footer } from "@/app/ui/Footer";
import siteContent from '@/app/data/site-content.json';

export const metadata: Metadata = {
  title: `${siteContent.profile.name} | Engineering & Technical Leadership`,
  description: siteContent.profile.summary,
  metadataBase: new URL(siteContent.profile.contact.portfolioUrl),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ResponsiveAppBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
