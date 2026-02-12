'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  validateUsername,
  registerUsername,
  checkUsernameAvailability,
} from '@/lib/algorand/directory';
import algosdk from 'algosdk';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [checking, setChecking] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [availability, setAvailability] = useState<boolean | null>(null);

  const handleUsernameChange = async (value: string) => {
    const cleanValue = value.toLowerCase().replace(/[^a-z0-9]/g, '');
    setUsername(cleanValue);
    setError(null);
    setAvailability(null);

    // Validate format first
    const validation = validateUsername(cleanValue);
    if (!validation.valid && cleanValue.length > 0) {
      setError(validation.error);
      return;
    }

    // Check availability if valid
    if (validation.valid) {
      setChecking(true);
      const available = await checkUsernameAvailability(cleanValue);
      setAvailability(available);
      setChecking(false);
      
      if (!available) {
        setError('This username is already taken');
      }
    }
  };

  const handleRegister = async () => {
    const validation = validateUsername(username);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    if (availability === false) {
      setError('This username is already taken');
      return;
    }

    setRegistering(true);
    setError(null);

    try {
      // TODO: Get actual account from Web3Auth or use-wallet
      // For now, create a temp account
      const tempAccount = algosdk.generateAccount();
      
      await registerUsername(tempAccount, username);
      setSuccess(true);

      // Redirect to home after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(err.message || 'Failed to register username');
    } finally {
      setRegistering(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center animate-fade-in">
          <div className="bg-primary-500 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome!</h1>
          <p className="text-2xl font-bold text-primary-600 mb-4">@{username}</p>
          <p className="text-gray-600 mb-6">Your username has been registered</p>
          <p className="text-sm text-gray-500">Redirecting to home...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Choose Your Username</h1>
          <p className="text-gray-600">Make it easy for friends to send you ALGO</p>
        </div>

        {/* Username Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">@</span>
            <input
              type="text"
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              placeholder="yourname"
              className="w-full pl-12 pr-12 py-4 text-xl border-2 border-gray-200 rounded-2xl focus:border-primary-500 focus:outline-none transition-colors"
              maxLength={20}
            />
            {checking && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
              </div>
            )}
            {!checking && availability === true && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            3-20 characters, lowercase letters and numbers only
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Register Button */}
        <button
          onClick={handleRegister}
          disabled={registering || !username || !!error || availability !== true}
          className="w-full py-4 bg-primary-500 text-white rounded-3xl font-bold text-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform active:scale-95 mb-4"
        >
          {registering ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Registering...
            </span>
          ) : (
            'Register Username'
          )}
        </button>

        {/* Skip Button */}
        <button
          onClick={() => router.push('/')}
          className="w-full py-3 text-gray-600 hover:text-gray-900 transition-colors"
        >
          Skip for now
        </button>

        {/* Info */}
        <div className="mt-8 bg-primary-50 rounded-2xl p-4">
          <h3 className="font-semibold mb-2 text-sm">Why register?</h3>
          <ul className="text-xs text-gray-600 space-y-2">
            <li className="flex gap-2">
              <span className="text-primary-500">•</span>
              <span>Friends can send you ALGO using just your username</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary-500">•</span>
              <span>No need to share long wallet addresses</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary-500">•</span>
              <span>Works just like UPI or Venmo!</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
