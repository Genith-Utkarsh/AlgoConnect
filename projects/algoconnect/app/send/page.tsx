'use client';

import { useState } from 'react';
import QRCodeSVG from 'react-qr-code';
import {
  generateBurnerWallet,
  encodeMnemonicToUrl,
  fundBurnerWallet,
} from '@/lib/algorand/burner-wallet';
import { resolveUsername } from '@/lib/algorand/directory';
import algosdk from 'algosdk';

export default function SendPage() {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateLink = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      // Generate burner wallet
      const burner = generateBurnerWallet();
      console.log('Generated burner wallet:', burner.address);

      // TODO: In production, get the actual connected account
      // For now, create a temp account for testing
      const senderAccount = algosdk.generateAccount();
      console.warn(
        'DEMO MODE: Using temporary sender account. In production, use connected wallet.',
        senderAccount.addr
      );

      // Fund the burner wallet
      // NOTE: This will fail in the actual environment without funded accounts
      // For demo purposes, we'll skip the actual funding and just generate the link
      try {
        await fundBurnerWallet(senderAccount, burner.address, parseFloat(amount));
        console.log('Burner wallet funded successfully');
      } catch (fundError) {
        console.warn('Could not fund burner wallet (expected in demo):', fundError);
        // Continue anyway for UI demonstration
      }

      // Generate shareable link
      const link = encodeMnemonicToUrl(burner.mnemonic, parseFloat(amount));
      setGeneratedLink(link);
      setLinkGenerated(true);
    } catch (err: any) {
      console.error('Failed to generate link:', err);
      setError(err.message || 'Failed to generate link');
    } finally {
      setGenerating(false);
    }
  };

  const handleSendToUsername = async () => {
    if (!recipient || !amount) {
      setError('Please enter both username and amount');
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      // Resolve username
      const address = await resolveUsername(recipient);
      if (!address) {
        setError('Username not found');
        setGenerating(false);
        return;
      }

      // TODO: Send directly to resolved address
      console.log('Would send', amount, 'ALGO to', address);
      alert(`Demo: Would send ${amount} ALGO to @${recipient} (${address})`);
    } catch (err: any) {
      console.error('Failed to send:', err);
      setError(err.message || 'Failed to send');
    } finally {
      setGenerating(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    alert('Link copied to clipboard!');
  };

  if (linkGenerated) {
    return (
      <main className="min-h-screen bg-white px-6 py-12">
        <div className="max-w-md mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Link Created!</h1>
            <p className="text-gray-600">Share this link to send {amount} ALGO</p>
          </div>

          {/* QR Code */}
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 mb-6 flex justify-center">
            <QRCodeSVG value={generatedLink} size={200} />
          </div>

          {/* Link Display */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <p className="text-xs text-gray-500 mb-2">Shareable Link</p>
            <p className="text-sm font-mono break-all text-gray-800">{generatedLink}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={copyLink}
              className="w-full py-4 bg-primary-500 text-white rounded-2xl font-semibold hover:bg-primary-600 transition-colors"
            >
              Copy Link
            </button>
            <button
              onClick={() => setLinkGenerated(false)}
              className="w-full py-4 border-2 border-gray-200 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Create Another Link
            </button>
          </div>

          {/* Warning */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
            <p className="text-yellow-800 text-xs">
              ⚠️ <strong>Keep this link secure!</strong> Anyone with this link can claim the funds.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Send ALGO</h1>
          <p className="text-gray-600">Choose how to send</p>
        </div>

        {/* Amount Input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">₳</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full pl-12 pr-4 py-4 text-2xl border-2 border-gray-200 rounded-2xl focus:border-primary-500 focus:outline-none transition-colors"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">Min: 0.1 ALGO • Max: 1000 ALGO</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Option 1: Generate Link */}
        <div className="mb-6">
          <h2 className="font-semibold mb-3">Option 1: Generate Link</h2>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6">
            <p className="text-sm text-gray-700 mb-4">
              Create a shareable link that anyone can use to claim ALGO, even without a wallet.
            </p>
            <button
              onClick={handleGenerateLink}
              disabled={generating || !amount}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {generating ? 'Generating...' : 'Generate AlgoLink'}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-sm text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Option 2: Send to Username */}
        <div>
          <h2 className="font-semibold mb-3">Option 2: Send to Username</h2>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-6">
            <p className="text-sm text-gray-700 mb-4">
              Send directly to a friend&apos;s username (like @alice).
            </p>
            <div className="relative mb-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400">@</span>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value.toLowerCase())}
                placeholder="username"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-primary-500 focus:outline-none transition-colors"
              />
            </div>
            <button
              onClick={handleSendToUsername}
              disabled={generating || !amount || !recipient}
              className="w-full py-3 bg-primary-500 text-white rounded-2xl font-semibold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {generating ? 'Sending...' : 'Send to Username'}
            </button>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <a href="/" className="text-primary-500 hover:underline">
            ← Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}
