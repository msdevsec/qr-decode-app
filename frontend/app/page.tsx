import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      {/* Header Navigation */}
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
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
              Premium
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
              About
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </nav>

       {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">QR Code Scanner Online</h1>
        <p className="text-lg text-gray-600 mb-8">
          The Free QR Code Scanner online allows you to scan QR codes without any app. 
          It helps you scan QR from images and also webcam. You can use it online 
          on mobile and desktop also.
        </p>

        {/* New Problem-Solution Section */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8 max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-black">
            📱 Stuck with QR code while scrolling on social medias with your phone?
          </h2>
          <p className="text-lg text-black mb-6">
            Can&apos;t scan QR codes with your phone? We&apos;ve made it super easy! 
          </p>
          
          <div className="space-y-4 max-w-2xl mx-auto text-center text-black">
            <p>
              1. 📸 Take a quick screenshot of the QR code
            </p>
            <p>
              2. ⬆️ Upload the screenshot below
            </p>
            <p>
              3. 🎯 Get instant access to QR code content! 🎉
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mb-12">
          <button className="bg-red-600 text-white px-12 py-4 rounded-lg text-lg font-semibold
                          hover:bg-red-700 transition-colors transform hover:scale-105">
            Scan Now
          </button>
        </div>
      </div>

      {/* Upload Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Scan QR code from image</h2>
        <p className="text-gray-600 mb-6">
          Simply upload an image or take a photo/screenshot of a QR code to reveal its content.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Select QR code</h3>
            {/* We'll add the actual upload functionality later */}
            <div className="bg-gray-50 p-8 rounded-lg mb-4">
            <p className="text-gray-500">Drag and drop your QR code image here</p>
            </div>
            <p className="text-sm text-gray-500 italic">
              *Built with the most used and secure Google&apos;s Zxing library.
            </p>
          </div>
        </div>

        {/* Right Column - Results Area */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Scanned Data</h3>
          <div className="bg-gray-50 p-4 rounded-lg min-h-[200px] mb-4">
            {/* This will show decoded data */}
            <p className="text-gray-500">Decoded content will appear here...</p>
          </div>
          <button className="w-full bg-red-600 text-white px-4 py-2 rounded-lg
                           hover:bg-red-700 transition-colors transform hover:scale-105">
            Copy Decoded Content
          </button>
        </div>
      </div>

      {/* Webcam Section */}
      <div className="mt-16 mb-8">
        <h2 className="text-2xl font-semibold mb-2">Webcam QR code scanner</h2>
        <p className="text-gray-600 mb-6">
          Click &quot;Open camera&quot; & point the QR toward it to scan it and reveal its content.
        </p>
      </div>

      {/* Webcam Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Webcam Area */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">
              <span role="img" aria-label="webcam">📷</span> Webcam
            </h3>
            {/* Webcam placeholder */}
            <div className="bg-gray-50 p-8 rounded-lg mb-4 min-h-[300px] flex items-center justify-center">
              <p className="text-gray-500">Make sure to allow camera access!</p>
            </div>
            <button className="w-full bg-red-600 text-white px-4 py-2 rounded-lg
                             hover:bg-red-700 transition-colors transform hover:scale-105">
              Enable Camera Access
            </button>
          </div>
        </div>

        {/* Right Column - Webcam Results Area */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            <span role="img" aria-label="barcode">🔍</span> Scanned Data
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg min-h-[300px] mb-4 flex items-center justify-center">
            <p className="text-gray-500">Scan a QR code to view the results here.</p>
          </div>
          <button className="w-full bg-red-600 text-white px-4 py-2 rounded-lg
                           hover:bg-red-700 transition-colors transform hover:scale-105">
            Copy Decoded Content
          </button>
        </div>
      </div>

      {/* QR Types Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - QR Types Table */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">QR code types</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium">URL</td>
                  <td className="py-3 px-4 text-gray-600">link to any webpage</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium">Text</td>
                  <td className="py-3 px-4 text-gray-600">represents plain text</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium">Location</td>
                  <td className="py-3 px-4 text-gray-600">for a geographical position (Google maps)</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium">WiFi</td>
                  <td className="py-3 px-4 text-gray-600">connects to a wireless network</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium">vCard</td>
                  <td className="py-3 px-4 text-gray-600">visiting card (digital business card)</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium">SMS</td>
                  <td className="py-3 px-4 text-gray-600">for sending SMS on a smartphone</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium">Call</td>
                  <td className="py-3 px-4 text-gray-600">starts a phone call</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium">Event</td>
                  <td className="py-3 px-4 text-gray-600">triggers calendar entry for any event</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium">Mail</td>
                  <td className="py-3 px-4 text-gray-600">initiates email draft to a recipient</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column - QR Types Image */}
        <div className="border border-gray-200 rounded-lg p-6 flex items-center justify-center">
          <Image
            src="/images/qrcodes-explained.png"
            alt="QR Codes Explained"
            width={400}
            height={400}
            className="rounded-lg"
          />
        </div>
      </div>

      {/* FAQ Section - Static Version */}
      <div className="mt-16 mb-12">
        <h2 className="text-2xl font-semibold mb-6">Scan QR code FAQ&apos;s</h2>
        <div className="space-y-4">
          {/* Static FAQ items */}
          <div className="border border-gray-200 rounded-lg px-6 py-4">
            <h3 className="font-semibold">How to scan a QR code?</h3>
          </div>
          <div className="border border-gray-200 rounded-lg px-6 py-4">
            <h3 className="font-semibold">How to scan QR codes on iPhone?</h3>
          </div>
          <div className="border border-gray-200 rounded-lg px-6 py-4">
            <h3 className="font-semibold">How to scan a QR code on Android?</h3>
          </div>
          <div className="border border-gray-200 rounded-lg px-6 py-4">
            <h3 className="font-semibold">Can you scan a QR code without an app?</h3>
          </div>
          <div className="border border-gray-200 rounded-lg px-6 py-4">
            <h3 className="font-semibold">Is there an app to scan QR codes?</h3>
          </div>
          <div className="border border-gray-200 rounded-lg px-6 py-4">
            <h3 className="font-semibold">Can you scan a QR code from a picture?</h3>
          </div>
          <div className="border border-gray-200 rounded-lg px-6 py-4">
            <h3 className="font-semibold">How do I scan a QR code with my laptop?</h3>
          </div>
          <div className="border border-gray-200 rounded-lg px-6 py-4">
            <h3 className="font-semibold">How to scan a QR code from a screenshot?</h3>
          </div>
          <div className="border border-gray-200 rounded-lg px-6 py-4">
            <h3 className="font-semibold">How to Scan WiFi QR code on Laptop?</h3>
          </div>
        </div>
      </div>

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
              Built with Cosmo Wolfe&apos;s javascript port of Google&apos;s ZXing library.
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
              At QRDECODE.AI, we take the privacy and security of our users&apos; data 
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
    </main>
  );
}
