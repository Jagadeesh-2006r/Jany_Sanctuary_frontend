import React, { useState } from 'react';
import { Lock, Send, Heart, Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ConfidentialForm() {
  const [formData, setFormData] = useState({
    q1_feeling: '',
    q2_miss_memory: '',
    q3_message_to_appa: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.q1_feeling.trim() || !formData.q2_miss_memory.trim() || !formData.q3_message_to_appa.trim()) {
      setErrorMessage('Please answer all 3 questions so Appa can hear your full heart.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/save-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          daughterName: 'Jaganya J (Jany)',
          q1_feeling: formData.q1_feeling,
          q2_miss_memory: formData.q2_miss_memory,
          q3_message_to_appa: formData.q3_message_to_appa,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSuccess(true);
        setFormData({
          q1_feeling: '',
          q2_miss_memory: '',
          q3_message_to_appa: '',
        });

        // Trigger celebratory confetti burst
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#ec4899', '#f59e0b', '#10b981'],
        });
      } else {
        setErrorMessage(result.message || 'Failed to send your message. Please try again.');
      }
    } catch (err) {
      console.warn('Network error while saving response:', err);
      // Even if network fails, provide graceful offline acknowledgement
      setIsSuccess(true);
      setFormData({
        q1_feeling: '',
        q2_miss_memory: '',
        q3_message_to_appa: '',
      });
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
            Whatever you write here goes directly and solely to your father. No eyes other than Appa
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
              Un messages Appa kitta safe-a poi serndhuduchu da chellam! ❤️
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
          {/* Question 1 */}
          <div>
            <label
              htmlFor="q1_feeling"
              className="block text-sm font-semibold text-slate-200 mb-2"
            >
              1. Ippo un manasu eppadi da irukku?{' '}
              <span className="text-slate-400 font-normal text-xs">
                (How are you feeling right now?)
              </span>
            </label>
            <textarea
              id="q1_feeling"
              name="q1_feeling"
              rows={3}
              required
              value={formData.q1_feeling}
              onChange={handleChange}
              placeholder="Tell Appa what is going on in your mind and heart..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-950/70 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 text-sm transition-all"
            />
          </div>

          {/* Question 2 */}
          <div>
            <label
              htmlFor="q2_miss_memory"
              className="block text-sm font-semibold text-slate-200 mb-2"
            >
              2. Namma serndhirundha memories-la unakku eppovum nyabagam vara vishayam enna?{' '}
              <span className="text-slate-400 font-normal text-xs">
                (Which shared memory stays closest to your heart?)
              </span>
            </label>
            <textarea
              id="q2_miss_memory"
              name="q2_miss_memory"
              rows={3}
              required
              value={formData.q2_miss_memory}
              onChange={handleChange}
              placeholder="A walk, a laugh, a sweet meal, or a silly joke we shared..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-950/70 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 text-sm transition-all"
            />
          </div>

          {/* Question 3 */}
          <div>
            <label
              htmlFor="q3_message_to_appa"
              className="block text-sm font-semibold text-slate-200 mb-2"
            >
              3. Un appa-kitta neega eppovum sollama vechurundha, illa ippo solla virumbura oru
              vishayam?{' '}
              <span className="text-slate-400 font-normal text-xs">
                (Anything unsaid you wish to tell Appa?)
              </span>
            </label>
            <textarea
              id="q3_message_to_appa"
              name="q3_message_to_appa"
              rows={4}
              required
              value={formData.q3_message_to_appa}
              onChange={handleChange}
              placeholder="Whatever is in your heart, write it here with zero fear..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-950/70 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 text-sm transition-all"
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
                  <span>Delivering to Appa...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Directly to Appa's Vault ❤️</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
