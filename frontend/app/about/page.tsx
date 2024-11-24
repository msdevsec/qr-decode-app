'use client';

import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import AboutSection from '../../components/sections/AboutSection';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="container mx-auto px-4">
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}
