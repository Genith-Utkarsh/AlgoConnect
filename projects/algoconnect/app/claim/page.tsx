'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  decodeMnemonicFromUrl,
  getBurnerWalletBalance,
  sweepBurnerWallet,
} from '@/lib/algorand/burner-wallet';
import confetti from 'canvas-confetti';

export default function ClaimPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkData, setLinkData] = useState<{ mnemonic: string; amount: number } | null>(null);
  const [actualBalance, setActualBalance] = useState<number>(0);
  const [claimed, setClaimed] = useState(false);
  const [txId, setTxId] = useState<string | null>(null);

  // Extract mnemonic from URL hash on mount
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) {
      setError('Invalid claim link - no data found');
      setLoading(false);
      return;
    }

    const decoded = decodeMnemonicFromUrl(hash);
    if (!decoded) {
      setError('Invalid claim link - cannot decode data');
      setLoading(false);
      return;
    }

    setLinkData(decoded);

    // Get actual balance
    getBurnerWalletBalance(decoded.mnemonic)
      .then((balance) => {
        setActualBalance(balance);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to get balance:', err);
        setError('Failed to load balance');
        setLoading(false);
      });
  }, []);

  const handleClaim = async () => {
    if (!linkData) return;

    // For now, we'll use a dummy receiver address
    // In production, this would come from Web3Auth or use-wallet
    const tempReceiverAddress = 'TEMP_RECEIVER_ADDRESS'; // TODO: Replace with actual auth

    if (tempReceiverAddress === 'TEMP_RECEIVER_ADDRESS') {
      setError('Please connect your wallet first');
      return;
    }

    setClaiming(true);
    setError(null);

    try {
      const result = await sweepBurnerWallet(linkData.mnemonic, tempReceiverAddress);
      setTxId(result.txId);
      setClaimed(true);

      // Celebrate with confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0ea5e9', '#10b981', '#f59e0b'],
      });

      // Auto-redirect to username registration after 3 seconds
      setTimeout(() => {
        router.push('/register');
      }, 3000);
    } catch (err: any) {
      console.error('Claim failed:', err);
      setError(err.message || 'Failed to claim funds');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your gift...</p>
        </div>
      </main>
    );
  }

  if (claimed) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center animate-fade-in">
          <div className="bg-green-500 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Success!</h1>
          <p className="text-2xl font-bold text-green-600 mb-4">{actualBalance.toFixed(2)} ALGO</p>
          <p className="text-gray-600 mb-6">has been added to your wallet</p>
          {txId && (
            <a
              href={`https://testnet.explorer.perawallet.app/tx/${txId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-500 hover:underline"
            >
              View Transaction ↗
            </a>
          )}
          <p className="text-sm text-gray-500 mt-8">Redirecting to username registration...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">You&apos;ve received ALGO! 🎉</h1>
          <p className="text-gray-600">Someone sent you cryptocurrency</p>
        </div>

        {/* Amount Card */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl p-8 mb-6 text-center">
          <p className="text-sm text-gray-600 mb-2">You&apos;re claiming</p>
          <p className="text-display text-primary-700">{actualBalance.toFixed(2)}</p>
          <p className="text-xl text-gray-700 mt-1">ALGO</p>
          <p className="text-xs text-gray-500 mt-4">≈ ${(actualBalance * 0.25).toFixed(2)} USD</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Claim Button */}
        <button
          onClick={handleClaim}
          disabled={claiming || !!error}
          className="w-full py-4 bg-primary-500 text-white rounded-3xl font-bold text-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform active:scale-95 mb-4"
        >
          {claiming ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Claiming...
            </span>
          ) : (
            'Claim Funds'
          )}
        </button>

        {/* Info */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <h3 className="font-semibold mb-2 text-sm">What happens next?</h3>
          <ul className="text-xs text-gray-600 space-y-2">
            <li className="flex gap-2">
              <span className="text-primary-500">1.</span>
              <span>We&apos;ll create a wallet for you (no setup needed!)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary-500">2.</span>
              <span>Your ALGO will be transferred instantly</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary-500">3.</span>
              <span>You can register a username to receive future payments</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
