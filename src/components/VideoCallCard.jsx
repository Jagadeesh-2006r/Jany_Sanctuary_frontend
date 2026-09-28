import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneCall, PhoneOff, Video, Heart, Sparkles, Volume2, VolumeX, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function VideoCallCard() {
  const [callState, setCallState] = useState('idle'); // 'idle' | 'ringing' | 'connected'
  const [callDuration, setCallDuration] = useState(0);
  const [audioMuted, setAudioMuted] = useState(false);
  const audioContextRef = useRef(null);
  const ringIntervalRef = useRef(null);

  // Play pleasant synthesized incoming call chime
  const playRingChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc1.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.3); // E5

      osc2.frequency.setValueAtTime(392.0, ctx.currentTime); // G4
      osc2.frequency.exponentialRampToValueAtTime(523.25, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.8);
      osc2.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.log('Synthesizer unavailable:', e);
    }
  };

  const startRinging = () => {
    setCallState('ringing');
    playRingChime();
    ringIntervalRef.current = setInterval(() => {
      playRingChime();
    }, 2800);
  };

  const stopRinging = () => {
    if (ringIntervalRef.current) {
      clearInterval(ringIntervalRef.current);
      ringIntervalRef.current = null;
    }
  };

  const attendCall = () => {
    stopRinging();
    setCallState('connected');
    setCallDuration(0);
    // Trigger festive heart confetti
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#fef08a'],
    });
  };

  const endCall = () => {
    stopRinging();
    setCallState('idle');
    setCallDuration(0);
  };

  // Timer for connected call
  useEffect(() => {
    let timer;
    if (callState === 'connected') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [callState]);

  useEffect(() => {
    return () => stopRinging();
  }, []);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const sendLoveBurst = () => {
    confetti({
      particleCount: 30,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#e11d48', '#f43f5e', '#fb7185', '#fde047'],
    });
  };

  return (
    <section className="py-12 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-rose-500/20 shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-pink-600/15 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Section Tag */}
        <div className="flex items-center gap-2 mb-3">
          <span className="p-1 rounded bg-rose-500/20 text-rose-300">
            <Video className="w-4 h-4" />
          </span>
          <span className="text-xs uppercase font-bold tracking-widest text-rose-300">
            Memory Capsule & Instant Presence
          </span>
        </div>

        {/* Jany's Signature Childhood Words */}
        <div className="mb-8">
          <blockquote className="font-handwriting text-3xl sm:text-4xl text-rose-200 leading-snug">
            “Pa... Na Unna Pakkanum Pa, Video Call Variya?”
          </blockquote>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Every time you uttered those words, your Appa dropped everything in the world to look at
            your sweet face. That promise never expires.
          </p>
        </div>

        {/* Call Container States */}
        {callState === 'idle' && (
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-950/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 p-[2px] shadow-lg flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xl font-bold text-rose-300 font-serif">
                  Appa
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Appa's Private Line</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                </h4>
                <p className="text-xs text-slate-400">Available 24/7, anywhere in the galaxy</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={startRinging}
                className="flex-1 sm:flex-initial px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50 transition-all active:scale-95"
              >
                <PhoneCall className="w-4 h-4 animate-bounce" />
                <span>Simulate Call</span>
              </button>

              <a
                href="https://wa.me/?text=Appa%20I%20miss%20you,%20video%20call%20vaanga%20pa!"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all active:scale-95"
              >
                <Video className="w-4 h-4" />
                <span>WhatsApp Video</span>
              </a>
            </div>
          </div>
        )}

        {callState === 'ringing' && (
          <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-rose-500/30 text-center animate-pulse-slow">
            {/* Pulsing Avatar */}
            <div className="relative inline-block mb-4">
              <div className="absolute -inset-3 rounded-full bg-rose-500/30 animate-ping"></div>
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 p-1">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-2xl font-serif font-bold text-rose-200">
                  Appa
                </div>
              </div>
            </div>

            <h4 className="text-xl font-bold text-white mb-1">Incoming Video Call from Appa </h4>
            <p className="text-xs text-rose-300 font-mono tracking-wider mb-6">
              Ring... Ring... Pa is waiting on the line
            </p>

            <div className="flex items-center justify-center gap-6">
              <button
                onClick={endCall}
                className="w-14 h-14 rounded-full bg-rose-600/80 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                title="Decline"
              >
                <PhoneOff className="w-6 h-6" />
              </button>

              <button
                onClick={attendCall}
                className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xl shadow-emerald-500/30 active:scale-90 transition-transform animate-bounce"
                title="Attend Call"
              >
                <Phone className="w-7 h-7" />
              </button>
            </div>
          </div>
        )}

        {callState === 'connected' && (
          <div className="rounded-2xl bg-slate-950 border border-emerald-500/30 p-6 sm:p-8 relative overflow-hidden">
            {/* Header info */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-[2px]">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-emerald-300">
                    Appa
                  </div>
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <span>Appa (Connected to Jany)</span>
                    <Heart className="w-4 h-4 text-rose-400 fill-rose-400 animate-pulse" />
                  </h4>
                  <span className="text-xs font-mono text-emerald-400">{formatDuration(callDuration)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={sendLoveBurst}
                  className="px-3 py-1.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Send Love</span>
                </button>
              </div>
            </div>

            {/* Video Call Simulation Screen */}
            <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-rose-950/30 to-purple-950/40 p-6 sm:p-8 border border-white/5 text-center min-h-[220px] flex flex-col items-center justify-center">
              <p className="font-handwriting text-2xl sm:text-3xl text-rose-200 mb-3 max-w-lg leading-relaxed">
                “En Chella magalae! Paaru, un appa un munnadi vandhutten. Nee eppo kuptalum un appa odi
                varuven da jany.”
              </p>
              <p className="text-slate-300 text-xs sm:text-sm max-w-md">
                I can see your bright eyes and cute smile. Never let any small worries dim that
                light. appa thinks about you more than words could ever convey.
              </p>
            </div>

            {/* In-Call Actions */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={endCall}
                className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <PhoneOff className="w-4 h-4" />
                <span>End Call</span>
              </button>

              <a
                href="https://wa.me/?text=Appa%20I%20miss%20you,%20video%20call%20vaanga%20pa!"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                <Video className="w-4 h-4" />
                <span>Switch to Real WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
