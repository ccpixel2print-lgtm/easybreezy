import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import WhatsAppButton from '@/components/WhatsAppButton';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Easy Breezy Service Provider | One App, All Services, Total Peace of Mind',
  description:
    'Easy Breezy Service Provider brings trusted, verified home-service professionals to your doorstep across India — plumbers, electricians, maids, deep cleaning and more. One app, all services, total peace of mind.',
  keywords: [
    'home services India',
    'plumber',
    'electrician',
    'maid service',
    'deep cleaning',
    'apartment maintenance',
    'housekeeping',
    'security services',
    'Easy Breezy',
  ],
  icons: {
    icon: '/images/eb-logo.webp',
  },
  openGraph: {
    title: 'Easy Breezy Service Provider',
    description: 'Trusted, verified home service professionals at your doorstep.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans antialiased">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
