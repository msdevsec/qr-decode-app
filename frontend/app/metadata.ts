import { Metadata } from 'next';

const keywords = [
  // Core Features
  'qr code scanner',
  'qr code reader',
  'online qr scanner',
  'free qr scanner',
  'qr code decoder',
  'decode qr code',
  
  // Methods
  'webcam qr scanner',
  'camera qr code',
  'upload qr code',
  'screenshot qr scan',
  'bulk qr scanning',
  'batch qr processing',
  
  // Platforms
  'web qr scanner',
  'browser qr scanner',
  'desktop qr scanner',
  'mobile qr scanner',
  'no app qr scanner',
  
  // QR Types
  'wifi qr code',
  'url qr code',
  'text qr code',
  'vcard qr code',
  'contact qr code',
  'email qr code',
  'sms qr code',
  'phone qr code',
  
  // Technology
  'ai qr scanner',
  'artificial intelligence',
  'machine learning',
  'zxing library',
  'real-time scanning',
  
  // Features
  'instant qr scan',
  'no installation',
  'no download',
  'secure qr scanner',
  'privacy focused',
  'share qr results',
  'history tracking',
  
  // Use Cases
  'business qr codes',
  'marketing qr codes',
  'social media qr',
  'document qr codes',
  'product qr codes'
].join(', ');

export const metadata: Metadata = {
  title: 'QRDecode.AI - Free Online QR Code Scanner with AI',
  description: 'Free online QR code scanner powered by AI. Scan QR codes from webcam, screenshots, or bulk uploads. No app installation required. Supports WiFi, URLs, text, contacts, and more.',
  keywords,
  
  metadataBase: new URL('https://qrdecode.ai'),
  
  openGraph: {
    title: 'QRDecode.AI - Smart QR Code Scanner',
    description: 'Free online QR code scanner with AI. Scan from webcam, upload images, or process in bulk. No app needed.',
    type: 'website',
    locale: 'en_US',
    images: [{
      url: '/images/og-image.png',
      width: 1200,
      height: 630,
      alt: 'QRDecode.AI Interface'
    }]
  },

  twitter: {
    card: 'summary_large_image',
    title: 'QRDecode.AI - Smart QR Code Scanner',
    description: 'Free online QR code scanner with AI. No app needed.',
    images: ['/images/og-image.png']
  },

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

  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },

  themeColor: '#000000',

  manifest: '/manifest.json',

  icons: {
    icon: '/images/favicon.ico',
    apple: '/images/apple-icon.png'
  },

  // Can be added later for commercial version
  // verification: {
  //   google: 'your-google-verification-code',
  //   yandex: 'your-yandex-verification-code',
  //   bing: 'your-bing-verification-code'
  // },

  alternates: {
    canonical: 'https://qrdecode.ai',
  },

  category: 'technology'
};
