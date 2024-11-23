export default function Footer() {
  return (
    <>
      {/* Footer Section */}
      <footer className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-12 border-t border-gray-200 pt-12 pb-8">
        {/* About Column */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-semibold">About QRDECODE.AI</h3>
          <div className="text-gray-600 text-sm space-y-2">
            <p>
              QRDECODE.AI is a <strong>QR code scanner </strong> online.
              It can scan QR codes from images and through any webcam. Use it online 
              without downloading any app.
            </p>
            <p>
              The QRDECODE.AI web app scans QR codes locally without uploading them to our 
              servers. Your data and privacy is our top priority.
            </p>
            <p>
              Built with Cosmo Wolfe's javascript port of Google's ZXing library.
            </p>
          </div>
        </div>

        {/* More Tools Column */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-semibold">More Tools</h3>
          <ul className="text-gray-600 text-sm space-y-2">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Coming soon...</span>
            </li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-semibold">Contact</h3>
          <ul className="text-gray-600 text-sm space-y-2">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>150 Argent Court, Grays, RM17 6TA, UNITED KINGDOM</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>support@qrdecode.ai</span>
            </li>
          </ul>
        </div>

        {/* Privacy Column */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-semibold">Data Privacy</h3>
          <div className="text-gray-600 text-sm space-y-2">
            <p>
              At QRDECODE.AI, we take the privacy and security of our users' data 
              very seriously.
            </p>
            <p>
              Our web app scans QR codes locally without uploading any data to our 
              servers, ensuring that your information stays private.
            </p>
            <p>
              Additionally, all data is encrypted to provide an additional layer of 
              security.
            </p>
          </div>
        </div>
      </footer>

      {/* Copyright Bar */}
      <div className="border-t border-gray-200 mt-8">
        <div className="flex flex-col md:flex-row justify-between items-center py-6">
          {/* Copyright Text */}
          <div className="text-sm text-gray-600 mb-4 md:mb-0">
            Copyright © QRDECODE.AI 2024
          </div>

          {/* Footer Links */}
          <div className="text-sm text-gray-600 space-x-4">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
            <span>·</span>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
            <span>·</span>
            <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </>
  );
}