import React, { useState } from 'react';
import { Lock, Send, Heart, Sparkles, CheckCircle2, AlertCircle, Loader2, Smile } from 'lucide-react';
import confetti from 'canvas-confetti';

const SHEETDB_API_URL = "https://sheetdb.io/api/v1/9re3gyz5uidx1";

const QUICK_MOODS = [
  { id: 'happy', label: 'Happy & Peaceful', emoji: '😊' },
  { id: 'missing_appa', label: 'Missing Appa Badly', emoji: '💔' },
  { id: 'feeling_low', label: 'Feeling Low / Emotional', emoji: '🥺' },
  { id: 'stressed', label: 'Stressed / Overwhelmed', emoji: '😫' },
  { id: 'love_appa', label: 'Love You Appa ❤️', emoji: '💖' },
];

export default function ConfidentialForm({ currentMood: propMood = '' }) {
  const [formData, setFormData] = useState({
    feeling: '',
    memory: '',
    messageToAppa: '',
  });

  const [currentMood, setCurrentMood] = useState(propMood);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectMood = (label) => {
    setCurrentMood((prev) => (prev === label ? '' : label));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.feeling.trim() || !formData.memory.trim() || !formData.messageToAppa.trim()) {
      setErrorMessage('Please answer all 3 questions so Appa can hear your full heart.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        data: [
          {
            timestamp: new Date().toLocaleString(),
            feeling: formData.feeling.trim(),
            memory: formData.memory.trim(),
            messageToAppa: formData.messageToAppa.trim(),
            mood: currentMood || "General Note"
          }
        ]
      };

      console.log('Sending confidential message directly to SheetDB:', payload);

      const response = await fetch(SHEETDB_API_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && (result.created || result.status === 200 || result.status === 201 || result.data)) {
        console.log('✅ SheetDB accepted response successfully:', result);
        setIsSuccess(true);
        setFormData({
          feeling: '',
          memory: '',
          messageToAppa: '',
        });
        setCurrentMood('');

        // Trigger celebratory confetti burst
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f43f5e', '#ec4899', '#f59e0b', '#10b981'],
          });
        } catch (e) {
          // ignore if canvas not supported
        }
      } else {
        const errorMsg = result?.message || result?.error || 'Failed to send your message to SheetDB. Please try again.';
        console.error('❌ SheetDB error response:', response.status, result);
        setErrorMessage(errorMsg);
      }
    } catch (err) {
      console.error('❌ Network error submitting to SheetDB:', err);
      setErrorMessage(`Network error connecting to Google Sheets: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="glass-card rounded-3xl p-6 sm:p-12 border border-rose-500/20 shadow-2xl relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-gradient-to-b from-rose-600/15 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>Private & Confidential — 1-on-1 Space</span>
          </div>

          <h2 className="font-cursive text-4xl sm:text-6xl text-white text-glow mb-2">
            Jany's Heart to Appa
          </h2>

          <p className="text-slate-400 text-xs sm:text-sm">
            Whatever you write here goes directly and solely to your father's vault. No eyes other than Appa
            will ever read this. Speak freely from your soul.
          </p>
        </div>

        {/* Success Alert Banner */}
        {isSuccess && (
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border border-emerald-400/40 text-center animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-300" />
            </div>
            <h4 className="text-lg font-bold text-white font-serif mb-1">
              Un message Appa kitta safe-a poi serndhuduchu da ma! 
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              Appa has received every single word you wrote. Thank you for opening your heart to me.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="mt-4 text-xs text-emerald-300 underline hover:text-emerald-200"
            >
              Write another note
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Optional Mood Tag Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-rose-400" />
              <span>Current Mood Tag (Optional):</span>
              <span className="text-[11px] text-slate-500 font-normal">
                {currentMood ? `Selected: "${currentMood}"` : '(Defaults to "General Note")'}
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {QUICK_MOODS.map((item) => {
                const isSelected = currentMood === item.label;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectMood(item.label)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all border ${
                      isSelected
                        ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-950/50 scale-105'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
              {currentMood && (
                <button
                  type="button"
                  onClick={() => setCurrentMood('')}
                  className="px-2.5 py-1 text-[11px] text-slate-400 hover:text-slate-200 underline"
                >
                  Clear tag
                </button>
              )}
            </div>
          </div>

          {/* Question 1 */}
          <div>
            <label
              htmlFor="feeling"
              className="block text-sm font-semibold text-slate-200 mb-2"
            >
              1. Ippo un manasu eppadi da irukku?{' '}
              <span className="text-slate-400 font-normal text-xs">
                (How are you feeling right now?)
              </span>
            </label>
            <textarea
              id="feeling"
              name="feeling"
              rows={3}
              required
              disabled={isSubmitting}
              value={formData.feeling}
              onChange={handleChange}
              placeholder="Tell Appa what is going on in your mind and heart..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-950/70 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 text-sm transition-all disabled:opacity-60"
            />
          </div>

          {/* Question 2 */}
          <div>
            <label
              htmlFor="memory"
              className="block text-sm font-semibold text-slate-200 mb-2"
            >
              2. Namma serndhirundha memories-la unakku eppovum nyabagam vara vishayam enna?{' '}
              <span className="text-slate-400 font-normal text-xs">
                (Which shared memory stays closest to your heart?)
              </span>
            </label>
            <textarea
              id="memory"
              name="memory"
              rows={3}
              required
              disabled={isSubmitting}
              value={formData.memory}
              onChange={handleChange}
              placeholder="A walk, a laugh, a sweet meal, or a silly joke we shared..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-950/70 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 text-sm transition-all disabled:opacity-60"
            />
          </div>

          {/* Question 3 */}
          <div>
            <label
              htmlFor="messageToAppa"
              className="block text-sm font-semibold text-slate-200 mb-2"
            >
              3. Un appa-kitta nee eppovum sollama vechurundha, illa ippo solla virumbura oru
              vishayam?{' '}
              <span className="text-slate-400 font-normal text-xs">
                (Anything unsaid you wish to tell Appa?)
              </span>
            </label>
            <textarea
              id="messageToAppa"
              name="messageToAppa"
              rows={4}
              required
              disabled={isSubmitting}
              value={formData.messageToAppa}
              onChange={handleChange}
              placeholder="Whatever is in your heart, write it here with zero fear..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-950/70 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 text-sm transition-all disabled:opacity-60"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-base shadow-xl shadow-rose-950/50 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Delivering to Appa's Vault...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Directly to Appa's Vault </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
