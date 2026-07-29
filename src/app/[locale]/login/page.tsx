import { AuthForm } from '@/features/auth/auth-form';

export const metadata = { title: 'Connexion' };

export default function LoginPage() {
  return (
    <div className="container-page py-16">
      <AuthForm mode="login" />
    </div>
  );
}
