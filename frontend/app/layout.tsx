import RootLayout from '../components/layout/RootLayout';
import { metadata } from './metadata';
import './globals.css';

// Export metadata for Next.js
export { metadata };

// Root layout wrapper (server component)
export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black min-h-screen flex flex-col">
        <RootLayout>
          {children}
        </RootLayout>
      </body>
    </html>
  );
}
