"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Copy, CheckCircle2, Share2, ExternalLink } from "lucide-react";

export default function QuoteStudio() {
  const [quote, setQuote] = useState("Your future is created by what you do today, not tomorrow.");
  const [author, setAuthor] = useState("");
  const [copied, setCopied] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  function buildText() {
    return "https://kazispot.com";
  }

  async function downloadPoster() {
    if (!posterRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(posterRef.current, { scale: 2 });
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "KaziSpot-Quote.png";
    link.click();
  }

  function copyText() {
    navigator.clipboard.writeText(buildText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function shareNative() {
    const text = buildText();
    if (!navigator.share) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }
    try {
      let shared = false;
      if (posterRef.current) {
        const html2canvas = (await import("html2canvas")).default;
        const canvas = await html2canvas(posterRef.current, { scale: 2 });
        const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, "image/png"));
        if (blob) {
          const file = new File([blob], "kazispot-quote.png", { type: "image/png" });
          try {
            await navigator.share({ title: "KaziSpot", text, files: [file] });
            shared = true;
          } catch { /* files not supported */ }
        }
      }
      if (!shared) await navigator.share({ title: "KaziSpot", text });
    } catch { /* user cancelled */ }
  }

  function shareWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(buildText())}`, "_blank");
  }

  function shareX() {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(buildText())}`, "_blank");
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-blue-600 hover:underline mb-2 inline-flex items-center gap-2 font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Admin
            </Link>
            <h1 className="text-3xl font-extrabold text-gray-900">Quote Studio</h1>
            <p className="text-gray-500">Write a quote and turn it into a poster.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Editor */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <label className="block text-xs font-bold text-gray-700 mb-1">Your Quote</label>
              <textarea
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg text-sm font-serif"
              />
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <label className="block text-xs font-bold text-gray-700 mb-1">Author / Attribution (optional)</label>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. — KaziSpot"
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={downloadPoster} className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-2">
                <Download className="w-5 h-5" /> Download
              </button>
              <button onClick={copyText} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2">
                {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? "Copied!" : "Copy Text"}
              </button>
              <button onClick={shareNative} className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5" /> Share
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={shareWhatsApp} className="bg-[#25D366] text-white font-bold py-3 rounded-xl hover:opacity-90 transition">WhatsApp</button>
              <button onClick={shareX} className="bg-slate-900 text-white font-bold py-3 rounded-xl hover:opacity-90 transition">X (Twitter)</button>
            </div>
          </div>

          {/* Right: Poster preview */}
          <div className="flex justify-center items-start">
            <div className="bg-gray-200 p-6 rounded-xl border border-gray-300 w-full flex flex-col items-center">
              <div
                ref={posterRef}
                className="w-[540px] h-[540px] shrink-0 bg-gradient-to-br from-[#071022] via-[#0c1c38] to-[#16365f] text-white p-10 flex flex-col relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 via-blue-500 to-transparent"></div>
                <div className="absolute -top-16 -right-16 w-56 h-56 bg-sky-500/20 rounded-full"></div>
                <div className="absolute -bottom-20 -left-12 w-56 h-56 bg-blue-600/10 rounded-full"></div>

                {/* Header */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-extrabold text-base">K</div>
                    <span className="text-lg font-extrabold tracking-tight">KaziSpot</span>
                  </div>
                  <span className="text-[10px] font-bold bg-blue-600/20 border border-blue-400/40 text-blue-200 px-3 py-1 rounded-full uppercase tracking-widest">
                    Quote
                  </span>
                </div>

                {/* Quote + author centered */}
                <div className="flex-1 flex flex-col items-center justify-center relative z-10 text-center px-2">
                  <div className="text-sky-400 text-6xl font-serif leading-none mb-2">&ldquo;</div>
                  <p className="text-2xl font-serif leading-snug break-words">{quote}</p>
                  {author && (
                    <p className="text-sky-300 text-sm font-semibold mt-4 tracking-wide">{author}</p>
                  )}
                </div>

                {/* Footer */}
                <div className="relative z-10 pt-4 border-t border-white/10 flex items-end justify-between">
                  <div>
                    <p className="text-base font-extrabold tracking-tight">Your Work Awaits.</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">www.kazispot.com</p>
                  </div>
                </div>
              </div>

              {/* Clickable link BELOW the poster */}
              <a
                href="https://kazispot.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-blue-700 bg-white border border-gray-200 font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-blue-50 transition"
              >
                Visit kazispot.com
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
