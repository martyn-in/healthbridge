import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'HealthBridge — Award-Winning Medical AI Platform',
  description:
    'HealthBridge is a next-generation medical AI platform with real-time biometric telemetry, 3D anatomical visualization, and clinical-grade diagnostics. Monitor heart rate, SpO₂, blood pressure, and more.',
  keywords: ['medical AI', 'health dashboard', 'biometric monitoring', 'clinical AI', 'heart health'],
  authors: [{ name: 'HealthBridge Medical AI' }],
  openGraph: {
    title: 'HealthBridge — Award-Winning Medical AI Platform',
    description: 'Real-time biometric telemetry, 3D anatomical visualization, and clinical-grade diagnostics.',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="antialiased min-h-screen relative"
        style={{
          background: '#F3F5F8',
          color: '#0D1B2A',
          fontFamily: "'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
