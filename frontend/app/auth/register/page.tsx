// frontend/app/auth/register/page.tsx
'use client';

import AuthLayout from '../../../components/auth/AuthLayout';
import RegisterForm from '../../../components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthLayout 
      title="Create your account" 
      subtitle="Start managing your QR codes today"
    >
      <RegisterForm />
    </AuthLayout>
  );
}