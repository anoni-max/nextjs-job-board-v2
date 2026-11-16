"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";

export default function JoinTalent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    education: "",
    bio: "",
  });

  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("Submitting...");

    try {
      const res = await fetch(`${window.location.origin}/api/candidates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("✅ Profile submitted successfully! Employers can now find you.");
        setFormData({ name: "", email: "", phone: "", skills: "", education: "", bio: "" });
      } else {
        setStatus("❌ Failed to submit profile.");
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
        <Link href="/" className="text-blue-600 hover:underline mb-6 inline-flex items-center gap-2 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to jobs
        </Link>
        
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-full">
              <UserPlus className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Join the Talent Pool</h1>
              <p className="text-gray-500 text-sm">Let top employers find you.</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
                <input required value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})} placeholder="e.g., Bachelor's in CS, Self-taught" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Top Skills (comma separated)</label>
              <input required value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} placeholder="e.g., React, Customer Service, Data Entry" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Bio (Optional)</label>
              <textarea rows={3} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} placeholder="Tell employers a bit about yourself..." className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
            </div>
            
            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition disabled:bg-blue-400">
              {isSubmitting ? "Submitting..." : "Submit Profile"}
            </button>
          </form>
          
          {status && <p className="mt-4 text-center font-medium text-gray-800">{status}</p>}
        </div>
      </div>
    </main>
  );
}