'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { BrowserMultiFormatReader, Result } from '@zxing/library';
import Button from '../ui/Button';
import ShareButtons from '../ui/ShareButtons';
import { useToast } from '../../context/ToastContext';
import { useRateLimit } from '../../context/RateLimitContext';
import LimitReachedModal from '../ui/LimitReachedModal';
import ScanCounter from '../ui/ScanCounter';

interface DecodedResult {
  type: string;
  content: string;
}

export default function WebcamSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isQRDetected, setIsQRDetected] = useState(false);
  const [decodedData, setDecodedData] = useState<DecodedResult | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const { showToast } = useToast();
  const { scansUsed, remainingScans, resetTime, addScan, canScan } = useRateLimit();
  const [showLimitModal, setShowLimitModal] = useState(false);

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
    if (text.match(/^(http|https):\/\//i)) return 'URL';
    if (text.match(/^mailto:/i)) return 'Email';
    if (text.match(/^tel:/i)) return 'Phone';
    if (text.startsWith('WIFI:')) return 'WiFi Network';
    if (text.startsWith('BEGIN:VCARD')) return 'Contact Card';
    if (text.startsWith('BEGIN:VEVENT')) return 'Calendar Event';
    if (text.match(/^sms:/i)) return 'SMS';
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
    if (!canScan) {
      setShowLimitModal(true);
      return;
    }

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
          const success = addScan();
          if (!success) {
            setShowLimitModal(true);
            return;
          }
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
  }, [stopCamera, addScan]);

  const handleCopy = async () => {
    if (decodedData) {
      try {
        await navigator.clipboard.writeText(decodedData.content);
        showToast('Content copied to clipboard!', 'success');
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Copy error:', errorMessage);
        showToast('Failed to copy to clipboard', 'error');
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
        <h2 className="text-2xl font-semibold mb-2 text-white">Webcam QR code scanner</h2>
        <ScanCounter scansUsed={scansUsed} totalScans={5} resetTime={resetTime} />
        <p className="text-gray-400 mb-6">
          Click &quot;Enable Camera&quot; & point the QR toward it to scan it and reveal its content.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <div className="border border-gray-800 rounded-lg p-4 sm:p-6 bg-gray-900">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4 text-white">
              <span role="img" aria-label="webcam">📷</span> Webcam
            </h3>
            <div className="bg-gray-800 rounded-lg mb-4 min-h-[300px] flex items-center justify-center overflow-hidden relative">
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
                <p className="absolute inset-0 flex items-center justify-center text-gray-400">
                  {isLoading ? 'Accessing camera...' : 'Make sure to allow camera access!'}
                </p>
              )}
            </div>
            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}
            <Button 
              className="w-full mt-4"
              onClick={isQRDetected ? startCamera : isCameraActive ? stopCamera : startCamera}
              disabled={isLoading}
            >
              {isQRDetected ? 'Scan Again' : isCameraActive ? 'Stop Camera' : 'Enable Camera Access'}
            </Button>
          </div>
        </div>

        <div className="border border-gray-800 rounded-lg p-4 sm:p-6 bg-gray-900">
          <h3 className="text-lg font-semibold mb-4 text-white">
            <span role="img" aria-label="barcode">🔍</span> Scanned Data
          </h3>
          <div className="bg-gray-800 p-4 rounded-lg min-h-[200px] sm:min-h-[300px] mb-4">
            {decodedData ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Type: {decodedData.type}</p>
                <div>
                  <p className="text-gray-200 break-all bg-gray-900 p-3 rounded border border-gray-700">
                    {decodedData.content}
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">Point your camera at a QR code to scan it</p>
              </div>
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
              <ShareButtons content={decodedData.content} />
            </div>
          )}
        </div>
      </div>

      <LimitReachedModal 
        isOpen={showLimitModal}
        resetTime={resetTime}
        onClose={() => setShowLimitModal(false)}
      />
    </>
  );
}
