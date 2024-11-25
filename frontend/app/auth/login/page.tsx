// frontend/app/auth/login/page.tsx
'use client';

import AuthLayout from '../../../components/auth/AuthLayout';
import LoginForm from '../../../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <AuthLayout 
      title="Sign in to your account" 
      subtitle="Access your QR code history and settings"
    >
      <LoginForm />
    </AuthLayout>
  );
}