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
  AlertTriangle,
  BellRing,
  Phone,
  Activity,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SHEETDB_BASE_URL = "https://sheetdb.io/api/v1/9re3gyz5uidx1";
export const SHEETDB_MESSAGES_URL = "https://sheetdb.io/api/v1/9re3gyz5uidx1?sheet=messages";
export const SHEETDB_MOODS_URL = "https://sheetdb.io/api/v1/9re3gyz5uidx1?sheet=moods";
export const SHEETDB_SOS_URL = "https://sheetdb.io/api/v1/9re3gyz5uidx1?sheet=sos";

const DEFAULT_PINS = ['appa123', 'janyappa', 'jaganya2007'];

/**
 * Fetch confidential messages directly from SheetDB Google Sheets
 * Reverses array so latest entries appear at the top.
 */
export async function getMessages() {
  try {
    const response = await fetch(SHEETDB_MESSAGES_URL, {
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
    return Array.isArray(data) ? [...data].reverse() : [];
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

  // Tab State: 'messages' | 'moods' | 'sos'
  const [activeTab, setActiveTab] = useState('messages');

  // Sheet Data states
  const [messages, setMessages] = useState([]);
  const [moods, setMoods] = useState([]);
  const [sosAlerts, setSosAlerts] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState(null);

  // Local read/hugged status map for notes: { [msgKey]: true }
  const [huggedMap, setHuggedMap] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('appa_hugged_notes') || '{}');
    } catch {
      return {};
    }
  });

  // Filter for messages: 'all' | 'unread' | 'read'
  const [filter, setFilter] = useState('all');

  const handleUnlock = (e) => {
    if (e) e.preventDefault();
    const normalized = pinInput.trim().toLowerCase();

    if (DEFAULT_PINS.includes(normalized)) {
      setPinError('');
      setIsAuthenticated(true);
      sessionStorage.setItem('appa_desk_unlocked', 'true');
      fetchAllDashboardData();

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

  // Fetch all active sheets together (messages, moods, sos)
  const fetchAllDashboardData = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };

      const [messagesRes, moodsRes, sosRes] = await Promise.all([
        fetch(SHEETDB_MESSAGES_URL, { headers })
          .then((r) => r.json())
          .catch((err) => {
            console.error('Error fetching messages from SheetDB:', err);
            return [];
          }),
        fetch(SHEETDB_MOODS_URL, { headers })
          .then((r) => r.json())
          .catch((err) => {
            console.error('Error fetching moods from SheetDB:', err);
            return [];
          }),
        fetch(SHEETDB_SOS_URL, { headers })
          .then((r) => r.json())
          .catch((err) => {
            console.error('Error fetching sos alerts from SheetDB:', err);
            return [];
          }),
      ]);

      const messagesList = Array.isArray(messagesRes) ? [...messagesRes].reverse() : [];
      const moodsList = Array.isArray(moodsRes) ? [...moodsRes].reverse() : [];
      const sosList = Array.isArray(sosRes) ? [...sosRes].reverse() : [];

      console.log('✅ SheetDB All Synced (reversed):', {
        messages: messagesList.length,
        moods: moodsList.length,
        sos: sosList.length,
      });

      setMessages(messagesList);
      setMoods(moodsList);
      setSosAlerts(sosList);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Failed to load dashboard data from SheetDB:', err);
      setErrorMessage(`Unable to fetch from Google Sheets: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllDashboardData();
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

  const getMoodBadgeInfo = (moodStr) => {
    const m = (moodStr || '').toLowerCase();
    if (m.includes('happy') || m.includes('smile') || m.includes('peaceful')) {
      return {
        label: moodStr || 'Happy & Smiling',
        emoji: '😊',
        bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
        border: 'border-emerald-500/30',
      };
    }
    if (m.includes('missing') || m.includes('love')) {
      return {
        label: moodStr || 'Missing Appa Badly',
        emoji: '💔',
        bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        border: 'border-rose-500/30',
      };
    }
    if (m.includes('stress') || m.includes('overwhelm')) {
      return {
        label: moodStr || 'Stressed / Overwhelmed',
        emoji: '😫',
        bg: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
        border: 'border-amber-500/30',
      };
    }
    if (m.includes('sad') || m.includes('cry') || m.includes('low')) {
      return {
        label: moodStr || 'Feeling Sad / Crying',
        emoji: '🥺',
        bg: 'bg-blue-500/15 text-blue-300 border-blue-400/30',
        border: 'border-blue-500/30',
      };
    }
    return {
      label: moodStr || 'General Mood Check-in',
      emoji: '💭',
      bg: 'bg-purple-500/15 text-purple-300 border-purple-400/30',
      border: 'border-purple-500/30',
    };
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
                Watching over Jaganya J (Jany) &bull; Synchronized via SheetDB (Messages, Moods, SOS)
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
              onClick={fetchAllDashboardData}
              disabled={isLoading}
              title="Refresh all active sheets (messages, moods, sos)"
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-rose-400' : ''}`} />
              <span className="hidden sm:inline">Refresh All Sheets</span>
            </button>

            <button
              onClick={handleLockDesk}
              title="Lock private desk"
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-300 text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Daughter Notes Total Counter */}
          <div
            onClick={() => setActiveTab('messages')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'messages'
                ? 'bg-rose-500/10 border-rose-500/40 ring-1 ring-rose-500/40 shadow-lg shadow-rose-950/30'
                : 'glass-card hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-rose-300">
                Daughter Notes
              </span>
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center">
                <MessageSquareHeart className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-bold text-white">{messages.length}</span>
              {unreadCount > 0 && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Direct confidential notes from Jany</p>
          </div>

          {/* Card 2: Mood Check-ins Top Counter Badge */}
          <div
            onClick={() => setActiveTab('moods')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'moods'
                ? 'bg-blue-500/10 border-blue-500/40 ring-1 ring-blue-500/40 shadow-lg shadow-blue-950/30'
                : 'glass-card hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-blue-300">
                Mood Check-ins
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-bold text-white">{moods.length}</span>
              {moods.length > 0 && (
                <span className="text-xs text-blue-300 font-medium">
                  Latest: {getMoodBadgeInfo(moods[0].mood).emoji}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Daily heart logs & voice comfort</p>
          </div>

          {/* Card 3: SOS & Miss You Top Counter Badge */}
          <div
            onClick={() => setActiveTab('sos')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'sos'
                ? 'bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/40 shadow-lg shadow-amber-950/30'
                : 'glass-card hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-300">
                SOS & Miss You
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
                <BellRing className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-bold text-white">{sosAlerts.length}</span>
              <span className="text-xs text-amber-300 font-medium">Triggers</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Emergency comfort touch alerts</p>
          </div>

          {/* Card 4: Unbreakable Bond Note */}
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
                Zero judgment &bull; Complete protection &bull; SheetDB Live
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {/* Tab 1 Pill: Daughter Notes */}
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'messages'
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-950/50'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <MessageSquareHeart className="w-4 h-4" />
              <span>Daughter Notes</span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold">
                {messages.length}
              </span>
            </button>

            {/* Tab 2 Pill: Mood History Log */}
            <button
              onClick={() => setActiveTab('moods')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'moods'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/50'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <Smile className="w-4 h-4" />
              <span>Mood History Log</span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold">
                {moods.length}
              </span>
            </button>

            {/* Tab 3 Pill: SOS Alerts Log */}
            <button
              onClick={() => setActiveTab('sos')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'sos'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-950/50'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>SOS Alerts Log</span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold">
                {sosAlerts.length}
              </span>
            </button>
          </div>

          {/* Sub-filters for Messages Tab */}
          {activeTab === 'messages' && messages.length > 0 && (
            <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 text-xs self-start sm:self-auto">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filter === 'all'
                    ? 'bg-white/20 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({messages.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filter === 'unread'
                    ? 'bg-rose-500/30 text-rose-200 font-medium shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Needs Hug ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filter === 'read'
                    ? 'bg-emerald-500/30 text-emerald-200 font-medium shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Hugged ({messages.length - unreadCount})
              </button>
            </div>
          )}
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 1: DAUGHTER NOTES (CONFIDENTIAL MESSAGES)            */}
        {/* ======================================================== */}
        {activeTab === 'messages' && (
          <div className="space-y-6 animate-fadeIn">
            {isLoading && messages.length === 0 ? (
              <div className="p-16 rounded-3xl glass-card text-center border border-white/10 animate-pulse">
                <RefreshCw className="w-8 h-8 text-rose-400 animate-spin mx-auto mb-3" />
                <p className="text-sm font-semibold text-white">Fetching notes from Google Sheets...</p>
                <p className="text-xs text-slate-400 mt-1">Connecting to SheetDB messages endpoint</p>
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
                            <h4 className="font-bold text-white text-base">Jaganya J (Jany)</h4>

                            {/* Mood Tag */}
                            <span
                              className={`px-2.5 py-0.5 rounded-full border text-[11px] font-medium flex items-center gap-1 ${
                                getMoodBadgeInfo(moodTag).bg
                              }`}
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
                          className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
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
                          <span>
                            Memory she misses the most (Namma memories-la eppovum nyabagam varadhu):
                          </span>
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
        )}

        {/* ======================================================== */}
        {/* TAB 2: MOOD HISTORY LOG (SHEETDB sheet=moods)           */}
        {/* ======================================================== */}
        {activeTab === 'moods' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Mood Summary Header */}
            <div className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Smile className="w-5 h-5 text-blue-400" />
                  <span>Mood History Log</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Total of {moods.length} emotional logs recorded in Google Sheets via SheetDB
                </p>
              </div>

              {moods.length > 0 && (
                <div className="text-xs text-blue-300 bg-blue-500/10 border border-blue-400/20 px-3.5 py-1.5 rounded-xl font-medium">
                  Latest: {getMoodBadgeInfo(moods[0].mood).emoji} {moods[0].mood}
                </div>
              )}
            </div>

            {/* List of Mood Logs */}
            {isLoading && moods.length === 0 ? (
              <div className="p-16 rounded-3xl glass-card text-center border border-white/10 animate-pulse">
                <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-3" />
                <p className="text-sm font-semibold text-white">Fetching moods from Google Sheets...</p>
                <p className="text-xs text-slate-400 mt-1">Connecting to SheetDB moods sheet</p>
              </div>
            ) : moods.length === 0 ? (
              <div className="p-12 sm:p-16 rounded-3xl glass-card text-center border border-white/10">
                <Smile className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">No Mood Check-ins Logged Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  When Jany taps any mood in the Daily Heart Check section, it will log to Google Sheets
                  and appear here immediately.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {moods.map((entry, index) => {
                  const badge = getMoodBadgeInfo(entry.mood);
                  const relTime = getRelativeTime(entry.timestamp);

                  return (
                    <div
                      key={index}
                      className="p-5 rounded-2xl glass-card border border-white/10 hover:border-white/20 transition-all flex items-start gap-4 relative overflow-hidden"
                    >
                      <div className="text-3xl p-3 rounded-2xl bg-white/5 border border-white/10 flex-shrink-0">
                        {badge.emoji}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold ${badge.bg}`}
                          >
                            {entry.mood || badge.label}
                          </span>
                          {relTime && (
                            <span className="text-[11px] text-slate-400 whitespace-nowrap">
                              {relTime}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-400 font-mono mt-2 flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{entry.timestamp || 'Recent'}</span>
                        </p>

                        <div className="text-xs text-slate-300 mt-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                          <span className="truncate">
                            {entry.comfortNote || 'Listened to comfort note / song'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: SOS ALERTS LOG (SHEETDB sheet=sos)               */}
        {/* ======================================================== */}
        {activeTab === 'sos' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Quick Action Hotline Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-amber-950/80 border border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <BellRing className="w-5 h-5 text-rose-400" />
                  <span>Immediate Father Connection</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-lg">
                  Whenever Jany hits the emergency "Whenever You Miss Me" button in the sanctuary, you
                  are alerted here. You can reach out immediately.
                </p>
              </div>

              <a
                href="https://wa.me/?text=Hi%20da%20kannamma,%20Appa%20is%20thinking%20of%20you%20right%20now%20❤️"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all active:scale-95 flex-shrink-0"
              >
                <Phone className="w-4 h-4" />
                <span>Message Jany on WhatsApp</span>
              </a>
            </div>

            {/* List of SOS Alerts */}
            {isLoading && sosAlerts.length === 0 ? (
              <div className="p-16 rounded-3xl glass-card text-center border border-white/10 animate-pulse">
                <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-3" />
                <p className="text-sm font-semibold text-white">Fetching SOS alerts from Google Sheets...</p>
                <p className="text-xs text-slate-400 mt-1">Connecting to SheetDB sos sheet</p>
              </div>
            ) : sosAlerts.length === 0 ? (
              <div className="p-12 sm:p-16 rounded-3xl glass-card text-center border border-white/10">
                <CheckCircle2 className="w-12 h-12 text-emerald-400/80 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">No Active SOS Triggers</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  When Jany clicks "Whenever You Miss Me (Click Here)", instant records will be archived
                  here via Google Sheets.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sosAlerts.map((alert, index) => {
                  const relTime = getRelativeTime(alert.timestamp);

                  return (
                    <div
                      key={index}
                      className="p-5 rounded-2xl bg-slate-950/70 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-black/40"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center flex-shrink-0">
                          <BellRing className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-sm">
                              {alert.type || 'SOS / Miss You Triggered'}
                            </h4>
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
                              {alert.status || 'Active Alert'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Comfort touch signal triggered by Jany on the sanctuary
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right pl-14 sm:pl-0">
                        <p className="text-xs font-mono text-slate-300">
                          {alert.timestamp || 'Recent'}
                        </p>
                        {relTime && (
                          <p className="text-[11px] text-amber-400 font-semibold mt-0.5">
                            {relTime}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Admin Footer */}
      <footer className="mt-auto py-6 px-4 text-center border-t border-white/5 bg-slate-950/80 text-[11px] text-slate-500">
        <p>
          Appa's Private Monitoring Desk &bull; Completely Confidential &bull; For Jany's Father Only &bull; Synced with SheetDB (Messages, Moods, SOS)
        </p>
      </footer>
    </div>
  );
}
