"use client";

import { useState } from "react";
import { Star, Send } from "lucide-react";

const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm";

export default function FeedbackSection() {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [website, setWebsite] = useState("");
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
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-2">Share Your Feedback</h2>
        <p className="text-gray-500 text-center mb-8">
          Your feedback matters! Share your experience with KaziSpot and help us improve our service.
        </p>

        <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" />

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} placeholder="Your name" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Your feedback *</label>
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
    </section>
  );
}
