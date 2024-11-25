'use client';

import { useState, useCallback, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';
import { useToast } from '../../context/ToastContext';
import { useRateLimit } from '../../context/RateLimitContext';
import LimitReachedModal from '../ui/LimitReachedModal';
import ScanCounter from '../ui/ScanCounter';

export default function UploadSection() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [decodedData, setDecodedData] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [qrType, setQrType] = useState<string>('');
  const { showToast } = useToast();
  const { scansUsed, remainingScans, resetTime, addScan, canScan } = useRateLimit();
  const [showLimitModal, setShowLimitModal] = useState(false);

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setError('');

    if (!canScan) {
      setShowLimitModal(true);
      return;
    }

    const droppedFile = e.dataTransfer.files[0];
    if (validateFile(droppedFile)) {
      setFile(droppedFile);
      processFile(droppedFile);
    }
  }, [canScan]);

  // Handle file selection
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');

    if (!canScan) {
      setShowLimitModal(true);
      return;
    }

    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      processFile(selectedFile);
    }
  }, [canScan]);

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
    if (/^https?:\/\//i.test(data)) return 'URL';
    if (data.startsWith('WIFI:')) return 'WiFi Network';
    if (data.startsWith('BEGIN:VCARD')) return 'Contact Card';
    if (data.startsWith('mailto:')) return 'Email Address';
    if (data.startsWith('tel:')) return 'Phone Number';
    if (data.startsWith('sms:')) return 'SMS';
    if (data.startsWith('geo:')) return 'Location';
    if (data.startsWith('BEGIN:VEVENT')) return 'Calendar Event';
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

          canvas.width = img.width;
          canvas.height = img.height;
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
    if (!canScan) {
      setShowLimitModal(true);
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const data = await decodeQR(file);
      const success = addScan();
      if (!success) {
        setShowLimitModal(true);
        return;
      }
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
        showToast('Content copied to clipboard!', 'success');
      } catch (err) {
        showToast('Failed to copy to clipboard', 'error');
      }
    }
  };

  return (
    <section id="upload-section">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 text-white">Scan QR code from image</h2>
        <ScanCounter 
          scansUsed={scansUsed} 
          totalScans={5} 
          resetTime={resetTime}
        />
        <p className="text-gray-400 mb-6">
          Simply upload an image or take a photo/screenshot of a QR code to reveal its content.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Upload Area */}
        <div 
          className={`border-2 border-dashed rounded-lg p-4 sm:p-6 transition-colors
            ${isDragging 
              ? 'border-blue-500 bg-blue-900/10' 
              : 'border-gray-700 hover:border-gray-600'
            }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4 text-white">Select QR code</h3>
            <div className="bg-gray-900 p-4 sm:p-8 rounded-lg mb-4 border border-gray-800">
              <div className="flex flex-col items-center">
                {isLoading ? (
                  <div className="text-center">
                    <div className="animate-spin text-4xl mb-4">⚡</div>
                    <p className="text-gray-400">Processing QR code...</p>
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
                    <p className="text-gray-400 mb-4">{file.name}</p>
                    <Button onClick={() => {
                      setFile(null);
                      setDecodedData('');
                      setQrType('');
                    }}>
                      Upload another QR
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="text-4xl mb-4">⬆️</span>
                    <p className="text-gray-300 mb-2">Drag and drop your QR code image here</p>
                    <p className="text-sm text-gray-500 mb-4">or</p>
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

        {/* Results Area */}
        <div className="border border-gray-800 rounded-lg p-4 sm:p-6 bg-gray-900">
          <h3 className="text-lg font-semibold mb-4 text-white">Scanned Data</h3>
          <div className="bg-gray-800 p-4 rounded-lg min-h-[200px] sm:min-h-[300px] mb-4">
            {decodedData ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Type: {qrType}</p>
                <p className="text-gray-200 break-all">{decodedData}</p>
              </div>
            ) : (
              <p className="text-gray-500">Decoded content will appear here...</p>
            )}
          </div>
          <Button 
            className="w-full mt-4"
            onClick={handleCopy}
            disabled={!decodedData}
          >
            Copy Decoded Content
          </Button>
          {decodedData && (
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2 text-center">Share:</p>
              <ShareButtons content={decodedData} />
            </div>
          )}
        </div>
      </div>

      <LimitReachedModal 
        isOpen={showLimitModal}
        resetTime={resetTime}
        onClose={() => setShowLimitModal(false)}
      />
    </section>
  );
}
