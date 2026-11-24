"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft, Download, Copy, CheckCircle2, Share2, ExternalLink,
  Sparkles, Loader2, X,
} from "lucide-react";

export default function QuoteStudio() {
  const [quote, setQuote] = useState("Your future is created by what you do today, not tomorrow.");
  const [author, setAuthor] = useState("");
  const [copied, setCopied] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  // AI photo state
  const [photoPrompt, setPhotoPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [genError, setGenError] = useState("");

  // Photo on the poster
  const [posterImage, setPosterImage] = useState<string | null>(null);
  const [photoSize, setPhotoSize] = useState(200);
  const [photoPos, setPhotoPos] = useState({ x: 170, y: 150 });
  const dragRef = useRef<{ offsetX: number; offsetY: number } | null>(null);

  function buildText() {
    return "https://kazispot.com";
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

  async function generateImage() {
    if (!photoPrompt.trim()) return;
    setGenerating(true);
    setGenError("");
    setGeneratedImage(null);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: photoPrompt.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.imageUrl) {
        setGeneratedImage(data.imageUrl);
      } else {
        setGenError(data.error || "Image generation failed.");
      }
    } catch (e) {
      setGenError("Network error. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  function addToPoster() {
    if (!generatedImage) return;
    setPosterImage(generatedImage);
    setPhotoPos({ x: 170, y: 150 });
    setPhotoSize(200);
  }

  function removePhoto() {
    setPosterImage(null);
  }

  function handlePhotoPointerDown(e: React.PointerEvent<HTMLImageElement>) {
    e.stopPropagation();
    const rect = posterRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragRef.current = {
      offsetX: e.clientX - rect.left - photoPos.x,
      offsetY: e.clientY - rect.top - photoPos.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePhotoPointerMove(e: React.PointerEvent<HTMLImageElement>) {
    if (!dragRef.current) return;
    const rect = posterRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left - dragRef.current.offsetX;
    const y = e.clientY - rect.top - dragRef.current.offsetY;
    setPhotoPos({
      x: Math.max(0, Math.min(540 - photoSize, x)),
      y: Math.max(0, Math.min(540 - photoSize, y)),
    });
  }

  function handlePhotoPointerUp() {
    dragRef.current = null;
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
            <p className="text-gray-500">Write a quote, generate a photo, and turn it into a poster.</p>
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

            {/* AI Photo Generation */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" /> AI Photo
              </h2>
              <label className="block text-xs font-bold text-gray-700 mb-1">Describe the photo you want</label>
              <textarea
                value={photoPrompt}
                onChange={(e) => setPhotoPrompt(e.target.value)}
                rows={3}
                placeholder="e.g. A confident Kenyan professional in a smart suit, standing in a bright modern office, natural light"
                className="w-full px-3 py-2 border rounded-lg text-sm mb-3"
              />
              <button
                onClick={generateImage}
                disabled={generating || !photoPrompt.trim()}
                className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300 flex items-center justify-center gap-2"
              >
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {generating ? "Generating..." : "Generate with AI"}
              </button>

              {genError && <p className="text-red-500 text-sm mt-2 text-center">{genError}</p>}

              {generatedImage && (
                <div className="mt-4">
                  <img src={generatedImage} alt="Generated preview" className="w-full rounded-lg border border-gray-200" />
                  <button
                    onClick={addToPoster}
                    className="w-full mt-2 bg-emerald-600 text-white font-bold py-2.5 rounded-lg hover:bg-emerald-700 transition"
                  >
                    Add to Poster
                  </button>
                </div>
              )}
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

                {/* Generated photo (draggable, behind the text) */}
                {posterImage && (
                  <img
                    src={posterImage}
                    alt="Generated"
                    draggable={false}
                    onPointerDown={handlePhotoPointerDown}
                    onPointerMove={handlePhotoPointerMove}
                    onPointerUp={handlePhotoPointerUp}
                    style={{ left: photoPos.x, top: photoPos.y, width: photoSize, height: photoSize }}
                    className="absolute z-10 object-cover rounded-2xl border border-white/20 shadow-2xl cursor-move select-none"
                  />
                )}

                {/* Header */}
                <div className="flex items-center justify-between relative z-20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-extrabold text-base">K</div>
                    <span className="text-lg font-extrabold tracking-tight drop-shadow">KaziSpot</span>
                  </div>
                  <span className="text-[10px] font-bold bg-blue-600/20 border border-blue-400/40 text-blue-200 px-3 py-1 rounded-full uppercase tracking-widest">
                    Quote
                  </span>
                </div>

                {/* Quote + author centered */}
                <div className="flex-1 flex flex-col items-center justify-center relative z-20 text-center px-2">
                  <div className="text-sky-400 text-6xl font-serif leading-none mb-2 drop-shadow">&ldquo;</div>
                  <p className="text-2xl font-serif leading-snug break-words drop-shadow">{quote}</p>
                  {author && (
                    <p className="text-sky-300 text-sm font-semibold mt-4 tracking-wide drop-shadow">{author}</p>
                  )}
                </div>

                {/* Footer */}
                <div className="relative z-20 pt-4 border-t border-white/10 flex items-end justify-between">
                  <div>
                    <p className="text-base font-extrabold tracking-tight drop-shadow">Your Work Awaits.</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">www.kazispot.com</p>
                  </div>
                </div>
              </div>

              {/* Photo controls (outside the poster) */}
              {posterImage && (
                <div className="mt-4 w-full max-w-[540px]">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Photo size — {photoSize}px
                  </label>
                  <input
                    type="range"
                    min={100}
                    max={420}
                    value={photoSize}
                    onChange={(e) => setPhotoSize(Number(e.target.value))}
                    className="w-full"
                  />
                  <button
                    onClick={removePhoto}
                    className="mt-2 inline-flex items-center gap-1 text-sm text-red-600 hover:underline font-semibold"
                  >
                    <X className="w-4 h-4" /> Remove photo
                  </button>
                </div>
              )}

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
