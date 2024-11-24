'use client';

export default function ContactSection() {
  return (
    <div className="mt-16 mb-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold mb-2 text-white">Contact Us</h2>
          <p className="text-gray-300 mb-6">
            Get in touch for any questions or business inquiries
          </p>
        </div>

        <div className="bg-black shadow-lg rounded-lg overflow-hidden border border-gray-800">
          <div className="p-8">
            <div className="space-y-8">
              {/* Main Contact Info */}
              <div className="bg-black border border-gray-800 p-6 rounded-lg hover:bg-yellow-50 transition-colors group">
                <h3 className="text-xl font-semibold text-white mb-6 group-hover:text-black">
                  Email Contact
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-300 group-hover:text-black">
                    For any inquiries about our services or the commercial version, please email us at:
                  </p>
                  <a 
                    href="mailto:msdevsec.services@gmail.com"
                    className="text-blue-500 text-lg hover:underline flex items-center gap-2 group-hover:text-blue-700"
                  >
                    <span>📧</span>
                    msdevsec.services@gmail.com
                  </a>
                </div>
              </div>

              {/* GitHub */}
              <div className="bg-black border border-gray-800 p-6 rounded-lg hover:bg-yellow-50 transition-colors group">
                <h3 className="text-xl font-semibold text-white mb-6 group-hover:text-black">
                  Open Source Repository
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-300 group-hover:text-black">
                    For technical questions, bug reports, or contributions, please visit our GitHub repository:
                  </p>
                  <a 
                    href="https://github.com/msdevsec/qr-decode-app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-lg hover:underline flex items-center gap-2 group-hover:text-blue-700"
                  >
                    <span>📦</span>
                    github.com/msdevsec/qr-decode-app
                  </a>
                </div>
              </div>

              {/* Commercial Version */}
              <div className="bg-black border border-gray-800 p-6 rounded-lg hover:bg-yellow-50 transition-colors group">
                <h3 className="text-xl font-semibold text-white mb-6 group-hover:text-black">
                  Commercial Version Inquiries
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-300 group-hover:text-black">
                    Interested in our commercial version with premium features? Contact us for:
                  </p>
                  <ul className="space-y-2">
                    <li className="text-gray-300 flex items-center group-hover:text-black">
                      <span className="text-blue-500 mr-2">•</span>
                      Custom deployment options
                    </li>
                    <li className="text-gray-300 flex items-center group-hover:text-black">
                      <span className="text-blue-500 mr-2">•</span>
                      Premium support
                    </li>
                    <li className="text-gray-300 flex items-center group-hover:text-black">
                      <span className="text-blue-500 mr-2">•</span>
                      Pricing information
                    </li>
                    <li className="text-gray-300 flex items-center group-hover:text-black">
                      <span className="text-blue-500 mr-2">•</span>
                      API access
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
