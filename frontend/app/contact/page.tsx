'use client';

import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import ContactSection from '../../components/sections/ContactSection';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="container mx-auto px-4">
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
