'use client';
import { useState, useEffect } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  { 
    question: 'How to scan a QR code?',
    answer: 'You can scan a QR code online using the web app. Alternatively, you can use your phone camera. Most of the phones have built-in camera scanning capability. You need to open your phone camera and point it towards the code. Alternatively you can take a screenshot of the QR code on your device and upload it to www.qrdecode.ai.'
  },
  { 
    question: 'How to scan QR codes on iPhone?',
    answer: 'On iPhone, open your Camera app and point it at the QR code. A notification banner will appear at the top of the screen - tap it to open the link or content. Make sure "Scan QR Codes" is enabled in Settings > Camera. This works on iOS 11 and later.'
  },
  { 
    question: 'How to scan a QR code on Android?',
    answer: 'Most Android phones can scan QR codes directly through the Camera app. Open your camera, point it at the QR code, and tap the notification that appears. If your camera doesn\'t scan QR codes, try Google Lens or download a QR scanner app from the Play Store.'
  },
  { 
    question: 'Can you scan a QR code without an app?',
    answer: 'Yes! You can scan QR codes without an app using our online QR scanner. Simply upload a photo or screenshot containing the QR code, or use your device\'s camera through our website. This works on both mobile and desktop devices.'
  },
  { 
    question: 'Is there an app to scan QR codes?',
    answer: 'While most modern phones can scan QR codes through their built-in camera apps, there are many free QR code scanner apps available. However, you don\'t need an app - you can use our online QR scanner which works directly in your web browser without installing anything.'
  },
  { 
    question: 'Can you scan a QR code from a picture?',
    answer: 'Yes, you can scan QR codes from pictures or screenshots using our online QR scanner. Simply upload the image containing the QR code to our website, and we\'ll decode it instantly. This is especially useful when you can\'t scan a QR code directly, like when it\'s on your computer screen.'
  },
  { 
    question: 'How do I scan a QR code with my laptop?',
    answer: 'To scan a QR code with your laptop, you can either use your laptop\'s webcam through our online scanner, or upload a picture of the QR code to our website. If you\'re trying to scan a QR code that\'s already on your screen, simply take a screenshot and upload it to our scanner.'
  },
  { 
    question: 'How to scan a QR code from a screenshot?',
    answer: 'Take a screenshot of the QR code you want to scan, then upload it to our online QR scanner. We\'ll instantly decode the contents for you. This method works great for QR codes you see while browsing the internet or in digital documents.'
  },
  { 
    question: 'How to Scan WiFi QR code on Laptop?',
    answer: 'To scan a WiFi QR code on your laptop, use our online QR scanner with your webcam or upload a picture of the QR code. Once scanned, you\'ll see the WiFi network name and password, which you can use to connect to the network manually.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Handle URL hash for direct links to FAQs
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = parseInt(hash.replace('#faq-', ''));
      if (!isNaN(id) && id >= 0 && id < faqItems.length) {
        setOpenIndex(id);
        document.getElementById(`faq-${id}`)?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mt-16 mb-12">
      <h2 className="text-2xl font-semibold mb-6">Scan QR code FAQ&apos;s</h2>
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div 
            key={index}
            id={`faq-${index}`}
            className="group border border-gray-200 rounded-lg px-4 sm:px-6 py-3 sm:py-4 cursor-pointer hover:bg-yellow-50 transition-colors"
            onClick={() => toggleFAQ(index)}
            role="button"
            tabIndex={0}
            aria-expanded={openIndex === index}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQ(index);
              }
            }}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg sm:text-xl font-semibold group-hover:text-black transition-colors">
                {item.question}
              </h3>
              <span 
                className={`transform transition-transform duration-300 ease-in-out ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              >
                ▼
              </span>
            </div>
            <div 
              className={`mt-2 text-gray-600 overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="py-2 text-base">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
