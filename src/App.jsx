import React, { useState, useEffect, useRef } from 'react';
import ParticlesCanvas from './components/ParticlesCanvas.jsx';
import MusicPlayer from './components/MusicPlayer.jsx';
import Hero from './components/Hero.jsx';
import SOSModal from './components/SOSModal.jsx';
import VideoCallCard from './components/VideoCallCard.jsx';
import PromiseLetter from './components/PromiseLetter.jsx';
import PolaroidGallery from './components/PolaroidGallery.jsx';
import MoodTracker from './components/MoodTracker.jsx';
import ConfidentialForm from './components/ConfidentialForm.jsx';
import AppaPrivateView from './components/AppaPrivateView.jsx';
import { Heart, Sparkles, Shield, Compass, Lock, KeyRound } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (
        path === '/appa-private-view' ||
        path === '/appa-private-view/' ||
        hash === '#/appa-private-view' ||
        hash === '#appa-private-view'
      ) {
        return '/appa-private-view';
      }
    }
    return '/';
  });

  const [hasEntered, setHasEntered] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (
        path === '/appa-private-view' ||
        path === '/appa-private-view/' ||
        hash === '#/appa-private-view' ||
        hash === '#appa-private-view'
      ) {
        setCurrentPath('/appa-private-view');
      } else {
        setCurrentPath('/');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Hidden Route: Appa's Private Monitoring Desk
  if (currentPath === '/appa-private-view') {
    return <AppaPrivateView />;
  }

  const VALID_PASSWORDS = ['jaganya2007'];

  const handleUnlock = (e) => {
    if (e) e.preventDefault();

    const normalized = passwordInput.trim().toLowerCase();
    if (VALID_PASSWORDS.includes(normalized)) {
      setErrorMessage('');
      setHasEntered(true);

      // Play background audio automatically on user authentication gesture
      if (audioRef.current) {
        audioRef.current.play().catch((err) => {
          console.log('Audio playback initialized:', err.message);
        });
      }

      // Celebratory sparkles on unlock
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#ec4899', '#fbbf24', '#a855f7'],
        });
      } catch (err) {
        // Safe fallback
      }
    } else {
      setErrorMessage('Incorrect password da jany, try again!');
    }
  };

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col justify-between selection:bg-rose-500/30 selection:text-rose-200">
      {/* HTML5 Canvas Background Floating Particles */}
      <ParticlesCanvas />

      {/* Minimalist Password Authentication Overlay */}
      {!hasEntered && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl animate-fadeIn"
        >
          <div className="relative max-w-sm w-full rounded-2xl bg-slate-900/90 border border-white/10 p-8 shadow-2xl shadow-black/80 text-center">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-rose-500/10 blur-2xl pointer-events-none" />

            {/* Lock Icon */}
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-rose-300">
              <Lock className="w-5 h-5" />
            </div>

            {/* Heading */}
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight mb-6">
              Welcome to Jany's World
            </h1>

            {/* Form */}
            <form onSubmit={handleUnlock} className="space-y-4">
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="fullnamebirthyear"
                  autoFocus
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-950/70 border border-white/15 text-white placeholder-slate-500 text-center tracking-widest text-sm focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all backdrop-blur-md"
                />
              </div>

              {/* Error Message */}
              {errorMessage && (
                <p className="text-xs text-rose-400 font-medium animate-fadeIn">
                  {errorMessage}
                </p>
              )}

              {/* Unlock Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-sm shadow-lg shadow-rose-950/40 transition-all active:scale-95 border border-white/10"
              >
                Unlock Sanctuary
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Content Sections */}
      <main className="relative z-10 flex-grow pb-24">
        {/* Hero Section with Grand Declaration & SOS Trigger */}
        <Hero onOpenSOS={() => setIsSOSOpen(true)} />

        {/* Interactive Video Call Memory Card */}
        <VideoCallCard />

        {/* Father's Unbreakable Promise Letter */}
        <PromiseLetter />

        {/* Realistic Tilted Polaroid Gallery */}
        <PolaroidGallery />

        {/* Interactive Mood Tracker & Reassurance Engine */}
        <MoodTracker />

        {/* Confidential 1-on-1 Message Form */}
        <ConfidentialForm />
      </main>

      {/* Persistent Floating Music Player */}
      <MusicPlayer audioRef={audioRef} />

      {/* Emergency Comforting SOS Voice Modal */}
      <SOSModal isOpen={isSOSOpen} onClose={() => setIsSOSOpen(false)} />

      {/* Global Sanctuary Footer */}
      <footer className="relative z-10 py-12 px-4 text-center border-t border-white/5 bg-slate-950/70 backdrop-blur-md">
        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-3">
            <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
          </div>

          <h4 className="font-cursive text-3xl text-rose-200 text-glow mb-1">
            Jaganya J ❤️ Always Appa's Angel
          </h4>

          <p className="text-xs text-slate-400 max-w-sm">
            This sanctuary was architected with endless love, patience, and warmth by your father.
            You are forever cherished, respected, and protected.
          </p>

          <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" />
              Forever Safe
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Unconditional Bond
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Compass className="w-3 h-3 text-rose-400" />
              Always With You
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
