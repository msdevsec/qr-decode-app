import Image from 'next/image';

interface QRType {
  type: string;
  description: string;
}

const qrTypes: QRType[] = [
  { type: 'URL', description: 'link to any webpage' },
  { type: 'Text', description: 'represents plain text' },
  { type: 'Location', description: 'for a geographical position (Google maps)' },
  { type: 'WiFi', description: 'connects to a wireless network' },
  { type: 'vCard', description: 'visiting card (digital business card)' },
  { type: 'SMS', description: 'for sending SMS on a smartphone' },
  { type: 'Call', description: 'starts a phone call' },
  { type: 'Event', description: 'triggers calendar entry for any event' },
  { type: 'Mail', description: 'initiates email draft to a recipient' },
];

export default function QRTypesSection() {
  return (
    <div className="mt-16 space-y-4 sm:space-y-6 lg:space-y-8">
      <h2 className="text-2xl font-semibold text-white text-center">
        Supported QR Code Types
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Left Column - QR Types Table */}
        <div className="border border-gray-800 rounded-lg p-4 sm:p-6 bg-gray-900">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead>
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {qrTypes.map((qrType, index) => (
                  <tr 
                    key={index}
                    className="hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-white">
                      {qrType.type}
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {qrType.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column - QR Types Image */}
        <div className="border border-gray-800 rounded-lg p-4 sm:p-6 bg-gray-900 flex items-center justify-center">
          <div className="relative w-full max-w-[400px] aspect-square">
            <Image
              src="/images/qrcodes-explained.png"
              alt="QR Codes Explained"
              fill
              className="rounded-lg object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
