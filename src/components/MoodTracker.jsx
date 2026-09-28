import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  Sparkles,
  MessageCircleHeart,
  CheckCircle2,
  Loader2,
  Play,
  Pause,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SHEETDB_MOODS_URL = "https://sheetdb.io/api/v1/9re3gyz5uidx1?sheet=moods";

const MOODS = [
  {
    key: 'sad',
    emoji: '🥺',
    label: 'Feeling Sad / Crying',
    desc: 'Tears or a heavy heart today',
    audio: '/media/mood_sad.mp3',
    lyrics:
      'கண்ணீர் சிந்தாதடா என் மகளே... உன் அப்பா உனக்காக எப்போதுமே ஒரு தூணாக நிற்பேண்டா.',
    color: 'from-blue-600/30 via-indigo-600/20 to-slate-900',
    border: 'border-blue-400/40',
    activeGlow: 'ring-2 ring-blue-400 shadow-lg shadow-blue-500/30 border-blue-300',
    activeBg: 'bg-blue-500/20',
  },
  {
    key: 'missing_appa',
    emoji: '💔',
    label: 'Missing Appa Badly',
    desc: 'Longing for Appa’s hugs & voice',
    audio: '/media/mood_missing.mp3',
    lyrics:
      'ஒரு போன் கால் போதும்டா ஜனி... உலகத்தின் எந்த மூலையில் இருந்தாலும் உன் முன்னாடி வந்து நிற்பேண்டா.',
    color: 'from-rose-600/30 via-pink-600/20 to-slate-900',
    border: 'border-rose-400/40',
    activeGlow: 'ring-2 ring-rose-400 shadow-lg shadow-rose-500/30 border-rose-300',
    activeBg: 'bg-rose-500/20',
  },
  {
    key: 'stressed',
    emoji: '😫',
    label: 'Stressed / Overwhelmed',
    desc: 'Too many thoughts or worries',
    audio: '/media/mood_stressed.mp3',
    lyrics:
      'எதையும் நினைச்சு பயப்படாதடா... உன் அப்பா இருக்கேண்டா, எல்லாம் சரியாகிடும்.',
    color: 'from-amber-600/30 via-orange-600/20 to-slate-900',
    border: 'border-amber-400/40',
    activeGlow: 'ring-2 ring-amber-400 shadow-lg shadow-amber-500/30 border-amber-300',
    activeBg: 'bg-amber-500/20',
  },
  {
    key: 'happy',
    emoji: '😊',
    label: 'Happy & Smiling',
    desc: 'Joyful, bright, and cheerful',
    audio: '/media/mood_happy.mp3',
    lyrics:
      'உன் சிரிப்பு தான் என் உலகம்டா ஜனி! எப்போதுமே இதே சந்தோஷத்தோடு நீ வாழணும்.',
    color: 'from-emerald-600/30 via-teal-600/20 to-slate-900',
    border: 'border-emerald-400/40',
    activeGlow: 'ring-2 ring-emerald-400 shadow-lg shadow-emerald-500/30 border-emerald-300',
    activeBg: 'bg-emerald-500/20',
  },
];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [comfortMessage, setComfortMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [noteText, setNoteText] = useState('');

  const audioRef = useRef(null);

  // Active mood item
  const activeMoodObj = MOODS.find((m) => m.key === selectedMood);

  const handleSelectMood = async (moodKey) => {
    setSelectedMood(moodKey);
    setIsLoading(true);
    setComfortMessage(null);
    setAudioProgress(0);

    const moodObj = MOODS.find((m) => m.key === moodKey);

    // Pause main background music so mood track plays clearly
    window.dispatchEvent(new CustomEvent('mood-audio-play'));

    // Play dedicated mood audio
    if (audioRef.current && moodObj) {
      audioRef.current.pause();
      audioRef.current.src = moodObj.audio;
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .then(() => {
          setIsPlayingAudio(true);
        })
        .catch((err) => {
          console.log('Audio autoplay prevented or media loading:', err.message);
          setIsPlayingAudio(false);
        });
    }

    // If happy, trigger celebratory confetti
    if (moodKey === 'happy') {
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#34d399', '#10b981', '#fbbf24', '#f472b6'],
        });
      } catch (e) {
        // Safe fallback
      }
    }

    // Silently log mood check-in to Google Sheets via SheetDB in the background
    const selectedMood = moodObj ? moodObj.label : moodKey;
    fetch(SHEETDB_MOODS_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [
          {
            timestamp: new Date().toLocaleString(),
            mood: selectedMood,
            comfortNote: "Listened to comfort note / song",
          },
        ],
      }),
    }).catch((err) => {
      console.log('Silent SheetDB mood log notice:', err.message);
    });

    fallbackReassurance(moodKey);
    setIsLoading(false);
  };

  const fallbackReassurance = (moodKey) => {
    const fallbacks = {
      sad: 'Kavala padadha da Jany, un appa un koodave dhaan da irukken. Everything will be alright da.',
      missing_appa: 'Un appa unna oru nodi kooda marakala da. Oru missed call kudu, un munnadi vandhu nippenda.',
      stressed: 'Take a deep breath da kannamma. En princess romba strong, unnala mudiyum.',
      happy: 'Un sirippu dhaan en ulagam da Jany! Eppovum ipdiye sandhosham-a iru da.',
    };
    setComfortMessage(fallbacks[moodKey] || 'Appa eppovum un koodave irukken dhan da irukken iruppenum kooda...!');
  };

  const toggleAudioPlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlayingAudio) {
      audio.pause();
      setIsPlayingAudio(false);
    } else {
      window.dispatchEvent(new CustomEvent('mood-audio-play'));
      audio
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch((err) => console.log('Audio play failed:', err));
    }
  };

  const replayAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    window.dispatchEvent(new CustomEvent('mood-audio-play'));
    audio.currentTime = 0;
    audio
      .play()
      .then(() => setIsPlayingAudio(true))
      .catch((err) => console.log('Audio replay failed:', err));
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const cur = audioRef.current.currentTime;
      const dur = audioRef.current.duration || 0;
      setCurrentTime(cur);
      if (dur > 0) {
        setAudioProgress((cur / dur) * 100);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleAudioEnded = () => {
    setIsPlayingAudio(false);
    setAudioProgress(100);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Hidden audio element for mood track playback */}
      <audio
        ref={audioRef}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
      />

      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Heart className="w-3.5 h-3.5 fill-rose-400" />
            <span>Daily Heart Check & Voice Comfort</span>
          </div>
          <h2 className="font-cursive text-4xl sm:text-5xl text-white text-glow mb-2">
            How is My Girl Feeling Today?
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Tap your mood to listen to Appa's comforting audio note and heartfelt words.
          </p>
        </div>

        {/* Mood Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {MOODS.map((mood) => {
            const isSelected = selectedMood === mood.key;
            return (
              <button
                key={mood.key}
                onClick={() => handleSelectMood(mood.key)}
                disabled={isLoading}
                className={`p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden ${
                  mood.border
                } ${
                  isSelected
                    ? `${mood.activeGlow} ${mood.activeBg} scale-[1.03]`
                    : 'bg-white/[0.03] hover:bg-white/[0.07] hover:scale-[1.01]'
                }`}
              >
                <div>
                  <span className="text-4xl mb-3 block transform hover:scale-125 transition-transform">
                    {mood.emoji}
                  </span>
                  <h4 className="text-base font-semibold text-white mb-1">{mood.label}</h4>
                  <p className="text-xs text-slate-400">{mood.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 font-medium">
                    {isSelected && isPlayingAudio ? (
                      <span className="text-rose-300 flex items-center gap-1">
                        <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                        Playing...
                      </span>
                    ) : isSelected ? (
                      'Selected'
                    ) : (
                      'Tap to listen'
                    )}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-rose-300 text-sm py-4">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Reaching Appa's heart...</span>
          </div>
        )}

        {/* Synchronized Comforting Lyrics & Audio Banner */}
        {activeMoodObj && !isLoading && (
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-rose-950/80 via-slate-900/90 to-purple-950/80 border border-rose-400/40 shadow-2xl animate-fadeIn relative overflow-hidden mb-6">
            {/* Ambient top light */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-16 bg-rose-500/20 blur-xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300 text-lg">
                  {activeMoodObj.emoji}
                </span>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-rose-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    Appa's Dedicated Audio & Words
                  </span>
                  <h4 className="text-xs font-semibold text-slate-200">
                    {activeMoodObj.label}
                  </h4>
                </div>
              </div>

              {/* Audio Controls */}
              <div className="flex items-center gap-3 self-end sm:self-center">
                {/* Visualizer bars */}
                <div className="flex items-end gap-1 h-4">
                  {[40, 80, 50, 100, 60].map((h, i) => (
                    <span
                      key={i}
                      className={`w-1 rounded-full transition-all duration-150 ${
                        isPlayingAudio
                          ? 'bg-gradient-to-t from-rose-500 to-amber-300'
                          : 'bg-slate-700 h-1'
                      }`}
                      style={{
                        height: isPlayingAudio ? `${Math.max(20, (h * (i % 2 === 0 ? 0.8 : 1.2)) % 100)}%` : '3px',
                        animation: isPlayingAudio ? `bounce 1.${i + 2}s infinite alternate ease-in-out` : 'none',
                      }}
                    />
                  ))}
                </div>

                {/* Play / Pause Button */}
                <button
                  onClick={toggleAudioPlay}
                  className="w-9 h-9 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
                  title={isPlayingAudio ? 'Pause Audio' : 'Play Audio'}
                >
                  {isPlayingAudio ? (
                    <Pause className="w-4 h-4 fill-white" />
                  ) : (
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  )}
                </button>

                {/* Replay Button */}
                <button
                  onClick={replayAudio}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                  title="Replay Audio"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Glowing Synchronized Tamil Lyrics Display */}
            <div className="text-center py-3">
              <p className="font-serif text-xl sm:text-2xl md:text-3xl text-rose-100 font-bold leading-relaxed text-glow tracking-wide animate-fadeIn">
                "{activeMoodObj.lyrics}"
              </p>
            </div>

            {/* Audio Progress Bar */}
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-4">
              <div
                className="bg-gradient-to-r from-rose-500 to-amber-400 h-full transition-all duration-200 rounded-full"
                style={{ width: `${audioProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Server Comfort Message Card (if different from lyrics) */}
        {comfortMessage && !isLoading && (
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3 text-xs sm:text-sm text-slate-300 animate-fadeIn">
            <MessageCircleHeart className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-rose-300 block mb-0.5">
                Appa's Recorded Response:
              </span>
              <p className="font-handwriting text-xl sm:text-2xl text-rose-200">
                "{comfortMessage}"
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
