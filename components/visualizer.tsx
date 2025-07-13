"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MicIcon, PhoneIcon } from 'lucide-react';
import useVapi from '@/hooks/use-vapi';

const Visualizer: React.FC = () => {
  const { volumeLevel, isSessionActive, toggleCall } = useVapi();
  const [bars, setBars] = useState(Array(50).fill(5));
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [userVolume, setUserVolume] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (isSessionActive && !audioContextRef.current) {
      const initMic = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          micStreamRef.current = stream;

          const audioCtx = new AudioContext();
          audioContextRef.current = audioCtx;

          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          analyserRef.current = analyser;

          const micSource = audioCtx.createMediaStreamSource(stream);
          micSource.connect(analyser);

          const data = new Uint8Array(analyser.frequencyBinCount);

          const detect = () => {
            if (!isSessionActive) return;
            analyser.getByteFrequencyData(data);
            const avg = data.reduce((a, b) => a + b, 0) / data.length;
            const norm = avg / 255;
            setUserVolume(norm);
            setIsUserSpeaking(norm > 0.05);
            animationFrameRef.current = requestAnimationFrame(detect);
          };

          detect();
        } catch (err) {
          console.error("Mic error:", err);
        }
      };
      initMic();
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (micStreamRef.current) micStreamRef.current.getTracks().forEach(t => t.stop());
      if (audioContextRef.current) audioContextRef.current.close();
      analyserRef.current = null;
      audioContextRef.current = null;
    };
  }, [isSessionActive]);

  useEffect(() => {
    let t: NodeJS.Timeout;
    const animate = () => {
      if (isSessionActive) {
        const vol = isUserSpeaking ? userVolume : volumeLevel * 0.8;
        setBars(prev =>
          prev.map(h => h + (Math.random() * vol * 120 - h) * 0.3)
        );
        t = setTimeout(animate, 150);
      } else {
        setBars(Array(50).fill(5));
      }
    };
    animate();
    return () => clearTimeout(t);
  }, [volumeLevel, userVolume, isUserSpeaking, isSessionActive]);

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <AnimatePresence>
        {isSessionActive && (
          <motion.div
            className="flex items-center justify-center w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <svg width="100%" height="120" viewBox="0 0 1000 200">
              {bars.map((h, i) => (
                <React.Fragment key={i}>
                  <rect
                    x={500 + i * 20 - 490}
                    y={100 - h / 2}
                    width="10"
                    height={h}
                    className={`fill-current ${
                      isUserSpeaking ? 'text-blue-500' : 'text-black dark:text-white'
                    }`}
                  />
                  <rect
                    x={500 - i * 20 - 10}
                    y={100 - h / 2}
                    width="10"
                    height={h}
                    className={`fill-current ${
                      isUserSpeaking ? 'text-blue-500' : 'text-black dark:text-white'
                    }`}
                  />
                </React.Fragment>
              ))}
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={toggleCall}
        className={`mt-4 w-12 h-12 rounded-full shadow-lg text-white ${
          isUserSpeaking
            ? 'bg-blue-500'
            : isSessionActive
            ? 'bg-red-500'
            : 'bg-green-500'
        }`}
      >
        {isSessionActive ? <PhoneIcon size={24} /> : <MicIcon size={24} />}
      </button>
    </div>
  );
};

export default Visualizer;