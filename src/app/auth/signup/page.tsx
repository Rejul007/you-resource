import AuthForm from '@/components/AuthForm';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <AuthForm mode="signup" />
    </div>
  );
}
