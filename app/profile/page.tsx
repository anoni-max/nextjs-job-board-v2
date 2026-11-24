"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Save, ArrowLeft } from "lucide-react";

const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-1.5">{hint}</p>}
      {children}
    </div>
  );
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  const [form, setForm] = useState({
    education: "",
    qualifications: "",
    workExperience: "",
    skills: "",
    certifications: "",
    preferredIndustries: "",
    preferredTitles: "",
    preferredLocations: "",
    preferredCountries: "",
    expectedSalary: "",
    employmentType: "",
    workPreference: "",
    cvConsent: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setForm({
              education: data.education || "",
              qualifications: data.qualifications || "",
              workExperience: data.workExperience || "",
              skills: data.skills || "",
              certifications: data.certifications || "",
              preferredIndustries: data.preferredIndustries || "",
              preferredTitles: data.preferredTitles || "",
              preferredLocations: data.preferredLocations || "",
              preferredCountries: data.preferredCountries || "",
              expectedSalary: data.expectedSalary || "",
              employmentType: data.employmentType || "",
              workPreference: data.workPreference || "",
              cvConsent: Boolean(data.cvConsent),
            });
          }
        }
      } catch (e) {
        console.error("Failed to load profile", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus("");
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setStatus("✅ Profile saved.");
      else setStatus("❌ Failed to save.");
    } catch (e) {
      setStatus("❌ Network error.");
    } finally {
      setSaving(false);
    }
  }

  const set = (key: string, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-gray-500">Loading profile…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/matches" className="text-blue-600 hover:underline mb-4 inline-flex items-center gap-2 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to my matches
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Your Profile</h1>
        <p className="text-gray-500 mb-8">Tell us about yourself so we can find the best jobs for you.</p>

        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
          <Field label="Education" hint="e.g. BSc. Electrical Engineering, University of Nairobi">
            <textarea value={form.education} onChange={(e) => set("education", e.target.value)} rows={2} className={inputCls} />
          </Field>

          <Field label="Qualifications">
            <textarea value={form.qualifications} onChange={(e) => set("qualifications", e.target.value)} rows={2} className={inputCls} />
          </Field>

          <Field label="Work Experience" hint="Roles, companies and years">
            <textarea value={form.workExperience} onChange={(e) => set("workExperience", e.target.value)} rows={3} className={inputCls} />
          </Field>

          <Field label="Skills" hint="Separate with commas, e.g. Python, Electrical wiring, Customer service">
            <textarea value={form.skills} onChange={(e) => set("skills", e.target.value)} rows={2} className={inputCls} />
          </Field>

          <Field label="Certifications">
            <input value={form.certifications} onChange={(e) => set("certifications", e.target.value)} className={inputCls} />
          </Field>

          <Field label="Preferred Industries" hint="e.g. Engineering, Finance, Healthcare">
            <input value={form.preferredIndustries} onChange={(e) => set("preferredIndustries", e.target.value)} className={inputCls} />
          </Field>

          <Field label="Preferred Job Titles">
            <input value={form.preferredTitles} onChange={(e) => set("preferredTitles", e.target.value)} className={inputCls} />
          </Field>

          <Field label="Preferred Locations" hint="e.g. Nairobi, Mombasa">
            <input value={form.preferredLocations} onChange={(e) => set("preferredLocations", e.target.value)} className={inputCls} />
          </Field>

          <Field label="Preferred Countries">
            <input value={form.preferredCountries} onChange={(e) => set("preferredCountries", e.target.value)} className={inputCls} />
          </Field>

          <Field label="Expected Salary" hint="e.g. KSh 50,000 - 80,000">
            <input value={form.expectedSalary} onChange={(e) => set("expectedSalary", e.target.value)} className={inputCls} />
          </Field>

          <Field label="Employment Type">
            <select value={form.employmentType} onChange={(e) => set("employmentType", e.target.value)} className={inputCls}>
              <option value="">Any</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
          </Field>

          <Field label="Work Preference">
            <select value={form.workPreference} onChange={(e) => set("workPreference", e.target.value)} className={inputCls}>
              <option value="">Any</option>
              <option>Remote</option>
              <option>Hybrid</option>
              <option>On-site</option>
            </select>
          </Field>

          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.cvConsent} onChange={(e) => set("cvConsent", e.target.checked)} className="mt-0.5" />
            I consent to KaziSpot using my profile information to recommend jobs.
          </label>

          <button type="submit" disabled={saving} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition disabled:bg-blue-300 flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Profile"}
          </button>

          {status && <p className="text-center font-medium">{status}</p>}
        </form>
      </div>
    </main>
  );
}
