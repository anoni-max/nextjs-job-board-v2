"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, Trash2, Pencil, Eye, EyeOff } from "lucide-react";

const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm";

function compressImage(file: File, maxWidth = 1400, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("no ctx"));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function toDateStr(d?: string | Date | null): string {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export default function JobAdsAdmin() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [applyUrl, setApplyUrl] = useState("");
  const [placement, setPlacement] = useState("homepage");
  const [priority, setPriority] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadAds();
  }, []);

  async function loadAds() {
    try {
      const res = await fetch("/api/job-ads?admin=1");
      if (res.ok) {
        const data = await res.json();
        setAds(data.ads || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleFile(file: File) {
    const okTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!okTypes.includes(file.type)) {
      setStatus("❌ Only JPG, PNG or WebP images are allowed.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setStatus("❌ File too large (max 10MB).");
      return;
    }
    try {
      const data = await compressImage(file);
      if (data.length > 4_000_000) {
        setStatus("❌ Image still too large. Use a smaller image.");
        return;
      }
      setImageData(data);
      setStatus("");
    } catch (e) {
      setStatus("❌ Failed to read image.");
    }
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setCaption("");
    setDescription("");
    setApplyUrl("");
    setPlacement("homepage");
    setPriority(0);
    setStartDate("");
    setExpiryDate("");
    setImageData(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function addAd() {
    if (!imageData) {
      setStatus("❌ Please choose an image.");
      return;
    }
    setBusy(true);
    setStatus("");
    try {
      const res = await fetch("/api/job-ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData, title, caption, description, applyUrl, placement, priority, startDate, expiryDate }),
      });
      if (res.ok) {
        setStatus("✅ Ad added.");
        resetForm();
        loadAds();
      } else {
        const d = await res.json().catch(() => ({}));
        setStatus("❌ " + (d.error || "Failed to add."));
      }
    } catch (e) {
      setStatus("❌ Network error.");
    } finally {
      setBusy(false);
    }
  }

  async function saveEdit() {
    if (!editingId) return;
    setBusy(true);
    setStatus("");
    try {
      const body: any = { id: editingId, title, caption, description, applyUrl, placement, priority, startDate, expiryDate };
      if (imageData) body.imageData = imageData;
      const res = await fetch("/api/job-ads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setStatus("✅ Changes saved.");
        resetForm();
        loadAds();
      } else {
        const d = await res.json().catch(() => ({}));
        setStatus("❌ " + (d.error || "Failed to save."));
      }
    } catch (e) {
      setStatus("❌ Network error.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(ad: any) {
    await fetch("/api/job-ads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: ad.id, active: !ad.active }),
    });
    loadAds();
  }

  async function deleteAd(id: string) {
    if (!confirm("Delete this ad? This cannot be undone.")) return;
    await fetch("/api/job-ads", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (editingId === id) resetForm();
    loadAds();
  }

  function editAd(ad: any) {
    setEditingId(ad.id);
    setTitle(ad.title || "");
    setCaption(ad.caption || "");
    setDescription(ad.description || "");
    setApplyUrl(ad.applyUrl || "");
    setPlacement(ad.placement || "homepage");
    setPriority(ad.priority || 0);
    setStartDate(toDateStr(ad.startDate));
    setExpiryDate(toDateStr(ad.expiryDate));
    setImageData(null);
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Link href="/admin" className="text-blue-600 hover:underline mb-4 inline-flex items-center gap-2 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Admin
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Image Job Advertisements</h1>
        <p className="text-gray-500 mb-8">Upload and manage sponsored job ad images.</p>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
          <h2 className="font-bold text-gray-900 mb-4">{editingId ? "Edit Ad" : "Add New Ad"}</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Image (JPG, PNG or WebP) *</label>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="w-full text-sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} placeholder="Ad title" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Caption (short)</label>
                <input value={caption} onChange={(e) => setCaption(e.target.value)} className={inputCls} placeholder="Short caption" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={inputCls} placeholder="Optional description" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Target URL (click destination)</label>
              <input value={applyUrl} onChange={(e) => setApplyUrl(e.target.value)} className={inputCls} placeholder="https://..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Placement</label>
                <select value={placement} onChange={(e) => setPlacement(e.target.value)} className={inputCls}>
                  <option value="homepage">Homepage carousel</option>
                  <option value="jobs">Jobs page sidebar</option>
                  <option value="sidebar">Sidebar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Priority (higher shows first)</label>
                <input type="number" value={priority} onChange={(e) => setPriority(Number(e.target.value))} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Start date (optional)</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Expiry date (optional)</label>
                <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className={inputCls} />
              </div>
            </div>

            {imageData && (
              <div className="border border-gray-200 rounded-lg p-2 max-w-xs">
                <img src={imageData} alt="Preview" className="w-full h-auto rounded" />
              </div>
            )}

            <div className="flex gap-2">
              {editingId ? (
                <>
                  <button onClick={saveEdit} disabled={busy} className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300">
                    {busy ? "Saving..." : "Save Changes"}
                  </button>
                  <button onClick={resetForm} className="bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                </>
              ) : (
                <button onClick={addAd} disabled={busy} className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300 inline-flex items-center gap-2">
                  <Upload className="w-4 h-4" /> {busy ? "Adding..." : "Add Ad"}
                </button>
              )}
            </div>

            {status && <p className="text-sm font-medium">{status}</p>}
          </div>
        </div>

        {/* List */}
        <h2 className="font-bold text-gray-900 mb-4">Existing Ads ({ads.length})</h2>

        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : ads.length === 0 ? (
          <p className="text-gray-500">No ads yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ads.map((ad) => (
              <div key={ad.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <img src={ad.imageData} alt={ad.title || ad.caption || "Ad"} className="w-full h-auto bg-slate-50" />
                <div className="p-3 space-y-1.5 text-sm">
                  {(ad.title || ad.caption) && <p className="font-bold text-gray-900 truncate">{ad.title || ad.caption}</p>}
                  <p className="text-xs text-gray-400">
                    {ad.placement} · Priority {ad.priority}
                  </p>
                  {ad.expiryDate && (
                    <p className="text-xs text-gray-400">Expires: {new Date(ad.expiryDate).toLocaleDateString()}</p>
                  )}
                  {ad.applyUrl && <p className="text-xs text-gray-400 break-all">{ad.applyUrl}</p>}

                  <div className="flex items-center gap-2 pt-1">
                    <button onClick={() => toggleActive(ad)} className={`text-xs font-bold px-2.5 py-1 rounded ${ad.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {ad.active ? <Eye className="w-3.5 h-3.5 inline mr-1" /> : <EyeOff className="w-3.5 h-3.5 inline mr-1" />}
                      {ad.active ? "Active" : "Inactive"}
                    </button>
                    <button onClick={() => editAd(ad)} className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1">
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button onClick={() => deleteAd(ad.id)} className="text-xs font-bold text-red-600 hover:underline inline-flex items-center gap-1 ml-auto">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
