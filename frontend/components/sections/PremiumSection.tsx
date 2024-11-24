'use client';

export default function PremiumSection() {
  return (
    <div className="mt-16 mb-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold mb-2 text-white">QR Decode Premium Features</h2>
          <p className="text-gray-300 mb-6">
            Thank you for your interest in our premium features!
          </p>
        </div>

        <div className="bg-black shadow-lg rounded-lg overflow-hidden border border-gray-800">
          <div className="p-8">
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Open Source vs Commercial Version
                </h3>
                <p className="text-gray-300 mb-6">
                  This is the open-source version of QR Decode, available for free on GitHub. 
                  The commercial version includes additional premium features and enterprise support.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-black border border-gray-800 p-6 rounded-lg hover:bg-yellow-50 transition-colors group">
                  <h3 className="text-lg font-semibold text-white mb-4 group-hover:text-black">
                    Open Source Features (Current)
                  </h3>
                  <ul className="space-y-3 text-gray-300 group-hover:text-black">
                    <li className="flex items-center">
                      <span className="text-blue-500 mr-2">•</span>
                      QR code scanning via webcam
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-500 mr-2">•</span>
                      File upload scanning
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-500 mr-2">•</span>
                      Basic rate limiting (5 scans/day)
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-500 mr-2">•</span>
                      Social media sharing
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-500 mr-2">•</span>
                      Basic user authentication
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-500 mr-2">•</span>
                      Docker deployment support
                    </li>
                  </ul>
                </div>

                <div className="bg-black border border-gray-800 p-6 rounded-lg hover:bg-yellow-50 transition-colors group">
                  <h3 className="text-lg font-semibold text-white mb-4 group-hover:text-black">
                    Premium Features
                  </h3>
                  <ul className="space-y-3 text-gray-300 group-hover:text-black">
                    <li className="flex items-center">
                      <span className="text-blue-500 mr-2">•</span>
                      Unlimited QR code scans
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-500 mr-2">•</span>
                      Bulk QR code processing
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-500 mr-2">•</span>
                      Ads Free
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-500 mr-2">•</span>
                      Business API access
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-500 mr-2">•</span>
                      Premium support
                    </li>
                  
                  </ul>
                </div>
              </div>

              <div className="mt-8 border-t border-gray-800 pt-8">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Interested in Premium Features?
                </h3>
                <p className="text-gray-300 mb-6">
                  The commercial version is available with premium features and enterprise support. 
                  For inquiries about pricing and enterprise licenses, please contact us.
                </p>
                <div className="space-y-4">
                  <div className="bg-black border border-gray-800 p-4 rounded-lg hover:bg-yellow-50 transition-colors group">
                    <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-black">Contact</h4>
                    <a 
                      href="mailto:msdevsec.services@gmail.com" 
                      className="text-gray-300 hover:text-black hover:underline flex items-center gap-2 group-hover:text-black"
                    >
                      <span>📧</span>
                      msdevsec.services@gmail.com
                    </a>
                  </div>
                  <div className="bg-black border border-gray-800 p-4 rounded-lg hover:bg-yellow-50 transition-colors group">
                    <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-black">GitHub Repository</h4>
                    <a 
                      href="https://github.com/msdevsec/qr-decode-app" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-300 hover:text-black hover:underline flex items-center gap-2 group-hover:text-black"
                    >
                      <span>📦</span>
                      github.com/msdevsec/qr-decode-app
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
