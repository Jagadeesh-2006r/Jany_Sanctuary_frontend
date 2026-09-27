import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Unlock,
  KeyRound,
  RefreshCw,
  MessageSquareHeart,
  Heart,
  AlertTriangle,
  Smile,
  Frown,
  Activity,
  Calendar,
  Clock,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Phone,
  Eye,
  EyeOff,
  LogOut,
  BellRing,
  Inbox,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const DEFAULT_PINS = ['appa123', 'janyappa', 'jaganya2007'];

export default function AppaPrivateDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('appa_desk_unlocked') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [showPin, setShowPin] = useState(false);

  const [activeTab, setActiveTab] = useState('messages'); // 'messages' | 'moods' | 'sos'
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  // Data states
  const [messages, setMessages] = useState([]);
  const [moods, setMoods] = useState([]);
  const [sosAlerts, setSosAlerts] = useState([]);
  const [updatingMessageId, setUpdatingMessageId] = useState(null);

  // Filter for messages: 'all' | 'unread' | 'read'
  const [messageFilter, setMessageFilter] = useState('all');

  const handleUnlock = (e) => {
    if (e) e.preventDefault();
    const normalized = pinInput.trim().toLowerCase();

    if (DEFAULT_PINS.includes(normalized)) {
      setPinError('');
      setIsAuthenticated(true);
      sessionStorage.setItem('appa_desk_unlocked', 'true');
      fetchDashboardData();

      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#fbbf24', '#3b82f6'],
        });
      } catch (err) {
        // fallback
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

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [messagesRes, moodsRes, sosRes] = await Promise.all([
        fetch('http://localhost:5000/api/messages').then((r) => r.json()),
        fetch('http://localhost:5000/api/moods').then((r) => r.json()),
        fetch('http://localhost:5000/api/sos-alerts').then((r) => r.json()),
      ]);

      if (messagesRes && messagesRes.success) {
        setMessages(messagesRes.data || []);
      }
      if (moodsRes && moodsRes.success) {
        setMoods(moodsRes.data || []);
      }
      if (sosRes && sosRes.success) {
        setSosAlerts(sosRes.data || []);
      }

      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const handleToggleReadStatus = async (id, currentStatus) => {
    setUpdatingMessageId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/messages/${id}/read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: !currentStatus }),
      });
      const data = await res.json();

      if (data.success && data.data) {
        setMessages((prev) =>
          prev.map((msg) => (msg._id === id ? { ...msg, isRead: data.data.isRead, readAt: data.data.readAt } : msg))
        );

        if (!currentStatus) {
          try {
            confetti({
              particleCount: 25,
              spread: 50,
              origin: { y: 0.5 },
              colors: ['#f43f5e', '#fb7185', '#fda4af'],
            });
          } catch (e) {}
        }
      }
    } catch (err) {
      console.error('Error toggling read status:', err);
    } finally {
      setUpdatingMessageId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch (e) {
      return dateStr;
    }
  };

  const getRelativeTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      const diffMs = new Date() - new Date(dateStr);
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch (e) {
      return '';
    }
  };

  const getMoodBadge = (moodKey) => {
    const map = {
      sad: { label: 'Feeling Sad / Crying', emoji: '🥺', bg: 'bg-blue-500/10 text-blue-300 border-blue-400/30' },
      missing_appa: { label: 'Missing Appa Badly', emoji: '💔', bg: 'bg-rose-500/10 text-rose-300 border-rose-400/30' },
      stressed: { label: 'Stressed / Overwhelmed', emoji: '😫', bg: 'bg-amber-500/10 text-amber-300 border-amber-400/30' },
      happy: { label: 'Happy & Smiling', emoji: '😊', bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-400/30' },
    };
    return map[moodKey] || { label: moodKey, emoji: '💭', bg: 'bg-slate-500/10 text-slate-300 border-slate-500/30' };
  };

  const unreadMessagesCount = messages.filter((m) => !m.isRead).length;

  const filteredMessages = messages.filter((m) => {
    if (messageFilter === 'unread') return !m.isRead;
    if (messageFilter === 'read') return m.isRead;
    return true;
  });

  // ==========================================
  // Password / PIN Gate Screen
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07090e] text-slate-100 flex items-center justify-center p-4 selection:bg-rose-500/30 selection:text-rose-200">
        {/* Subtle Ambient Background */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-md w-full rounded-3xl bg-slate-900/90 border border-rose-500/20 p-8 sm:p-10 shadow-2xl shadow-black/90 backdrop-blur-2xl text-center">
          {/* Top Shield Emblem */}
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
                  Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Watching over Jaganya J (Jany) &bull; Private Sanctuary Record
              </p>
            </div>
          </div>

          {/* Quick Actions & Timestamps */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
            {lastRefreshed && (
              <span className="text-[11px] text-slate-400 hidden md:flex items-center gap-1 mr-2">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>Synced {formatDate(lastRefreshed)}</span>
              </span>
            )}

            <button
              onClick={fetchDashboardData}
              disabled={isLoading}
              title="Refresh all data"
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-rose-400' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
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

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Confidential Messages */}
          <div
            onClick={() => setActiveTab('messages')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'messages'
                ? 'bg-rose-500/10 border-rose-500/40 ring-1 ring-rose-500/40'
                : 'glass-card hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                Daughter Notes
              </span>
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center">
                <MessageSquareHeart className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{messages.length}</span>
              {unreadMessagesCount > 0 && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500 text-white animate-pulse">
                  {unreadMessagesCount} unread
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Direct confidential answers to Appa</p>
          </div>

          {/* Card 2: Mood Logs */}
          <div
            onClick={() => setActiveTab('moods')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'moods'
                ? 'bg-blue-500/10 border-blue-500/40 ring-1 ring-blue-500/40'
                : 'glass-card hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                Mood Check-ins
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{moods.length}</span>
              {moods.length > 0 && (
                <span className="text-xs text-blue-300">
                  Latest: {getMoodBadge(moods[0].mood).emoji}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Emotional pulse & audio listening</p>
          </div>

          {/* Card 3: SOS Alerts */}
          <div
            onClick={() => setActiveTab('sos')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'sos'
                ? 'bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/40'
                : 'glass-card hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                SOS & Miss You
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
                <BellRing className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{sosAlerts.length}</span>
              <span className="text-xs text-amber-300">Comfort triggers</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Hero button & voice note alerts</p>
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
                Zero judgment &bull; Complete protection
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'messages'
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-950/50'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <MessageSquareHeart className="w-4 h-4" />
              <span>Confidential Messages</span>
              {unreadMessagesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white text-rose-600 text-[10px] font-bold">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('moods')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'moods'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/50'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Mood History Log</span>
              <span className="text-[11px] opacity-70">({moods.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('sos')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'sos'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-950/50'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>SOS Alerts Log</span>
              <span className="text-[11px] opacity-70">({sosAlerts.length})</span>
            </button>
          </div>

          {/* Messages filter sub-actions */}
          {activeTab === 'messages' && messages.length > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setMessageFilter('all')}
                className={`px-2.5 py-1 rounded-lg ${
                  messageFilter === 'all' ? 'bg-white/20 text-white font-medium' : 'text-slate-400'
                }`}
              >
                All ({messages.length})
              </button>
              <button
                onClick={() => setMessageFilter('unread')}
                className={`px-2.5 py-1 rounded-lg ${
                  messageFilter === 'unread' ? 'bg-rose-500/30 text-rose-200 font-medium' : 'text-slate-400'
                }`}
              >
                Unread ({unreadMessagesCount})
              </button>
              <button
                onClick={() => setMessageFilter('read')}
                className={`px-2.5 py-1 rounded-lg ${
                  messageFilter === 'read' ? 'bg-emerald-500/30 text-emerald-200 font-medium' : 'text-slate-400'
                }`}
              >
                Hugged ({messages.length - unreadMessagesCount})
              </button>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* TAB 1: Confidential Messages / Her Answers              */}
        {/* ======================================================== */}
        {activeTab === 'messages' && (
          <div className="space-y-6 animate-fadeIn">
            {filteredMessages.length === 0 ? (
              <div className="p-12 rounded-3xl glass-card text-center border border-white/10">
                <Inbox className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">
                  {messageFilter === 'unread'
                    ? 'All messages have been hugged & read! ❤️'
                    : 'No confidential messages recorded yet.'}
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  When Jany fills out the 1-on-1 private form on the sanctuary, her answers will appear
                  here immediately.
                </p>
              </div>
            ) : (
              filteredMessages.map((msg, index) => (
                <div
                  key={msg._id || index}
                  className={`rounded-3xl p-6 sm:p-8 border transition-all duration-300 relative overflow-hidden ${
                    msg.isRead
                      ? 'bg-slate-900/60 border-white/10'
                      : 'bg-gradient-to-br from-slate-900 via-rose-950/20 to-slate-900 border-rose-500/40 shadow-xl shadow-rose-950/30'
                  }`}
                >
                  {/* Status header banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10 mb-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                          msg.isRead
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        #{filteredMessages.length - index}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-base">
                            {msg.daughterName || 'Jaganya J (Jany)'}
                          </h4>
                          {msg.isRead ? (
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
                        <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{formatDate(msg.submittedAt)}</span>
                          <span>&bull;</span>
                          <span className="text-rose-300">{getRelativeTime(msg.submittedAt)}</span>
                          {msg.readAt && (
                            <>
                              <span>&bull;</span>
                              <span className="text-emerald-400">Read on {formatDate(msg.readAt)}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Action button: Mark as Read / Hugged */}
                    <div>
                      <button
                        onClick={() => handleToggleReadStatus(msg._id, msg.isRead)}
                        disabled={updatingMessageId === msg._id}
                        className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                          msg.isRead
                            ? 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                            : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-lg shadow-rose-950/50'
                        }`}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            msg.isRead ? 'text-slate-400' : 'fill-white text-white animate-bounce'
                          }`}
                        />
                        <span>{msg.isRead ? 'Mark as Unread' : 'Mark as Read / Hugged ❤️'}</span>
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
                        {msg.q1_feeling}
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
                        {msg.q2_miss_memory}
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
                        "{msg.q3_message_to_appa}"
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: Mood History Log                                 */}
        {/* ======================================================== */}
        {activeTab === 'moods' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Mood Summary Breakdown */}
            <div className="p-6 rounded-3xl glass-card border border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-base">Emotional State Pulse</h3>
                <p className="text-xs text-slate-400">Total of {moods.length} mood events recorded</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {['happy', 'missing_appa', 'stressed', 'sad'].map((k) => {
                  const info = getMoodBadge(k);
                  const count = moods.filter((m) => m.mood === k).length;
                  return (
                    <span
                      key={k}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 ${info.bg}`}
                    >
                      <span>{info.emoji}</span>
                      <span>{info.label.split('/')[0]}</span>
                      <span className="font-bold ml-1">({count})</span>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* List of Mood Logs */}
            {moods.length === 0 ? (
              <div className="p-12 rounded-3xl glass-card text-center border border-white/10">
                <Smile className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">No Mood Logs Yet</h3>
                <p className="text-xs text-slate-400">
                  When Jany taps any mood in the Daily Heart Check section, it will log here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {moods.map((log, index) => {
                  const badge = getMoodBadge(log.mood);
                  return (
                    <div
                      key={log._id || index}
                      className="p-5 rounded-2xl glass-card border border-white/10 hover:border-white/20 transition-all flex items-start gap-4"
                    >
                      <div className="text-3xl p-2 rounded-2xl bg-white/5 border border-white/10 flex-shrink-0">
                        {badge.emoji}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-semibold text-white text-sm">{badge.label}</h4>
                          <span className="text-[11px] text-slate-400 whitespace-nowrap">
                            {getRelativeTime(log.loggedAt)}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {formatDate(log.loggedAt)}
                        </p>

                        {log.note && (
                          <p className="text-xs text-slate-300 mt-2 p-2 rounded-lg bg-white/5 border border-white/5">
                            Note: {log.note}
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

        {/* ======================================================== */}
        {/* TAB 3: SOS Alerts Log                                   */}
        {/* ======================================================== */}
        {activeTab === 'sos' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Quick Action Hotline Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-amber-950/80 border border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <BellRing className="w-5 h-5 text-rose-400" />
                  <span>Immediate Father Connection</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-lg">
                  Whenever Jany hits the emergency button in the sanctuary, you are alerted here. You can
                  reach out immediately.
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
            {sosAlerts.length === 0 ? (
              <div className="p-12 rounded-3xl glass-card text-center border border-white/10">
                <CheckCircle2 className="w-12 h-12 text-emerald-400/80 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">No Active SOS Triggers</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  When Jany taps "Whenever You Miss Me (Click Here)", instant records will be archived
                  here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sosAlerts.map((alert, index) => (
                  <div
                    key={alert._id || index}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">
                            {alert.source || 'Panic / SOS Trigger'}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-semibold uppercase">
                            Emergency Touch
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {alert.note || 'Emergency comfort alert triggered by Jany'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right sm:text-right pl-13 sm:pl-0">
                      <p className="text-xs font-mono text-slate-300">
                        {formatDate(alert.triggeredAt)}
                      </p>
                      <p className="text-[11px] text-amber-400 font-semibold">
                        {getRelativeTime(alert.triggeredAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Admin Footer */}
      <footer className="mt-auto py-6 px-4 text-center border-t border-white/5 bg-slate-950/80 text-[11px] text-slate-500">
        <p>
          Appa's Private Monitoring Desk &bull; Completely Confidential &bull; For Jany's Father Only
        </p>
      </footer>
    </div>
  );
}
