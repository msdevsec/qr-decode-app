'use client';

export default function AboutSection() {
  return (
    <div className="mt-16 mb-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold mb-2 text-white">About QR Decode</h2>
          <p className="text-gray-300 mb-6">
            Free Online QR Code Scanner - No App Required
          </p>
        </div>

        <div className="bg-black shadow-lg rounded-lg overflow-hidden border border-gray-800">
          <div className="p-8">
            <div className="space-y-8">
              {/* Main Description */}
              <div className="text-gray-300 space-y-4">
                <p>
                  The Free QR Code Scanner online allows you to scan QR codes without any app. 
                  It helps you scan QR from images and also webcam. You can use it online on mobile and desktop also.
                </p>
              </div>

              {/* How It Works */}
              <div className="bg-black border border-gray-800 p-6 rounded-lg hover:bg-yellow-50 transition-colors group">
                <h3 className="text-xl font-semibold text-white mb-6 group-hover:text-black">
                  How It Works
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📱</div>
                    <p className="text-gray-300 group-hover:text-black">
                      Stuck with QR code while scrolling on social medias with your phone?
                      Cannot scan QR codes with your phone? We have made it super easy!
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-4">📸</div>
                    <p className="text-gray-300 group-hover:text-black">
                      Take a quick screenshot of the QR code or use your webcam to scan directly
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-4">🎯</div>
                    <p className="text-gray-300 group-hover:text-black">
                      Get instant access to QR code content!
                    </p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-black border border-gray-800 p-6 rounded-lg hover:bg-yellow-50 transition-colors group">
                <h3 className="text-xl font-semibold text-white mb-6 group-hover:text-black">
                  Key Features
                </h3>
                <ul className="grid md:grid-cols-2 gap-4">
                  <li className="flex items-center text-gray-300 group-hover:text-black">
                    <span className="text-blue-500 mr-2">•</span>
                    No app installation required
                  </li>
                  <li className="flex items-center text-gray-300 group-hover:text-black">
                    <span className="text-blue-500 mr-2">•</span>
                    Works on both mobile and desktop
                  </li>
                  <li className="flex items-center text-gray-300 group-hover:text-black">
                    <span className="text-blue-500 mr-2">•</span>
                    Webcam scanning support
                  </li>
                  <li className="flex items-center text-gray-300 group-hover:text-black">
                    <span className="text-blue-500 mr-2">•</span>
                    Image upload scanning
                  </li>
                  <li className="flex items-center text-gray-300 group-hover:text-black">
                    <span className="text-blue-500 mr-2">•</span>
                    Instant results
                  </li>
                  <li className="flex items-center text-gray-300 group-hover:text-black">
                    <span className="text-blue-500 mr-2">•</span>
                    Free to use
                  </li>
                </ul>
              </div>

              {/* Open Source */}
              <div className="bg-black border border-gray-800 p-6 rounded-lg hover:bg-yellow-50 transition-colors group">
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-black">
                  Open Source Project
                </h3>
                <p className="text-gray-300 mb-4 group-hover:text-black">
                  This project is open source and available on GitHub. Feel free to contribute or use it in your own projects!
                </p>
                <a 
                  href="https://github.com/msdevsec/qr-decode-app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline flex items-center gap-2 group-hover:text-blue-700"
                >
                  <span>📦</span>
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
