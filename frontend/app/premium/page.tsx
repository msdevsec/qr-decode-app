'use client';

import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import PremiumSection from '../../components/sections/PremiumSection';

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="container mx-auto px-4">
        <PremiumSection />
      </main>
      <Footer />
    </div>
  );
}
