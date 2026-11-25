"use client";

import { useState } from "react";
import { MessageCircle, X, Star, Send } from "lucide-react";

const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm";

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [website, setWebsite] = useState(""); // honeypot
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, comment, rating, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("✅ Thank you! Your feedback has been submitted for review.");
        setName("");
        setComment("");
        setRating(0);
        setTimeout(() => setOpen(false), 1500);
      } else {
        setStatus("❌ " + (data.error || "Failed to submit."));
      }
    } catch (e) {
      setStatus("❌ Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-40 bg-blue-600 text-white rounded-full px-3 py-3 shadow-lg hover:bg-blue-700 transition flex flex-col items-center gap-0.5"
        aria-label="Feedback"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-[10px] font-semibold leading-none">Feedback</span>
      </button>

      {/* Popup */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-extrabold text-gray-900">Share Your Feedback</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-5">
              We'd love to hear about your experience with KaziSpot. Your feedback helps us improve our service.
            </p>

            <form onSubmit={submit} className="space-y-4">
              {/* Honeypot */}
              <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" />

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Name *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} placeholder="Your name" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Comment *</label>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} required rows={4} className={inputCls} placeholder="Tell us about your experience..." />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Rating (optional)</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button key={i} type="button" onClick={() => setRating(i)} className="p-1">
                      <Star className={`w-6 h-6 ${i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={busy} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition disabled:bg-blue-300 inline-flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> {busy ? "Submitting..." : "Submit Feedback"}
              </button>

              {status && <p className="text-center font-medium">{status}</p>}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
