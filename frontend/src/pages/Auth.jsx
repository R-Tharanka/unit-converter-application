// pages/Auth.jsx
// Simple wrapper page for authentication form.
import { Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full">
        <AuthForm />
        <div className="mt-4 text-center text-sm">
          <Link to="/" className="text-blue-600 hover:underline">
            Go to converter
          </Link>
        </div>
      </div>
    </div>
  );
}
