"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Copy, CheckCircle2, Share2 } from "lucide-react";

export default function QuoteStudio() {
  const [quote, setQuote] = useState("Your future is created by what you do today, not tomorrow.");
  const [author, setAuthor] = useState("");
  const [copied, setCopied] = useState(false);
  const [createdAt, setCreatedAt] = useState<string>("");
  const posterRef = useRef<HTMLDivElement>(null);

  // Capture the date and time when the poster is generated/loaded
  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    setCreatedAt(formattedDate);
  }, [quote, author]); // Updates if the user types a new quote or author

  function buildText() {
    return `"${quote}"${author ? `\n\n— ${author}` : ""}\n\nYour Work Awaits.\nhttps://kazispot.com\n#KaziSpot #JobsInKenya #Motivation`;
  }

  async function downloadPoster() {
    if (!posterRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(posterRef.current, { scale: 2, useCORS: true });
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
        const canvas = await html2canvas(posterRef.current, { scale: 2, useCORS: true });
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
                rows={5}
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
              
              {/* POSTER WRAPPER */}
              <div 
                ref={posterRef} 
                className="w-[540px] h-[540px] shrink-0 relative flex flex-col rounded-xl overflow-hidden shadow-2xl"
                style={{
                  boxShadow: '0 0 0 3px #1a5c3a, 0 10px 30px rgba(0,0,0,0.5)',
                  background: 'linear-gradient(135deg, #081735 0%, #0d2a5c 100%)'
                }}
              >
                {/* Decorative Circles */}
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full z-0"></div>
                <div className="absolute -bottom-20 -left-12 w-64 h-64 bg-blue-600/10 rounded-full z-0"></div>

                {/* Main Content Area */}
                <div className="flex-1 p-10 flex flex-col relative z-10">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center font-bold text-lg text-white shadow-sm">K</div>
                      <span className="text-xl font-bold tracking-tight text-white">KaziSpot</span>
                    </div>
                    <span className="text-[10px] font-bold bg-transparent border border-blue-500 text-blue-300 px-4 py-1.5 rounded-full uppercase tracking-widest">
                      Quote
                    </span>
                  </div>

                  {/* Quote Area */}
                  <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
                    <div className="text-sky-400 text-5xl font-serif leading-none mb-4">&ldquo;</div>
                    <p className="text-[28px] text-white font-serif leading-snug break-words">
                      {quote}
                    </p>
                    {author && (
                      <p className="text-sky-300 text-sm font-semibold mt-4 tracking-wide">{author}</p>
                    )}
                  </div>

                  {/* Inner Footer */}
                  <div className="mt-auto">
                    <div className="border-t border-white/10 pt-4 mb-1">
                      <p className="text-lg font-bold tracking-tight text-white mb-0.5">Your Work Awaits.</p>
                      <p className="text-xs text-slate-400">www.kazispot.com</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Green Bar (Link & Timestamp) */}
                <div className="bg-[#14532d] px-6 py-3 flex items-center justify-between relative z-10 w-full mt-auto">
                  <a 
                    href="https://kazispot.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#4ade80] hover:text-[#86efac] hover:underline text-[15px] transition-colors"
                  >
                    https://kazispot.com
                  </a>
                  
                  {/* Interactive Timestamp */}
                  <div 
                    className="text-gray-300 text-xs cursor-default hover:text-white transition-colors group flex items-center gap-1.5"
                    title={`Poster created on: ${createdAt}`}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:opacity-100">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>{createdAt || "Generating..."}</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}