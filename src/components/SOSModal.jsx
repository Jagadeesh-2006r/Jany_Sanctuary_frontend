import React, { useEffect, useRef, useState } from 'react';
import { X, Video, Volume2, VolumeX, Play, Pause, Heart, ShieldAlert, Sparkles, MessageCircle } from 'lucide-react';

export default function SOSModal({ isOpen, onClose }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef(null);

  const voiceSrc = '/media/appa_voice.mp3';
  const whatsappUrl = 'https://wa.me/?text=Appa%20I%20miss%20you,%20video%20call%20vaanga%20pa!';

  useEffect(() => {
    if (isOpen) {
      // Auto-play voice note on open
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio
          .play()
          .then(() => {
            setIsPlayingAudio(true);
            setAudioError(false);
          })
          .catch((err) => {
            console.log('Autoplay blocked or voice file not yet present:', err.message);
            setIsPlayingAudio(false);
            setAudioError(true);
          });
      }
    } else {
      // Pause gracefully on close
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlayingAudio(false);
      }
    }
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleCloseModal = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlayingAudio(false);
    onClose();
  };

  const toggleVoicePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlayingAudio) {
      audio.pause();
      setIsPlayingAudio(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlayingAudio(true);
          setAudioError(false);
        })
        .catch(() => {
          setAudioError(true);
          setIsPlayingAudio(false);
        });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn"
    >
      {/* Dimmed backdrop with intense glass blur */}
      <div
        onClick={handleCloseModal}
        className="fixed inset-0 bg-black/75 backdrop-blur-xl transition-opacity"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900/90 border border-rose-500/30 p-6 sm:p-8 shadow-2xl shadow-rose-950/80 z-10 my-8">
        {/* Subtle decorative glow in header */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-rose-500/20 blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleCloseModal}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 p-0.5 shadow-lg shadow-rose-500/30 mb-4 animate-bounce">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
              <Heart className="w-8 h-8 text-rose-400 fill-rose-500" />
            </div>
          </div>

          <span className="text-xs uppercase tracking-widest font-semibold text-rose-400 flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Appa's Emergency Comfort Signal
          </span>

          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-serif">
            Appa Is Right Here, Jany
          </h3>
        </div>

        {/* Father's Core Reassurance */}
        <div className="my-6 p-5 rounded-2xl bg-gradient-to-br from-rose-950/40 via-purple-950/30 to-slate-900/80 border border-rose-500/20 text-center relative overflow-hidden">
          <p className="font-handwriting text-2xl sm:text-3xl text-rose-200 leading-snug mb-2">
            "Kavala padadha da Jany, un appa un koodave dhaan irukken."
          </p>
          <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed">
            Close your eyes and breathe. Nothing in this world is bigger than you, and nobody can
            diminish your worth. Whenever things feel heavy, remember whose princess you are.
          </p>
        </div>

        {/* Appa's Voice Note Player */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6 flex items-center justify-between gap-4">
          <audio
            ref={audioRef}
            src={voiceSrc}
            preload="auto"
            onEnded={() => setIsPlayingAudio(false)}
            onError={() => {
              setAudioError(true);
              setIsPlayingAudio(false);
            }}
          />

          <div className="flex items-center gap-3">
            <button
              onClick={toggleVoicePlayback}
              className="w-11 h-11 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-transform flex-shrink-0"
            >
              {isPlayingAudio ? (
                <Pause className="w-5 h-5 fill-white" />
              ) : (
                <Play className="w-5 h-5 fill-white ml-0.5" />
              )}
            </button>
            <div>
              <p className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <span>Appa's Voice Note</span>
                {isPlayingAudio && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
              </p>
              <p className="text-xs text-slate-400">
                {audioError
                  ? 'Voice note audio unavailable'
                  : isPlayingAudio
                  ? 'Listening to Appa speaking...'
                  : 'Tap to hear Appa’s voice'}
              </p>
            </div>
          </div>

          <div className="text-rose-400">
            {isPlayingAudio ? (
              <Volume2 className="w-6 h-6 animate-pulse" />
            ) : (
              <VolumeX className="w-6 h-6 text-slate-500" />
            )}
          </div>
        </div>

        {/* Video Call WhatsApp CTA */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-base sm:text-lg flex items-center justify-center gap-3 shadow-xl shadow-emerald-950/50 hover:shadow-emerald-900/80 transition-all transform active:scale-95"
        >
          <Video className="w-6 h-6 text-emerald-100" />
          <span>Video Call Appa Right Now</span>
        </a>

        <div className="mt-4 text-center">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            Opens WhatsApp directly with Appa's hotline
          </p>
        </div>
      </div>
    </div>
  );
}
