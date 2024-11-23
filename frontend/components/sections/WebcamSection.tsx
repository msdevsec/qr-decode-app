'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { BrowserMultiFormatReader, Result } from '@zxing/library';
import Button from '../ui/Button';

interface DecodedResult {
  type: string;
  content: string;
}

export default function WebcamSection() {
  const [showPasteHint, setShowPasteHint] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isQRDetected, setIsQRDetected] = useState(false);
  const [decodedData, setDecodedData] = useState<DecodedResult | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    readerRef.current = new BrowserMultiFormatReader();
    
    return () => {
      if (readerRef.current) {
        readerRef.current.reset();
      }
    };
  }, []);

  const determineQRType = (result: Result): string => {
    const text = result.getText();
    
    // URL
    if (text.match(/^(http|https):\/\//i)) return 'URL';
    
    // Email
    if (text.match(/^mailto:/i)) return 'Email';
    
    // Phone
    if (text.match(/^tel:/i)) return 'Phone';
    
    // WiFi
    if (text.startsWith('WIFI:')) return 'WiFi Network';
    
    // vCard
    if (text.startsWith('BEGIN:VCARD')) return 'Contact Card';
    
    // Calendar Event
    if (text.startsWith('BEGIN:VEVENT')) return 'Calendar Event';
    
    // SMS
    if (text.match(/^sms:/i)) return 'SMS';
    
    // Default to Text
    return 'Text';
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
  };

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (readerRef.current) {
      readerRef.current.reset();
    }
    setIsCameraActive(false);
  }, []);

  const startCamera = async () => {
    setIsLoading(true);
    setError('');
    setIsQRDetected(false);
    setDecodedData(null);
    
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support camera access');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      if (!videoRef.current) {
        throw new Error('Video element not initialized');
      }

      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      setIsCameraActive(true);
      startQRScanning();
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Camera access error:', errorMessage);
      setError('Failed to access camera. Please make sure you have granted camera permissions.');
      setIsCameraActive(false);
    } finally {
      setIsLoading(false);
    }
  };

  const startQRScanning = useCallback(() => {
    if (!readerRef.current || !videoRef.current) return;

    readerRef.current.decodeFromVideoDevice(
      null,
      videoRef.current,
      (result) => {
        if (result) {
          const type = determineQRType(result);
          setDecodedData({
            type,
            content: result.getText()
          });
          
          captureFrame();
          setIsQRDetected(true);
          stopCamera();
        }
      }
    ).catch((error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('QR scanning error:', errorMessage);
      setError('Failed to start QR scanning');
    });
  }, [stopCamera]);

  const handleCopy = async () => {
    if (decodedData) {
      try {
        await navigator.clipboard.writeText(decodedData.content);
        setShowPasteHint(true);
        // Hide the hint after 3 seconds
        setTimeout(() => setShowPasteHint(false), 3000);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Copy error:', errorMessage);
        setError('Failed to copy to clipboard');
      }
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <>
      <div className="mt-16 mb-8">
        <h2 className="text-2xl font-semibold mb-2">Webcam QR code scanner</h2>
        <p className="text-gray-600 mb-6">
          Click &quot;Enable Camera&quot; & point the QR toward it to scan it and reveal its content.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">
              <span role="img" aria-label="webcam">📷</span> Webcam
            </h3>
            <div className="bg-gray-50 rounded-lg mb-4 min-h-[300px] flex items-center justify-center overflow-hidden relative">
              <video
                ref={videoRef}
                className={`w-full h-full object-cover ${isQRDetected ? 'hidden' : 'block'}`}
                autoPlay
                playsInline
                muted
              />
              <canvas
                ref={canvasRef}
                className={`w-full h-full object-cover ${isQRDetected ? 'block' : 'hidden'}`}
              />
              {!isCameraActive && !isQRDetected && (
                <p className="absolute inset-0 flex items-center justify-center text-gray-500">
                  {isLoading ? 'Accessing camera...' : 'Make sure to allow camera access!'}
                </p>
              )}
            </div>
            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}
            <Button 
              className="w-full"
              onClick={isQRDetected ? startCamera : isCameraActive ? stopCamera : startCamera}
              disabled={isLoading}
            >
              {isQRDetected ? 'Scan Again' : isCameraActive ? 'Stop Camera' : 'Enable Camera Access'}
            </Button>
          </div>
        </div>

        <div className="border border-gray-300 rounded-lg p-6">
  <h3 className="text-lg font-semibold mb-4">
    <span role="img" aria-label="barcode">🔍</span> Scanned Data
  </h3>
  <div className="bg-gray-50 p-4 rounded-lg min-h-[300px] mb-4">
    {decodedData ? (
      <div className="space-y-2">
        <p className="text-sm text-gray-500">Type: {decodedData.type}</p>
        <p className="text-gray-800 break-all">{decodedData.content}</p>
      </div>
    ) : (
      <p className="text-gray-500">Point your camera at a QR code to scan it</p>
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