
'use client';
import { useState } from 'react';
import LimitsVoice from './LimitsVoice';

export default function Home() {
  const [step, setStep] = useState<'welcome' | 'thankyou'>('welcome');

  const handleContinue = () => setStep('thankyou');

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white p-6 relative">
      <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full shadow-xl space-y-6 text-center">
        {step === 'welcome' && (
          <>
            <h1 className="text-3xl font-bold">🎨 Welcome to Limits Edits</h1>
            <p>I create professional QR codes, thumbnails, posters, banners, and much more.</p>
            <p>Use the voice assistant to ask questions or get help.</p>
            <button
              onClick={handleContinue}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white transition"
            >
              Continue
            </button>
          </>
        )}

        {step === 'thankyou' && (
          <>
            <h2 className="text-2xl font-semibold">Thanks for using Limits Edits AI!</h2>
            <p>You can now use voice to ask about pricing, orders, or services.</p>
          </>
        )}
      </div>

      {/* 🎤 Voice Assistant Button */}
      <LimitsVoice />
    </main>
  );
}
