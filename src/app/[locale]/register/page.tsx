import { AuthForm } from '@/features/auth/auth-form';

export const metadata = { title: 'Inscription' };

export default function RegisterPage() {
  return (
    <div className="container-page py-16">
      <AuthForm mode="register" />
    </div>
  );
}
