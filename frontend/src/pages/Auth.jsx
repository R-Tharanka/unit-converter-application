// pages/Auth.jsx
// Simple wrapper page for authentication form.
import { Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

export default function AuthPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_60%)]" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-12 px-4 py-12 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <h1 className="text-4xl font-semibold text-gray-900 sm:text-5xl">Access powerful conversions anywhere.</h1>
          <p className="text-lg text-gray-600">
            Keep your unit conversions organized, revisit them later, and switch devices without missing a beat.
          </p>
          <div className="grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
            <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
              <p className="text-base font-semibold text-gray-900">Secure history</p>
              <p className="mt-1 text-sm text-gray-600">Your conversions stay private and synced in the cloud.</p>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
              <p className="text-base font-semibold text-gray-900">Faster workflow</p>
              <p className="mt-1 text-sm text-gray-600">Quickly access previous values to build on your work.</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Prefer to explore first? <Link to="/" className="font-medium text-blue-600 hover:underline">Use the converter without signing in</Link>.
          </div>
        </div>

        <div className="flex-1">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
