"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Wand2 } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const hasToken = document.cookie.includes("admin_token=secret123");
    if (!hasToken) {
      router.push("/login");
    }
  }, [router]);

  const [magicText, setMagicText] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    applyUrl: "",
    description: "",
    expiresInDays: 30,
  });

  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🪄 THE MAGIC AI PARSER
  function handleMagicPaste() {
    if (!magicText.trim()) return;

    const lines = magicText.split("\n").map(l => l.trim()).filter(l => l !== "");
    
    // 1. Company is usually the first line
    const company = lines[0] || "";
    
    // 2. Title is usually the second line
    const title = lines[1] || "";
    
    // 3. Try to find a location keyword or just use the third line
    let location = lines[2] || "Nairobi, Kenya";
    if (location.toLowerCase().includes("full-time") || location.toLowerCase().includes("part-time")) {
       location = "Kenya"; // fallback if line 3 is job type
    }

    // 4. The rest is the description
    const description = lines.slice(3).join("\n\n");

    // 5. Auto-generate a Google search link as a fallback apply URL
    const applyUrl = `https://www.google.com/search?q=${encodeURIComponent(title + " " + company + " jobs Kenya")}`;

    setFormData({
      ...formData,
      company,
      title,
      location,
      description,
      applyUrl,
    });
    
    setMagicText(""); // Clear the magic box
    setStatus("✨ Fields auto-filled! Review them below.");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("Saving...");

    try {
      const res = await fetch(`${window.location.origin}/api/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("✅ Job posted successfully!");
        setFormData({ title: "", company: "", location: "", applyUrl: "", description: "", expiresInDays: 30 });
      } else {
        setStatus("❌ Failed to post job.");
      }
    } catch (error) {
      setStatus("❌ Network error.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block font-medium">
          ← Back to public site
        </Link>
        
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-2xl font-extrabold text-gray-900">Admin: Post a Local Job</h1>
            
            <div className="flex items-center gap-3">
              <Link 
                href="/admin/talent" 
                className="text-sm text-blue-600 hover:underline font-bold bg-blue-50 px-4 py-2 rounded-lg"
              >
                View Talent Pool
              </Link>
              
              <button 
                onClick={() => { 
                  document.cookie = "admin_token=; max-age=0"; 
                  window.location.href = "/login"; 
                }} 
                className="text-sm text-red-600 hover:underline font-bold bg-red-50 px-4 py-2 rounded-lg"
              >
                Log out
              </button>
            </div>
          </div>

          {/* 🪄 MAGIC PASTE SECTION */}
          <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl mb-8">
            <h2 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
              <Wand2 className="w-4 h-4" /> Magic Paste (Auto-fill)
            </h2>
            <p className="text-xs text-indigo-700 mb-3">Paste the raw job text from LinkedIn, WhatsApp, or email below.</p>
            <textarea 
              value={magicText}
              onChange={(e) => setMagicText(e.target.value)}
              rows={4}
              placeholder="Paste job description here..."
              className="w-full px-4 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm mb-3"
            />
            <button 
              type="button" 
              onClick={handleMagicPaste}
              className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Auto-Fill Form
            </button>
          </div>

          {/* Standard Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application URL or Email</label>
              <input required value={formData.applyUrl} onChange={e => setFormData({...formData, applyUrl: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expires in (Days)</label>
              <input type="number" required value={formData.expiresInDays} onChange={e => setFormData({...formData, expiresInDays: Number(e.target.value)})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Description (HTML allowed)</label>
              <textarea required rows={8} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono"></textarea>
            </div>
            
            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 mt-4">
              {isSubmitting ? "Publishing..." : "Publish Job"}
            </button>
          </form>
          
          {status && <p className="mt-4 text-center font-medium">{status}</p>}
        </div>
      </div>
    </main>
  );
}