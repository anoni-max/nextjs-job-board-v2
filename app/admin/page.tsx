"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Wand2 } from "lucide-react";

export default function AdminDashboard() {
  const [magicText, setMagicText] = useState("");
  const [drafts, setDrafts] = useState<any[]>([]);
  const [rejectedJobs, setRejectedJobs] = useState<any[]>([]);
  const [editingJob, setEditingJob] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    applyUrl: "",
    applyEmail: "",
    description: "",
    expiresInDays: 30,
  });

  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const fetchRejected = async () => {
    try {
      const res = await fetch("/api/jobs/rejected");
      if (res.ok) {
        const data = await res.json();
        setRejectedJobs(data);
      }
    } catch (error) {
      console.error("Failed to fetch rejected jobs");
    }
  };

  useEffect(() => {
    fetchDrafts();
    fetchRejected();
  }, []);

  async function approveJob(id: string) {
    try {
      await fetch("/api/jobs/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchDrafts();
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
      fetchDrafts();
      fetchRejected();
    } catch (error) {
      console.error("Failed to reject");
    }
  }

  async function restoreJob(id: string) {
    try {
      await fetch("/api/jobs/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchRejected();
      fetchDrafts();
    } catch (error) {
      console.error("Failed to restore");
    }
  }

  async function deleteJob(id: string) {
    if (!confirm("Permanently delete this job? This cannot be undone.")) return;
    try {
      await fetch("/api/jobs/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchRejected();
    } catch (error) {
      console.error("Failed to delete");
    }
  }

  function openEdit(job: any) {
    setEditForm({
      id: job.id,
      title: job.title || "",
      company: job.company || "",
      location: job.location || "",
      description: job.description || "",
      applyUrl: job.applyUrl || "",
      applyEmail: job.applyEmail || "",
      salary: job.salary || "",
      employmentType: job.employmentType || "",
      positions: job.positions || "",
      qualifications: job.qualifications || "",
      responsibilities: job.responsibilities || "",
      deadline: job.expiresAt ? new Date(job.expiresAt).toISOString().slice(0, 10) : "",
    });
    setEditingJob(job);
  }

  async function saveEdit() {
    try {
      await fetch("/api/jobs/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      setEditingJob(null);
      fetchDrafts();
    } catch (error) {
      console.error("Failed to update");
    }
  }

  async function saveEditAndApprove() {
    try {
      await fetch("/api/jobs/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      await fetch("/api/jobs/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editForm.id }),
      });
      setEditingJob(null);
      fetchDrafts();
    } catch (error) {
      console.error("Failed to save & approve");
    }
  }

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

    // Try to detect an application email in the pasted text
    const emails = magicText.match(/[\w.+-]+@[\w-]+\.[\w.]+/g) || [];
    const applyEmail = emails.find((e: string) => !/unsubscribe|notification|alert|noreply/i.test(e)) || "";

    setFormData({
      ...formData,
      company,
      title,
      location,
      description,
      applyUrl,
      applyEmail,
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
        setFormData({ title: "", company: "", location: "", applyUrl: "", applyEmail: "", description: "", expiresInDays: 30 });
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

              <Link
                href="/admin/marketing"
                className="text-sm text-emerald-600 hover:underline font-bold bg-emerald-50 px-4 py-2 rounded-lg"
              >
                Marketing Studio
              </Link>


              <button
                onClick={async () => {
                  await fetch("/api/auth/logout", { method: "POST" });
                  window.location.href = "/login";
                }}
                className="text-sm text-red-600 hover:underline font-bold bg-red-50 px-4 py-2 rounded-lg"
              >
                Log out
              </button>
            </div>
          </div>

          {/* Pending Queue */}
          {drafts.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl mb-8">
              <h2 className="text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
                ⚠️ Pending Approval ({drafts.length})
              </h2>
              <div className="space-y-3">
                {drafts.map((draft) => (
                  <div key={draft.id} className="bg-white p-4 rounded-lg border border-amber-100 shadow-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-gray-900">{draft.title}</h3>
                        <p className="text-sm text-gray-500">{draft.company} · {draft.location}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(draft)}
                          className="bg-blue-500 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-600 transition shadow-sm"
                        >
                          Edit
                        </button>
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
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rejected Queue */}
          {rejectedJobs.length > 0 && (
            <div className="bg-red-50 border border-red-200 p-5 rounded-xl mb-8">
              <h2 className="text-sm font-bold text-red-900 mb-3 flex items-center gap-2">
                🗑️ Rejected ({rejectedJobs.length})
              </h2>
              <div className="space-y-3">
                {rejectedJobs.map((job) => (
                  <div key={job.id} className="bg-white p-4 rounded-lg border border-red-100 flex justify-between items-center shadow-sm">
                    <div>
                      <h3 className="font-bold text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-500">{job.company} · {job.location}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => restoreJob(job.id)}
                        className="bg-gray-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-gray-700 transition shadow-sm"
                      >
                        Restore
                      </button>
                      <button
                        onClick={() => deleteJob(job.id)}
                        className="bg-red-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-red-700 transition shadow-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Magic Paste */}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Application URL</label>
              <input value={formData.applyUrl} onChange={e => setFormData({...formData, applyUrl: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://company.com/careers/job (optional if email provided)" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Email</label>
              <input value={formData.applyEmail} onChange={e => setFormData({...formData, applyEmail: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="hr@company.co.ke (optional if URL provided)" />
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

      {/* Edit Modal */}
      {editingJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-extrabold text-gray-900 mb-4">Edit Job</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input value={editForm.company} onChange={e => setEditForm({...editForm, company: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input value={editForm.location} onChange={e => setEditForm({...editForm, location: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                  <input value={editForm.salary} onChange={e => setEditForm({...editForm, salary: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                  <input value={editForm.employmentType} onChange={e => setEditForm({...editForm, employmentType: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Positions</label>
                  <input value={editForm.positions} onChange={e => setEditForm({...editForm, positions: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <input type="date" value={editForm.deadline} onChange={e => setEditForm({...editForm, deadline: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apply URL</label>
                  <input value={editForm.applyUrl} onChange={e => setEditForm({...editForm, applyUrl: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apply Email</label>
                  <input value={editForm.applyEmail} onChange={e => setEditForm({...editForm, applyEmail: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities (one per line)</label>
                <textarea rows={4} value={editForm.responsibilities} onChange={e => setEditForm({...editForm, responsibilities: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications (one per line)</label>
                <textarea rows={4} value={editForm.qualifications} onChange={e => setEditForm({...editForm, qualifications: e.target.value})} className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm" />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setEditingJob(null)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-bold hover:bg-gray-100">Cancel</button>
              <button onClick={saveEdit} className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700">Save Changes</button>
              <button onClick={saveEditAndApprove} className="px-4 py-2 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700">Save & Approve</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
