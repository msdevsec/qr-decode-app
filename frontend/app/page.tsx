  import Image from 'next/image';
  import Button from '../components/ui/Button';
  import Footer from '../components/layout/Footer';
  import Header from '../components/layout/Header';
  import Hero from '../components/sections/Hero';
  import UploadSection from '../components/sections/UploadSection';
  import WebcamSection from '../components/sections/WebcamSection';
  import QRTypesSection from '../components/sections/QRTypesSection';
  import FAQSection from '@/components/sections/FAQSection';




  export default function Home() {
    return (
      <main className="min-h-screen p-8 max-w-6xl mx-auto">
        <Hero />
        <UploadSection />
        <WebcamSection />
        <QRTypesSection />
        <FAQSection />
  </main>
  );
  }

