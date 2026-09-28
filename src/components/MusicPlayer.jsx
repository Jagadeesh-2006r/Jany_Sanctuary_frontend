import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, Heart, AlertCircle } from 'lucide-react';

export default function MusicPlayer({ audioRef: externalAudioRef }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const internalAudioRef = useRef(null);
  const audioRef = externalAudioRef || internalAudioRef;

  const audioSrc = '/media/song.mp3';

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasError(false);
        })
        .catch((err) => {
          console.warn('Audio play request interrupted or media unavailable:', err);
          setHasError(true);
          setIsPlaying(false);
        });
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
      setHasError(false);
    }
  };

  useEffect(() => {
    const handleMoodAudioPlay = () => {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };
    window.addEventListener('mood-audio-play', handleMoodAudioPlay);
    return () => window.removeEventListener('mood-audio-play', handleMoodAudioPlay);
  }, [audioRef]);

  const handleAudioError = () => {
    setHasError(true);
    setIsPlaying(false);
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <aside
      aria-label="Audio player for Appa song"
      className="fixed bottom-6 right-6 z-40 max-w-sm w-[calc(100vw-3rem)] sm:w-auto"
    >
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleAudioError}
      />

      <div className="glass-card rounded-2xl p-3.5 sm:p-4 border border-rose-500/20 shadow-2xl backdrop-blur-xl flex items-center gap-3.5 transition-all duration-300 hover:border-rose-400/40">
        {/* Animated Disc / Music Icon */}
        <div className="relative flex-shrink-0">
          <div
            className={`w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 via-pink-500 to-amber-400 p-[2px] shadow-lg flex items-center justify-center ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '8s' }}
          >
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
              <Music className={`w-5 h-5 ${isPlaying ? 'text-rose-400' : 'text-slate-400'}`} />
            </div>
          </div>
          {isPlaying && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
          )}
        </div>

        {/* Track Details & Visualizer */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-rose-400/90 flex items-center gap-1">
              <Heart className="w-2.5 h-2.5 fill-rose-400" />
              Appa's Song
            </span>
            {hasError && (
              <span
                title="Audio file (song.mp3) not available"
                className="inline-flex items-center text-[10px] text-amber-300/80 bg-amber-500/10 px-1.5 py-0.5 rounded"
              >
                <AlertCircle className="w-2.5 h-2.5 mr-1" />
                Upload needed
              </span>
            )}
          </div>

          <h4 className="text-xs sm:text-sm font-semibold text-slate-100 truncate mt-0.5">
            En santhoshamum Nee Dhaan
          </h4>
          <p className="text-[11px] text-slate-400 truncate">Dedicated to Jany</p>

          {/* Equalizer Visualizer Bars */}
          <div className="flex items-end gap-1 h-3 mt-1.5">
            {[40, 80, 60, 100, 50, 75].map((height, idx) => (
              <span
                key={idx}
                className={`w-1 rounded-full transition-all duration-200 ${
                  isPlaying
                    ? 'bg-gradient-to-t from-rose-500 to-amber-400'
                    : 'bg-slate-700 h-1'
                }`}
                style={{
                  height: isPlaying ? `${Math.max(15, (height * (idx % 2 === 0 ? 0.9 : 1.2)) % 100)}%` : '3px',
                  animation: isPlaying ? `bounce 1.${idx + 1}s infinite alternate ease-in-out` : 'none',
                }}
              />
            ))}
            <span className="text-[9px] text-slate-400 ml-auto font-mono">
              {formatTime(currentTime)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white flex items-center justify-center shadow-lg shadow-rose-500/25 active:scale-95 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white ml-0.5" />
            )}
          </button>

          <button
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </aside>
  );
}
