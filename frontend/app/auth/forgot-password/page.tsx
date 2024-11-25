'use client';

import AuthLayout from '../../../components/auth/AuthLayout';
import ForgotPasswordForm from '../../../components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Password reset is a premium feature"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
