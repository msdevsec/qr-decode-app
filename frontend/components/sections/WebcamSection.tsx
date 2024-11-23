import Button from '../ui/Button';

export default function WebcamSection() {
  return (
    <>
      {/* Webcam Section Header */}
      <div className="mt-16 mb-8">
        <h2 className="text-2xl font-semibold mb-2">Webcam QR code scanner</h2>
        <p className="text-gray-600 mb-6">
          Click "Open camera" & point the QR toward it to scan it and reveal it's content.
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
            <Button className="w-full mt-4">
              Enable Camera Access
            </Button>
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
          <Button className="w-full mt-4">
            Copy Decoded Content
          </Button>
        </div>
      </div>
    </>
  );
}