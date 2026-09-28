import React, { useState } from 'react';
import {
  Camera,
  Heart,
  Sparkles,
  X,
  ZoomIn,
  FolderHeart,
  ExternalLink,
  Images,
  Film,
  ShieldCheck,
  Lock,
} from 'lucide-react';

const GOOGLE_DRIVE_LINK = "https://drive.google.com/drive/folders/1NOe9Z3nfmQ_0L9KY_20UZvkiB-0B5hJ1?usp=sharing";

const MEMORIES = [
  {
    id: 1,
    fileName: 'photo1.jpg',
    caption: 'En Chinna Devadhai 🌸',
    subCaption: 'Un mudhal siripil en ulagam',
    tilt: '-rotate-2',
    fallbackImg:
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    fileName: 'photo2.jpg',
    caption: 'Namma Siricha Nerangal 👣',
    subCaption: 'Marakka mudiyadha kathaigal',
    tilt: 'rotate-2',
    fallbackImg:
      'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    fileName: 'photo3.jpg',
    caption: 'Nee asapattu vanguna porul ✨',
    subCaption: 'Unaku Romba Pudicha Onnu',
    tilt: '-rotate-1',
    fallbackImg:
      'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    fileName: 'photo4.jpg',
    caption: 'Forever My Princess 👑',
    subCaption: 'Eppovum nee en kolandha dhan',
    tilt: 'rotate-3',
    fallbackImg:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
  },
];

export default function PolaroidGallery() {
  const [activePhoto, setActivePhoto] = useState(null);

  const handleImageError = (e, fallback) => {
    if (e.target.src !== fallback) {
      e.target.src = fallback;
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <Camera className="w-3.5 h-3.5" />
          <span>Timeless Footprints</span>
        </div>
        <h2 className="font-cursive text-4xl sm:text-6xl text-white text-glow mb-3">
          Unforgettable Jany Memories
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Snapshots of pure emotions, innocence, and shared laughter that time can never erase.
        </p>
      </div>

      {/* Grid of Realistic Polaroids */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8">
        {MEMORIES.map((memory) => {
          const localSrc = `/media/${memory.fileName}`;

          return (
            <div
              key={memory.id}
              onClick={() => setActivePhoto(memory)}
              className={`group cursor-pointer transform ${memory.tilt} hover:rotate-0 hover:scale-105 hover:z-20 transition-all duration-300`}
            >
              {/* Polaroid Frame */}
              <div className="bg-[#fcfbf9] rounded-lg p-3 sm:p-4 pb-6 shadow-xl shadow-black/60 border border-white/40 flex flex-col items-center">
                {/* Image Container with glossy pin effect */}
                <div className="relative w-full aspect-square bg-slate-900 rounded overflow-hidden">
                  <img
                    src={localSrc}
                    onError={(e) => handleImageError(e, memory.fallbackImg)}
                    alt={memory.caption}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-sm">
                      <ZoomIn className="w-3 h-3" />
                      View Memory
                    </span>
                  </div>
                </div>

                {/* Hand-written Polaroid Caption */}
                <div className="text-center mt-3 sm:mt-4 w-full px-1">
                  <h4 className="font-handwriting text-xl sm:text-2xl text-slate-800 font-bold leading-tight">
                    {memory.caption}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-sans mt-0.5">{memory.subCaption}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Emotional Google Drive Memory Vault Card */}
      <div className="mt-14 sm:mt-18 relative group">
        {/* Ambient Halo Glow */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-rose-500/25 via-pink-500/20 to-amber-500/25 blur-xl opacity-75 group-hover:opacity-100 transition duration-700 pointer-events-none" />

        {/* Card Container */}
        <div className="relative glass-card rounded-3xl p-6 sm:p-10 md:p-12 border border-rose-500/25 hover:border-rose-400/40 shadow-2xl backdrop-blur-2xl bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-slate-900/90 overflow-hidden">
          {/* Subtle decorative background ambient glow circles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-rose-500/10 via-pink-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-amber-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Left Narrative Column */}
            <div className="flex-1 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-4">
                <FolderHeart className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>Infinite Cloud Archive &bull; Jany's Memory Vault</span>
              </div>

              {/* Title */}
              <h3 className="font-cursive text-3xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-100 to-amber-200 text-glow leading-tight mb-2">
                Indha 4 Polaroids Mattum Illa da...
              </h3>

              {/* Emotional Handwriting Quote */}
              <p className="font-handwriting text-2xl sm:text-3xl text-rose-300/90 mb-4">
                “Un mudhal siripu la irundhu inru varai... Namma ninaivugalin muzhu ulagam.”
              </p>

              {/* Emotional Description */}
              <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mb-6">
                These four snapshots are just tiny drops in an entire ocean of memories. Appa has safely
                archived all our original high-definition photos, heartwarming childhood video clips,
                school celebrations, and unscripted laughs in our private Google Drive vault.
                Whenever you feel down, miss home, or want to revisit our beautiful journey together,
                this sacred vault is waiting for you forever.
              </p>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2.5 text-xs text-slate-300 bg-white/[0.04] px-3.5 py-2.5 rounded-xl border border-white/5">
                  <Images className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span className="font-medium">Original HD Photos</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300 bg-white/[0.04] px-3.5 py-2.5 rounded-xl border border-white/5">
                  <Film className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="font-medium">Childhood Videos</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300 bg-white/[0.04] px-3.5 py-2.5 rounded-xl border border-white/5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="font-medium">Forever Protected</span>
                </div>
              </div>
            </div>

            {/* Right Action Column */}
            <div className="flex-shrink-0 w-full sm:w-auto flex flex-col items-center">
              <div className="w-full sm:w-72 p-6 sm:p-7 rounded-2xl bg-slate-950/70 border border-white/10 shadow-inner flex flex-col items-center text-center backdrop-blur-md">
                {/* Vault Icon with Multi-ring glow */}
                <div className="relative mb-5">
                  <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-rose-500/30 to-amber-500/30 blur-md animate-pulse-slow pointer-events-none" />
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-600 to-amber-400 p-[2px] shadow-lg">
                    <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center">
                      <FolderHeart className="w-8 h-8 text-rose-300" />
                    </div>
                  </div>
                </div>

                <h4 className="text-white font-bold text-base mb-1">Google Drive Vault</h4>
                <p className="text-[11px] text-slate-400 mb-5">
                  Full cloud folder &bull; Private access
                </p>

                {/* Primary CTA Button */}
                <a
                  href={GOOGLE_DRIVE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 hover:from-rose-400 hover:to-pink-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-rose-950/60 hover:shadow-rose-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-95 group/btn border border-white/20"
                >
                  <FolderHeart className="w-4 h-4" />
                  <span>Open Drive Vault</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/80 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>

                {/* Secure footnote */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-3.5">
                  <Lock className="w-3 h-3 text-rose-400" />
                  <span>Always open for you, da jany</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-lg w-full bg-[#fdfdfc] p-4 sm:p-6 pb-8 rounded-xl shadow-2xl text-slate-900 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white"
              aria-label="Close photo view"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-full aspect-square rounded overflow-hidden bg-slate-950">
              <img
                src={`/media/${activePhoto.fileName}`}
                onError={(e) => handleImageError(e, activePhoto.fallbackImg)}
                alt={activePhoto.caption}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center mt-4">
              <h3 className="font-handwriting text-3xl font-bold text-slate-900">
                {activePhoto.caption}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">{activePhoto.subCaption}</p>
              <div className="inline-flex items-center gap-1 text-xs text-rose-500 mt-3 font-semibold">
                <Heart className="w-3.5 h-3.5 fill-rose-500" />
                Cherished always by Appa
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
