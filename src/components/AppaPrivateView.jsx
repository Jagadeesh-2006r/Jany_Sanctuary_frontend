import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  KeyRound,
  RefreshCw,
  MessageSquareHeart,
  Heart,
  Smile,
  Clock,
  CheckCircle2,
  Sparkles,
  Eye,
  EyeOff,
  LogOut,
  Inbox,
  AlertCircle,
  Tag,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SHEETDB_API_URL = "https://sheetdb.io/api/v1/9re3gyz5uidx1";
const DEFAULT_PINS = ['appa123', 'janyappa', 'jaganya2007'];

/**
 * Fetch confidential messages directly from SheetDB Google Sheets
 * Reverses array so latest entries appear at the top.
 */
export async function getMessages() {
  try {
    const response = await fetch(SHEETDB_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`SheetDB responded with status ${response.status}`);
    }
    const data = await response.json();
    const array = Array.isArray(data) ? [...data].reverse() : [];
    console.log('Fetched messages from SheetDB Google Sheets (reversed):', array);
    return array;
  } catch (err) {
    console.error('Error fetching messages from SheetDB:', err);
    throw err;
  }
}

export default function AppaPrivateView() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('appa_desk_unlocked') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [showPin, setShowPin] = useState(false);

  // Messages state
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState(null);

  // Local read/hugged status map: { [indexOrTimestamp]: true }
  const [huggedMap, setHuggedMap] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('appa_hugged_notes') || '{}');
    } catch {
      return {};
    }
  });

  // Filter: 'all' | 'unread' | 'read'
  const [filter, setFilter] = useState('all');

  const handleUnlock = (e) => {
    if (e) e.preventDefault();
    const normalized = pinInput.trim().toLowerCase();

    if (DEFAULT_PINS.includes(normalized)) {
      setPinError('');
      setIsAuthenticated(true);
      sessionStorage.setItem('appa_desk_unlocked', 'true');
      fetchMessages();

      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#fbbf24', '#3b82f6'],
        });
      } catch (err) {
        // Safe fallback
      }
    } else {
      setPinError('Incorrect Appa pass-key. Please enter appa123 or master key.');
    }
  };

  const handleLockDesk = () => {
    sessionStorage.removeItem('appa_desk_unlocked');
    setIsAuthenticated(false);
    setPinInput('');
  };

  // Fetch messages from SheetDB
  const fetchMessages = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await getMessages();
      setMessages(data);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Failed to load messages from SheetDB:', err);
      setErrorMessage(`Unable to fetch messages from Google Sheets: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages();
    }
  }, [isAuthenticated]);

  const toggleHugStatus = (msgKey) => {
    setHuggedMap((prev) => {
      const next = { ...prev, [msgKey]: !prev[msgKey] };
      localStorage.setItem('appa_hugged_notes', JSON.stringify(next));

      if (next[msgKey]) {
        try {
          confetti({
            particleCount: 25,
            spread: 50,
            origin: { y: 0.5 },
            colors: ['#f43f5e', '#fb7185', '#fda4af'],
          });
        } catch (e) {
          // ignore
        }
      }
      return next;
    });
  };

  const getMoodBadgeStyle = (mood) => {
    const text = (mood || '').toLowerCase();
    if (text.includes('happy') || text.includes('smile') || text.includes('peaceful')) {
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30';
    }
    if (text.includes('missing') || text.includes('love')) {
      return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    }
    if (text.includes('stress') || text.includes('overwhelm')) {
      return 'bg-amber-500/15 text-amber-300 border-amber-400/30';
    }
    if (text.includes('sad') || text.includes('cry') || text.includes('low')) {
      return 'bg-blue-500/15 text-blue-300 border-blue-400/30';
    }
    return 'bg-purple-500/15 text-purple-300 border-purple-400/30';
  };

  const getRelativeTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      const diffMs = new Date() - d;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch {
      return '';
    }
  };

  // Helper key for each message to track read/hugged status
  const getMessageKey = (msg, index) => {
    return `${msg.timestamp || 'ts'}_${msg.feeling || 'f'}_${index}`;
  };

  const unreadCount = messages.filter((m, i) => !huggedMap[getMessageKey(m, i)]).length;

  const filteredMessages = messages.filter((m, i) => {
    const isHugged = !!huggedMap[getMessageKey(m, i)];
    if (filter === 'unread') return !isHugged;
    if (filter === 'read') return isHugged;
    return true;
  });

  // ==========================================
  // Password / PIN Gate Screen
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07090e] text-slate-100 flex items-center justify-center p-4 selection:bg-rose-500/30 selection:text-rose-200">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-md w-full rounded-3xl bg-slate-900/90 border border-rose-500/20 p-8 sm:p-10 shadow-2xl shadow-black/90 backdrop-blur-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500/20 via-pink-500/20 to-amber-500/20 border border-rose-500/30 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-rose-950/50">
            <Shield className="w-8 h-8 text-rose-300" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Lock className="w-3 h-3" />
            <span>Restricted Sanctuary Access</span>
          </span>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
            Appa's Private Monitoring Desk
          </h1>
          <p className="text-xs text-slate-400 mb-6">
            Confidential sanctuary monitoring portal for Jaganya's father. Enter your access pass-key.
          </p>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  if (pinError) setPinError('');
                }}
                placeholder="Enter Appa Pass-key (appa123)"
                autoFocus
                className="w-full px-4 py-3.5 pr-12 rounded-xl bg-slate-950/80 border border-white/15 text-white placeholder-slate-500 text-center tracking-widest text-sm focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all backdrop-blur-md"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {pinError && (
              <p className="text-xs text-rose-400 font-medium animate-fadeIn text-left pl-1">
                {pinError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-sm shadow-lg shadow-rose-950/40 transition-all active:scale-95 flex items-center justify-center gap-2 border border-white/10"
            >
              <KeyRound className="w-4 h-4" />
              <span>Unlock Private Desk</span>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Dedicated solely to protecting & loving Jaganya J</span>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // Authenticated Admin Dashboard Screen
  // ==========================================
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-rose-500/30 selection:text-rose-200">
      {/* Top Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-32 bg-gradient-to-b from-rose-600/10 via-pink-600/5 to-transparent blur-3xl pointer-events-none" />

      {/* Navigation & Header */}
      <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-400 p-[2px] shadow-md shadow-rose-500/20">
              <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                <Shield className="w-5 h-5 text-rose-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Appa's Private Monitoring Desk 🛡️
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-semibold tracking-wider uppercase">
                  Google Sheets Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Watching over Jaganya J (Jany) &bull; Direct Google Sheets Vault via SheetDB
              </p>
            </div>
          </div>

          {/* Quick Actions & Timestamps */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
            {lastRefreshed && (
              <span className="text-[11px] text-slate-400 hidden md:flex items-center gap-1 mr-2">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>Synced {lastRefreshed.toLocaleTimeString()}</span>
              </span>
            )}

            <button
              onClick={fetchMessages}
              disabled={isLoading}
              title="Refresh messages from Google Sheets"
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-rose-400' : ''}`} />
              <span className="hidden sm:inline">Refresh Notes</span>
            </button>

            <button
              onClick={handleLockDesk}
              title="Lock private desk"
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-300 text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Desk</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Daughter Notes Total Counter */}
          <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/40 ring-1 ring-rose-500/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-rose-300">
                Daughter Notes
              </span>
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center">
                <MessageSquareHeart className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">{messages.length}</span>
              {unreadCount > 0 && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                  {unreadCount} need hug
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Direct confidential answers saved in Google Sheets
            </p>
          </div>

          {/* Card 2: Latest Activity */}
          <div className="p-5 rounded-2xl glass-card border border-white/10 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                Latest Response
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-white truncate">
                {messages.length > 0 ? (messages[0].mood || 'General Note') : 'No entries yet'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">
              {messages.length > 0 ? (messages[0].timestamp || 'Recently submitted') : 'Awaiting Jany’s first message'}
            </p>
          </div>

          {/* Card 3: Unbreakable Bond Note */}
          <div className="p-5 rounded-2xl glass-card border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-rose-300 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                Appa's Little Princess
              </span>
            </div>
            <div>
              <p className="font-handwriting text-xl text-rose-200">
                "Jaganya J ❤️ Always Appa's Angel"
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Zero judgment &bull; Complete protection &bull; Direct SheetDB sync
              </p>
            </div>
          </div>
        </div>

        {/* Section Header & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center">
              <MessageSquareHeart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Daughter Notes</h2>
              <p className="text-xs text-slate-400">
                Showing all responses recorded in SheetDB (Latest notes on top)
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          {messages.length > 0 && (
            <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 text-xs self-start sm:self-auto">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filter === 'all' ? 'bg-white/20 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({messages.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filter === 'unread' ? 'bg-rose-500/30 text-rose-200 font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Needs Hug ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filter === 'read' ? 'bg-emerald-500/30 text-emerald-200 font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Hugged ({messages.length - unreadCount})
              </button>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* Messages List / Her Answers                             */}
        {/* ======================================================== */}
        <div className="space-y-6">
          {isLoading && messages.length === 0 ? (
            <div className="p-16 rounded-3xl glass-card text-center border border-white/10 animate-pulse">
              <RefreshCw className="w-8 h-8 text-rose-400 animate-spin mx-auto mb-3" />
              <p className="text-sm font-semibold text-white">Fetching notes from Google Sheets...</p>
              <p className="text-xs text-slate-400 mt-1">Connecting to SheetDB endpoint</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-12 sm:p-16 rounded-3xl glass-card text-center border border-white/10">
              <Inbox className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">
                {filter === 'unread'
                  ? 'All notes have been hugged by Appa! ❤️'
                  : 'No confidential messages recorded yet.'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                When Jany writes a note in the sanctuary form, it will sync into Google Sheets via
                SheetDB and display right here.
              </p>
            </div>
          ) : (
            filteredMessages.map((msg, index) => {
              const msgKey = getMessageKey(msg, index);
              const isHugged = !!huggedMap[msgKey];
              const relativeTime = getRelativeTime(msg.timestamp || msg.submittedAt);
              const moodTag = msg.mood || 'General Note';
              const feelingAnswer = msg.feeling || msg.q1_feeling || 'No answer recorded';
              const memoryAnswer = msg.memory || msg.q2_miss_memory || 'No answer recorded';
              const messageAnswer = msg.messageToAppa || msg.q3_message_to_appa || 'No answer recorded';

              return (
                <div
                  key={msgKey}
                  className={`rounded-3xl p-6 sm:p-8 border transition-all duration-300 relative overflow-hidden ${
                    isHugged
                      ? 'bg-slate-900/60 border-white/10'
                      : 'bg-gradient-to-br from-slate-900 via-rose-950/20 to-slate-900 border-rose-500/40 shadow-xl shadow-rose-950/30'
                  }`}
                >
                  {/* Status header banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10 mb-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isHugged
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        #{filteredMessages.length - index}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-white text-base">
                            Jaganya J (Jany)
                          </h4>

                          {/* Mood Tag */}
                          <span
                            className={`px-2.5 py-0.5 rounded-full border text-[11px] font-medium flex items-center gap-1 ${getMoodBadgeStyle(
                              moodTag
                            )}`}
                          >
                            <Tag className="w-3 h-3 opacity-70" />
                            <span>{moodTag}</span>
                          </span>

                          {/* Read/Hugged Status */}
                          {isHugged ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Hugged by Appa ❤️</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[11px] font-semibold flex items-center gap-1 animate-pulse">
                              <Heart className="w-3 h-3 fill-rose-400" />
                              <span>Needs Appa's Hug</span>
                            </span>
                          )}
                        </div>

                        {/* Timestamp Info */}
                        <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{msg.timestamp || msg.submittedAt || 'Recent'}</span>
                          {relativeTime && (
                            <>
                              <span>&bull;</span>
                              <span className="text-rose-300">{relativeTime}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Action button: Mark as Read / Hugged */}
                    <div>
                      <button
                        onClick={() => toggleHugStatus(msgKey)}
                        className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                          isHugged
                            ? 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                            : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-lg shadow-rose-950/50'
                        }`}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            isHugged ? 'text-slate-400' : 'fill-white text-white animate-bounce'
                          }`}
                        />
                        <span>{isHugged ? 'Mark as Unhugged' : 'Hug Her Word ❤️'}</span>
                      </button>
                    </div>
                  </div>

                  {/* 3 Questions & Emotional Answers */}
                  <div className="grid grid-cols-1 gap-5">
                    {/* Q1: Current Feeling */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-white/5">
                      <span className="text-xs font-semibold text-rose-300 block mb-1.5 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-300 text-[10px] flex items-center justify-center font-bold">
                          1
                        </span>
                        <span>How she is feeling right now (Ippo un manasu eppadi da irukku?):</span>
                      </span>
                      <p className="text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans">
                        {feelingAnswer}
                      </p>
                    </div>

                    {/* Q2: Cherished Memory */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-white/5">
                      <span className="text-xs font-semibold text-amber-300 block mb-1.5 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 text-[10px] flex items-center justify-center font-bold">
                          2
                        </span>
                        <span>Memory she misses the most (Namma memories-la eppovum nyabagam varadhu):</span>
                      </span>
                      <p className="text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans">
                        {memoryAnswer}
                      </p>
                    </div>

                    {/* Q3: Message to Appa */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-slate-950/80 border border-rose-500/30">
                      <span className="text-xs font-semibold text-pink-300 block mb-1.5 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-pink-500/20 text-pink-300 text-[10px] flex items-center justify-center font-bold">
                          3
                        </span>
                        <span>Unsaid message to Appa (Un appa-kitta solla virumbura vishayam):</span>
                      </span>
                      <p className="font-handwriting text-2xl sm:text-3xl text-rose-200 leading-snug whitespace-pre-wrap">
                        "{messageAnswer}"
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Admin Footer */}
      <footer className="mt-auto py-6 px-4 text-center border-t border-white/5 bg-slate-950/80 text-[11px] text-slate-500">
        <p>
          Appa's Private Monitoring Desk &bull; Completely Confidential &bull; For Jany's Father Only &bull; Synced with SheetDB
        </p>
      </footer>
    </div>
  );
}
