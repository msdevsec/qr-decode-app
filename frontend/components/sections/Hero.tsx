// frontend/components/sections/Hero.tsx
'use client';
import Button from '../ui/Button';

const scrollToUpload = () => {
  const element = document.getElementById('upload-section');
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  } else {
    console.log('Upload section not found');
  }
};

export default function Hero() {
  return (
    <div className="text-center px-4 sm:px-6 lg:px-8 mb-12">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white">
        QR Code Scanner Online
      </h1>
      <p className="text-base sm:text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
        The Free QR Code Scanner online allows you to scan QR codes without any app. 
        It helps you scan QR from images and also webcam. You can use it online 
        on mobile and desktop also.
      </p>

      {/* Problem-Solution Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-6 mb-8 max-w-3xl mx-auto">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-white">
          📱 Stuck with QR code while scrolling on social medias with your phone?
        </h2>
        <p className="text-base sm:text-lg text-gray-300 mb-6">
          Cannot scan QR codes with your phone? We have made it super easy! 
        </p>
        
        <div className="space-y-4 max-w-2xl mx-auto text-center text-gray-200">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl">1.</span>
            <p className="text-base sm:text-lg flex items-center">
              <span className="mr-2">📸</span>
              Take a quick screenshot of the QR code
            </p>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl">2.</span>
            <p className="text-base sm:text-lg flex items-center">
              <span className="mr-2">⬆️</span>
              Upload the screenshot below
            </p>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl">3.</span>
            <p className="text-base sm:text-lg flex items-center">
              <span className="mr-2">🎯</span>
              Get instant access to QR code content! <span className="ml-1">🎉</span>
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center mb-12">
        <Button 
          onClick={scrollToUpload}
          className="w-full sm:w-auto px-8 py-3 text-lg"
        >
          Scan Now
        </Button>
      </div>
    </div>
  );
}