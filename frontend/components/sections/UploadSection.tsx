'use client';

import { useState, useCallback, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import Button from '../ui/Button';

export default function UploadSection() {
  const [showPasteHint, setShowPasteHint] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [decodedData, setDecodedData] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [qrType, setQrType] = useState<string>('');

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setError('');

    const droppedFile = e.dataTransfer.files[0];
    if (validateFile(droppedFile)) {
      setFile(droppedFile);
      processFile(droppedFile);
    }
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      processFile(selectedFile);
    }
  }, []);

  // Validate file type and size
  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload an image file (JPG, PNG, GIF, WEBP)');
      return false;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return false;
    }

    return true;
  };

  // Detect QR code type
  const detectQRType = (data: string): string => {
    // URL
    if (/^https?:\/\//i.test(data)) {
      return 'URL';
    }
    // WiFi
    if (data.startsWith('WIFI:')) {
      return 'WiFi Network';
    }
    // vCard
    if (data.startsWith('BEGIN:VCARD')) {
      return 'Contact Card';
    }
    // Email
    if (data.startsWith('mailto:')) {
      return 'Email Address';
    }
    // Phone
    if (data.startsWith('tel:')) {
      return 'Phone Number';
    }
    // SMS
    if (data.startsWith('sms:')) {
      return 'SMS';
    }
    // Geographic location
    if (data.startsWith('geo:')) {
      return 'Location';
    }
    // Calendar event
    if (data.startsWith('BEGIN:VEVENT')) {
      return 'Calendar Event';
    }
    // Plain text
    return 'Text';
  };

  // Decode QR code using ZXing
  const decodeQR = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new BrowserMultiFormatReader();
      const img = new Image();
      
      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) {
            throw new Error('Could not create canvas context');
          }

          // Set canvas size to image size
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw image to canvas
          context.drawImage(img, 0, 0);
          
          try {
            const result = await reader.decodeFromImage(img);
            resolve(result.getText());
          } catch (error) {
            reject(new Error('No QR code found in image'));
          } finally {
            reader.reset();
          }
        } catch (error) {
          reject(new Error('Failed to process image'));
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // Process the file
  const processFile = async (file: File) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await decodeQR(file);
      setDecodedData(data);
      setQrType(detectQRType(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process QR code');
      setDecodedData('');
      setQrType('');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // Handle button click
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Handle copy
  const handleCopy = async () => {
    if (decodedData) {
      try {
        await navigator.clipboard.writeText(decodedData);
        setShowPasteHint(true);
        setTimeout(() => setShowPasteHint(false), 3000);
      } catch (err) {
        setError('Failed to copy to clipboard');
      }
    }
  };

  const handleReset = () => {
    setFile(null);
    setDecodedData('');
    setQrType('');
    setError('');
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Scan QR code from image</h2>
        <p className="text-gray-600 mb-6">
          Simply upload an image or take a photo/screenshot of a QR code to reveal its content.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div 
          className={`border-2 border-dashed rounded-lg p-6 transition-colors
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Select QR code</h3>
            <div className="bg-gray-50 p-8 rounded-lg mb-4">
              <div className="flex flex-col items-center">
                {isLoading ? (
                  <div className="text-center">
                    <div className="animate-spin text-4xl mb-4">⚡</div>
                    <p className="text-gray-500">Processing QR code...</p>
                  </div>
                ) : file ? (
                  <div className="text-center">
                    <div className="mb-4">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt="Selected QR code" 
                        className="max-w-[200px] mx-auto rounded"
                      />
                    </div>
                    <p className="text-gray-500 mb-4">{file.name}</p>
                    <Button onClick={handleReset}>
                      Upload another QR Code
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="text-4xl mb-4">⬆️</span>
                    <p className="text-gray-500 mb-2">Drag and drop your QR code image here</p>
                    <p className="text-sm text-gray-400 mb-4">or</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                    <Button onClick={handleButtonClick}>
                      Choose File
                    </Button>
                  </>
                )}
              </div>
            </div>
            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}
            <p className="text-sm text-gray-500 italic">
              *Built with the most used and secure Google's ZXing library.
            </p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Scanned Data</h3>
          <div className="bg-gray-50 p-4 rounded-lg min-h-[200px] mb-4">
            {decodedData ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Type: {qrType}</p>
                <p className="text-gray-800 break-all">{decodedData}</p>
              </div>
            ) : (
              <p className="text-gray-500">Decoded content will appear here after you upload photo or screenshot of your QR code.</p>
            )}
          </div>
          <Button 
    className="w-full"
    onClick={handleCopy}
    disabled={!decodedData}
  >
    Copy Decoded Content
  </Button>
  {showPasteHint && (
  <p className="text-green-500 text-sm mt-2 text-center">
    Use CTRL + V to paste your decoded content anywhere!
  </p>
)}
</div>
      </div>
    </>
  );
}