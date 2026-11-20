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
  const [drafts, setDrafts] = useState<any[]>([]);

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

  // Fetch Draft Jobs
  const fetchDrafts = async () => {
    try {
      const res = await fetch("/api/jobs/drafts");
      if (res.ok) {
        const data = await res.json();
        setDrafts(data);
      }
    } catch (error) {
      console.error("Failed to fetch drafts");
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  async function approveJob(id: string) {
    try {
      await fetch("/api/jobs/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchDrafts(); // Refresh the list
    } catch (error) {
      console.error("Failed to approve");
    }
  }

  async function rejectJob(id: string) {
    try {
      await fetch("/api/jobs/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchDrafts(); // Refresh the list
    } catch (error) {
      console.error("Failed to reject");
    }
  }

  // 🪄 THE MAGIC AI PARSER
  function handleMagicPaste() {
    if (!magicText.trim()) return;

    const lines = magicText.split("\n").map(l => l.trim()).filter(l => l !== "");

    const company = lines[0] || "";
    const title = lines[1] || "";

    let location = lines[2] || "Nairobi, Kenya";
    if (location.toLowerCase().includes("full-time") || location.toLowerCase().includes("part-time")) {
       location = "Kenya";
    }

    const description = lines.slice(3).join("\n\n");
    const applyUrl = `https://www.google.com/search?q=${encodeURIComponent(title + " " + company + " jobs Kenya")}`;

    setFormData({
      ...formData,
      company,
      title,
      location,
      description,
      applyUrl,
    });

    setMagicText("");
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
            <h1 className="text-2xl font-extrabold text-gray-900">Admin: Post a Job</h1>

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

          {/* Draft Queue */}
          {drafts.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl mb-8">
              <h2 className="text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
                ⚠️ Pending Approval ({drafts.length})
              </h2>
              <div className="space-y-3">
                {drafts.map((draft) => (
                  <div key={draft.id} className="bg-white p-4 rounded-lg border border-amber-100 flex justify-between items-center shadow-sm">
                    <div>
                      <h3 className="font-bold text-gray-900">{draft.title}</h3>
                      <p className="text-sm text-gray-500">{draft.company} · {draft.location}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveJob(draft.id)}
                        className="bg-green-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectJob(draft.id)}
                        className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg hover:bg-red-600 transition shadow-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
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
