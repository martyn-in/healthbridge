import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { PwaInstallBanner } from '@/components/ui/PwaInstallBanner';

// ── TYPOGRAPHY ────────────────────────────────────────────────────────────────
// Single professional font family for the entire app.
// Manrope: modern, clean, highly readable — perfect for healthcare.
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const viewport: Viewport = {
  themeColor: '#2F3273',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'HealthBridge — Your Personal Medical AI Assistant',
  description:
    'HealthBridge is your personal medical AI assistant. Track medications, manage health records, get AI-powered guidance, and access emergency care — all in one place.',
  keywords: ['medical AI', 'health dashboard', 'medication tracker', 'health records', 'emergency SOS'],
  authors: [{ name: 'HealthBridge' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'HealthBridge',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={manrope.variable}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="antialiased min-h-screen relative font-sans">
        <AppProvider>
          {children}
          <PwaInstallBanner />
        </AppProvider>

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(reg) {
                    console.log('HealthBridge Service Worker registered:', reg.scope);
                  }).catch(function(err) {
                    console.warn('Service Worker registration failed:', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
