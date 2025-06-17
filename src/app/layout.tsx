import type { Metadata } from "next";
import "./globals.css";
import ResponsiveAppBar from "@/app/ui/NavBar";
import { Footer } from "@/app/ui/Footer";
import { Montserrat, Open_Sans } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600'],
  variable: '--font-opensans',
});

export const metadata: Metadata = {
  title: "Agustinus Ardhito",
  description: "Profile from a technology & music enthusiast.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable}`}>
      <body className="antialiased">
        <ResponsiveAppBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
