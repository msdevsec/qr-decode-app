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
    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Column - QR Types Table */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">QR code types</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Type</th>
                <th className="text-left py-3 px-4 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              {qrTypes.map((qrType, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium">{qrType.type}</td>
                  <td className="py-3 px-4 text-gray-600">{qrType.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Column - QR Types Image */}
      <div className="border border-gray-200 rounded-lg p-6 flex items-center justify-center">
        <Image
          src="/images/qrcodes-explained.png"
          alt="QR Codes Explained"
          width={400}
          height={400}
          className="rounded-lg"
        />
      </div>
    </div>
  );
}
