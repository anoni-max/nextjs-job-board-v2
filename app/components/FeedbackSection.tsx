"use client";

import { useState } from "react";
import { Star, Send, CheckCircle2 } from "lucide-react";

export default function FeedbackSection() {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      setStatus("error");
      setMessage("Please fill in your name and feedback.");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), comment: comment.trim(), rating }),
      });
      if (res.ok) {
        setStatus("success");
        setMessage("Thank you! Your feedback has been submitted for review.");
        setName("");
        setComment("");
        setRating(0);
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <section className="bg-white py-16 px-4" id="feedback">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
          What People Say About KaziSpot
        </h2>
        <p className="text-gray-600 mb-8">
          Your feedback matters! Share your experience with KaziSpot and help us improve our service.
        </p>

        <form onSubmit={handleSubmit} className="bg-slate-50 border border-gray-200 rounded-2xl p-6 text-left space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your feedback</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Tell us about your experience..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1"
                  aria-label={`${n} star`}
                >
                  <Star
                    className={`w-7 h-7 ${
                      n <= (hoverRating || rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition disabled:bg-blue-400 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            {status === "submitting" ? "Submitting..." : "Submit Feedback"}
          </button>

          {status === "success" && (
            <p className="flex items-center gap-2 text-green-600 font-medium text-sm">
              <CheckCircle2 className="w-4 h-4" /> {message}
            </p>
          )}
          {status === "error" && (
            <p className="text-red-600 text-sm font-medium">{message}</p>
          )}
        </form>
      </div>
    </section>
  );
}
