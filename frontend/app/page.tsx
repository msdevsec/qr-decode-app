import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex">
        <h1 className="text-4xl font-bold">QR Code Decoder</h1>
      </div>

      <div className="relative flex place-items-center">
        {/* Upload section will go here */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <p className="text-gray-600 mb-4">
            Upload a screenshot containing a QR code to decode it
          </p>
          {/* We'll add the upload component here later */}
        </div>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left">
        <div className="group rounded-lg border border-transparent px-5 py-4">
          <h2 className="mb-3 text-2xl font-semibold">
            Easy to Use
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Simply upload your screenshot and get the QR code content instantly.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4">
          <h2 className="mb-3 text-2xl font-semibold">
            Fast & Reliable
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Quick processing with high accuracy detection.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4">
          <h2 className="mb-3 text-2xl font-semibold">
            Free to Start
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            5 free decodes per day. No registration required.
          </p>
        </div>
      </div>
    </main>
  );
}