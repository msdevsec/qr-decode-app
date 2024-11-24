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
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold mb-4">QR Code Scanner Online</h1>
      <p className="text-lg text-gray-600 mb-8">
        The Free QR Code Scanner online allows you to scan QR codes without any app. 
        It helps you scan QR from images and also webcam. You can use it online 
        on mobile and desktop also.
      </p>

      {/* Problem-Solution Section */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-black">
          📱 Stuck with QR code while scrolling on social medias with your phone?
        </h2>
        <p className="text-lg text-black mb-6">
          Cannot scan QR codes with your phone? We have made it super easy! 
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

      {/* Action Button */}
      <div className="flex justify-center mb-12">
        <Button onClick={scrollToUpload}>
          Scan Now
        </Button>
      </div>
    </div>
  );
}
