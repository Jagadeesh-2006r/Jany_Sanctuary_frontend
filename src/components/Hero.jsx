import React from 'react';
import { Heart, Sparkles, PhoneCall, ShieldCheck, Flame } from 'lucide-react';

export default function Hero({ onOpenSOS }) {
  const handleSOSClick = () => {
    // Log SOS trigger to backend for Appa's Private Monitoring Desk
    fetch('http://localhost:5000/api/sos-alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'Hero Miss You Button',
        note: 'Jany clicked Whenever You Miss Me button in Hero',
      }),
    }).catch((err) => console.log('SOS log error:', err.message));

    if (onOpenSOS) onOpenSOS();
  };

  return (
    <header className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 max-w-5xl mx-auto text-center flex flex-col items-center">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] bg-gradient-to-tr from-rose-600/20 via-pink-500/15 to-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Dedicated Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-rose-400/30 text-rose-200 text-xs sm:text-sm font-medium mb-8 shadow-lg shadow-rose-950/40 animate-pulse-slow">
        <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
        <span className="tracking-widest font-semibold uppercase text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-200 to-amber-200">
          DEDICATED TO JAGANYA J (JANY)
        </span>
        <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
      </div>

      {/* Grand Tamil Cursive Title */}
      <h2 className="font-cursive text-4xl sm:text-6xl md:text-7xl text-rose-300/95 tracking-wide text-glow mb-3">
        En Chella Magalukku
      </h2>

      {/* Hero Primary Punchline */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mb-6">
        En Uyirum Nee,{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-amber-200">
          En Ulagamum Nee Dhaan Da...
        </span>
      </h1>

      {/* Heartfelt Intro Paragraph */}
      <p className="max-w-2xl text-slate-300 text-base sm:text-lg leading-relaxed mb-10 font-normal">
        No matter where you go, how big you grow, or whatever life brings—remember that your Appa’s
        love is your permanent shelter. In happiness or in tears, you are never alone. This sanctuary
        is your safe corner forever.
      </p>

      {/* Prominent Pulsating SOS Button */}
      <div className="relative group">
        {/* Pulsating back glow */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-rose-600 via-pink-500 to-amber-400 opacity-75 blur-md group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse"></div>

        <button
          onClick={handleSOSClick}
          id="btn-whenever-you-miss-me"
          className="relative inline-flex items-center gap-3 px-8 py-4 sm:px-10 sm:py-5 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white font-bold text-base sm:text-lg shadow-2xl transition-all duration-300 transform active:scale-95 group-hover:scale-105 border border-white/20"
        >
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400"></span>
          </span>
          <span>Whenever You Miss Me (Click Here)</span>
          <PhoneCall className="w-5 h-5 text-amber-200 animate-bounce" />
        </button>
      </div>

      {/* Micro badges below hero */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-xs sm:text-sm text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Always Safe With Appa
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-rose-400" />
          Unconditional Love
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Heart className="w-4 h-4 text-pink-400 fill-pink-400/40" />
          Jaganya J's Forever Fortress
        </span>
      </div>
    </header>
  );
}
