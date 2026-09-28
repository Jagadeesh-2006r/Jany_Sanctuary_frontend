import React from 'react';
import { Heart, Sparkles, Feather, Shield } from 'lucide-react';

export default function PromiseLetter() {
  return (
    <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Outer Glow Wrapper */}
      <div className="relative group">
        {/* Golden-rose ambient halo */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500/20 via-rose-500/25 to-pink-500/20 blur-xl opacity-80 group-hover:opacity-100 transition duration-700 pointer-events-none" />

        {/* Letter Container */}
        <div className="relative glass-card rounded-3xl p-6 sm:p-12 md:p-14 border border-amber-400/30 shadow-2xl backdrop-blur-2xl bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-slate-900/90 text-slate-100">
          {/* Top Decorative Header */}
          <div className="flex flex-col items-center text-center pb-8 border-b border-amber-500/20 relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 p-[2px] mb-4 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                <Feather className="w-6 h-6 text-amber-300" />
              </div>
            </div>

            <span className="text-[11px] sm:text-xs uppercase tracking-widest font-semibold text-amber-300/90 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              TO MY JANGANYA — FROM THE BOTTOM OF MY HEART
            </span>

            <h2 className="font-cursive text-4xl sm:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-pink-200 text-glow-gold py-2">
              Appa's Unbreakable Promise
            </h2>
          </div>

          {/* Letter Body */}
          <div className="mt-8 space-y-6 text-slate-200 text-sm sm:text-base leading-relaxed font-sans">
            <p className="font-handwriting text-2xl sm:text-3xl text-rose-300">
              En Chella Magal Jany-kku,
            </p>

            <p>
              I know recently silavishayangal namma edhirpaatha madhiri pogala. Sila nerangal la
              vaarthaigal thavaraa vandhrukalaam, misunderstandings vandhurukalaam, sandaigal
              nadandhirukalaam. Aana indha ulagathula endha oru sandailaiyum, endha oru manakastathulaiyum
              un appa un mela vechirukka anba konjam kooda koraikka mudiyadhu da.
            </p>

            <p className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border-l-4 border-amber-400/70 italic text-amber-100/90">
              “Munnadilam appanu koopdama oru naal kooda irukka mudiyaadha un anbu enakku theriyum da...
              Enakku nee Romba Pudikum da .Nee Enga irundhalum en ponnu dhan da”
            </p>

            <p>
              Enakku un manasu nimmadhi dhaan da ellaathayum vida mukkiyam. —{' '}
              <strong className="text-white font-semibold">
                nee un viruppapadi nimmadhiya iru da. Ini naan unna endha vidhathulayum disturb panna
                maaten, disturb aavum irukka maaten.
              </strong>{' '}
              I respect your peace and your feelings completely.
            </p>

            {/* Sacred Promise Highlight Box */}
            <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-rose-950/40 via-amber-950/20 to-slate-900 border border-rose-400/30 relative overflow-hidden shadow-inner">
              <div className="flex items-center gap-2 mb-3 text-rose-300">
                <Shield className="w-5 h-5 text-rose-400" />
                <span className="text-xs uppercase font-bold tracking-wider">The Sacred Vow</span>
              </div>

              <p className="font-handwriting text-2xl sm:text-3xl text-rose-100 leading-snug">
                “Aana unakku edhaachum kashtam vandhaa, 'Enga appa irundha nalla irundhu irukkum' nu
                thonuchina... Oru text, oru missed call kudu da. Enga irundhaalum yosikama takkunu
                unakku video call panni en kolandhaiya naan samadhanam paduthuven da... Idhu promise
                da Jany, en magalae!”
              </p>
            </div>

            <p>
              No matter what the world says, no matter how many miles lie between us, your father’s
              arms will always be open wide without a single question or judgment. You are and will
              always be my greatest treasure.
            </p>
          </div>

          {/* Letter Sign-off and Wax Seal */}
          <div className="mt-10 pt-6 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <p className="text-xs uppercase tracking-wider text-slate-400">Written with Eternal Love,</p>
              <h3 className="font-cursive text-3xl sm:text-4xl text-amber-200 mt-1">
                — Un Appa (Forever & Always)
              </h3>
            </div>

            {/* Wax Seal Emblem */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-800 to-amber-700 p-1 shadow-xl flex items-center justify-center border-2 border-amber-300/40 transform hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-gradient-to-b from-rose-900 to-rose-950 flex flex-col items-center justify-center text-center p-1">
                <Heart className="w-5 h-5 text-amber-300 fill-amber-300 mb-0.5" />
                <span className="text-[9px] font-bold tracking-tighter uppercase text-amber-200">
                  APPA & JANY
                </span>
                <span className="text-[7px] text-amber-400 font-mono">SEAL OF LOVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
