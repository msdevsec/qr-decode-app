'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <nav className="border-b border-gray-800 py-4 mb-8">
      <div className="flex justify-between items-center max-w-6xl mx-auto px-4">
        {/* Logo and Brand Name */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/images/logo.png"
            alt="QRDECODE.AI Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="text-xl font-bold text-white">QRDECODE.AI</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-gray-300 hover:text-white transition-colors">
            QR Scanner
          </Link>
          <Link href="/premium" className="text-gray-300 hover:text-white transition-colors">
            Premium
          </Link>
          <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
            About Us
          </Link>
          <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
            Contact
          </Link>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <div className="text-sm text-gray-400 bg-gray-900 p-2 rounded-lg text-center">
          This is Free Version created for GitHub Community, Premium features are not available. 
          To access Premium Commercial Version please contact me at msdevsec.services@gmail.com
        </div>
      </div>
    </nav>
  );
}
