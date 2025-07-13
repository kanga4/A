'use client';
import { useState } from 'react';

export default function LimitsVoice() {
  const [listening, setListening] = useState(false);

  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    synth.speak(utter);
  };

  const handleClick = async () => {
    if (!('webkitSpeechRecognition' in window)) {
      speak("Sorry, your browser does not support voice recognition.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      speak("I'm listening...");
    };

    recognition.onerror = () => {
      setListening(false);
      speak("Sorry, I couldn't hear you. Please try again.");
    };

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setListening(false);
      handleVoiceCommand(text);
    };

    recognition.start();
  };

  const handleVoiceCommand = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('price') || lower.includes('cost')) {
      speak("My services start from just 99 rupees. Contact me for full pricing.");
    } else if (lower.includes('thumbnail')) {
      speak("I can make YouTube thumbnails, Instagram posts, and more.");
    } else if (lower.includes('order')) {
      speak("You can place an order by chatting with me or visiting my contact page.");
    } else {
      speak("I'm here to help with QR codes, posters, videos, and more. Just ask!");
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-6 right-6 rounded-full p-4 text-white ${
        listening ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'
      } shadow-lg transition`}
      aria-label="Talk to Limits"
    >
      🎤
    </button>
  );
}
