'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer 
      role="contentinfo" 
      aria-label="Site footer"
      className="border-t border-gray-800 mt-16 bg-black"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">About QRDecode.AI</h3>
            <p className="text-gray-400">
              An open-source QR code scanner with advanced features. Built with security and ease of use in mind.
            </p>
          </div>

          {/* Quick Links */}
          <nav className="space-y-4" aria-label="Footer navigation">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  QR Scanner
                </Link>
              </li>
              <li>
                <Link 
                  href="/premium" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Premium Features
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com/msdevsec/qr-decode-app" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>📦</span> GitHub Repository
                </a>
              </li>
            </ul>
          </nav>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <div className="space-y-2">
              <a 
                href="mailto:msdevsec.services@gmail.com" 
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <span>📧</span>
                msdevsec.services@gmail.com
              </a>
              <p className="text-gray-400">
                For business inquiries and premium features
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} QRDecode.AI. Open source version.
          </p>
        </div>
      </div>
    </footer>
  );
}
