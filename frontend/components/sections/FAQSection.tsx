interface FAQItem {
  question: string;
}

const faqItems: FAQItem[] = [
  { question: 'How to scan a QR code?' },
  { question: 'How to scan QR codes on iPhone?' },
  { question: 'How to scan a QR code on Android?' },
  { question: 'Can you scan a QR code without an app?' },
  { question: 'Is there an app to scan QR codes?' },
  { question: 'Can you scan a QR code from a picture?' },
  { question: 'How do I scan a QR code with my laptop?' },
  { question: 'How to scan a QR code from a screenshot?' },
  { question: 'How to Scan WiFi QR code on Laptop?' },
];

export default function FAQSection() {
  return (
    <div className="mt-16 mb-12">
      <h2 className="text-2xl font-semibold mb-6">Scan QR code FAQ&apos;s</h2>
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg px-6 py-4">
            <h3 className="font-semibold">{item.question}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
