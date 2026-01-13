import { Suspense } from 'react';
import { ResetPasswordForm } from './components/reset-password-form';

function ResetPasswordContent() {
  return <ResetPasswordForm />;
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

