import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import ConvexClientProvider from '@/components/ConvexClientProvider';

export const metadata: Metadata = {
  title: 'HealthBridge AI — Understand your health. Act with confidence.',
  description:
    'A unified healthcare assistance platform that helps users understand symptoms and medical documents, manage medications and health records, locate nearby healthcare services, and access emergency assistance.',
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
      <body className="bg-background text-foreground antialiased selection:bg-teal-500 selection:text-white">
        <ConvexClientProvider>
          <AppProvider>{children}</AppProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
