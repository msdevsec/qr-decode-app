import Button from '../ui/Button';

export default function UploadSection() {
  return (
    <>
      {/* Upload Section Header */}
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
            {/* Drag and drop zone */}
            <div className="bg-gray-50 p-8 rounded-lg mb-4">
              <div className="flex flex-col items-center">
                <p className="text-gray-500 mb-2">Drag and drop your QR code photo/screenshots here</p>
                <p className="text-sm text-gray-400 mb-4">or</p>
                <Button>
                  Choose File
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-500 italic">
              *Built with the most used and secure Google's Zxing library.
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
          <Button className="w-full mt-4">
            Copy Decoded Content
          </Button>
        </div>
      </div>
    </>
  );
}
