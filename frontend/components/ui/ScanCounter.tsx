'use client';

interface ScanCounterProps {
  scansUsed: number;
  totalScans: number;
}

export default function ScanCounter({ scansUsed, totalScans }: ScanCounterProps) {
  const remaining = totalScans - scansUsed;
  
  return (
    <div className="text-center mb-4">
      <p className="text-sm text-gray-600">
        Free Scans Remaining: 
        <span className="font-semibold ml-1">
          {remaining}/{totalScans}
        </span>
      </p>
      {remaining === 0 && (
        <a 
          href="/premium" 
          className="text-xs text-blue-600 hover:text-red-500 mt-1 hover:underline cursor-pointer inline-flex items-center gap-1"
        >
          Upgrade to Premium for unlimited scans
       
        </a>
      )}
    </div>
  );
}
