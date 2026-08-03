import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const viewport: Viewport = {
  themeColor: '#070B14',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://healthaibridge.vercel.app'),
  title: {
    default: 'HealthBridge AI — Unified Patient Triage & Health Intelligence SaaS',
    template: '%s | HealthBridge AI',
  },
  description:
    'Patient-first clinical intelligence platform. Evaluate symptoms with bounded triage, translate lab reports with OCR, digitize prescriptions, and discover nearby 24/7 care.',
  keywords: [
    'healthcare AI',
    'symptom checker',
    'medical report analyzer',
    'OCR lab document parser',
    'prescription scanner',
    'emergency SOS',
    'telemedicine assistant',
    'patient health records',
  ],
  authors: [{ name: 'HealthBridge Engineering' }],
  creator: 'HealthBridge AI Platform',
  publisher: 'HealthBridge AI',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://healthaibridge.vercel.app',
    title: 'HealthBridge AI — Understand your health. Act with confidence.',
    description:
      'Unified patient triage, lab document OCR, prescription digitization, and 24/7 emergency care discovery.',
    siteName: 'HealthBridge AI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'HealthBridge AI Platform Interface Overview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HealthBridge AI — Clinical Triage & Health Management',
    description:
      'Evaluate symptoms, analyze medical documents, track family medications, and discover 24/7 emergency care.',
    images: ['/og-image.png'],
    creator: '@healthbridge_ai',
  },
  alternates: {
    canonical: 'https://healthaibridge.vercel.app',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'HealthBridge AI',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description:
    'A patient-first healthcare SaaS platform providing AI-guided symptom triage, lab report parsing, prescription digitization, and emergency SOS services.',
  url: 'https://healthaibridge.vercel.app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-background text-foreground antialiased selection:bg-teal-500 selection:text-white">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
