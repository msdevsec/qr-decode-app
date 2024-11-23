'use client';
import Image from 'next/image';

export default function Header() {
  return (
    <nav className="border-b border-gray-200 py-4 mb-8">
      <div className="flex justify-between items-center max-w-6xl mx-auto px-4">
        {/* Logo and Brand Name */}
        <div className="flex items-center space-x-2">
          <Image
            src="/images/logo.png"
            alt="QRDECODE.AI Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="text-xl font-bold">QRDECODE.AI</span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-8">
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
            QR Scanner
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors font-semibold">
            Premium
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
            About Us
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors ">
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}