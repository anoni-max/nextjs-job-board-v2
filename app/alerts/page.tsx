"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Bell, RefreshCw } from "lucide-react";

const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm";

export default function AlertsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState("");

  const [form, setForm] = useState({
    alertFrequency: "daily",
    emailAlerts: false,
    whatsappAlerts: false,
    whatsappNumber: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/alerts/preferences");
        if (res.ok) {
          const data = await res.json();
          setForm({
            alertFrequency: data.alertFrequency || "daily",
            emailAlerts: Boolean(data.emailAlerts),
            whatsappAlerts: Boolean(data.whatsappAlerts),
            whatsappNumber: data.whatsappNumber || "",
          });
        }
      } catch (e) {
        console.error("Failed to load preferences", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus("");
    try {
      const res = await fetch("/api/alerts/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setStatus("✅ Preferences saved.");
      else setStatus("❌ " + (data.error || "Failed to save."));
    } catch (e) {
      setStatus("❌ Network error.");
    } finally {
      setSaving(false);
    }
  }

  async function checkNow() {
    setChecking(true);
    setStatus("");
    try {
      const res = await fetch("/api/alerts/check", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus(`🔔 ${data.created} new match${data.created === 1 ? "" : "es"} added to your notifications.`);
      } else {
        setStatus("❌ " + (data.error || "Check failed."));
      }
    } catch (e) {
      setStatus("❌ Network error.");
    } finally {
      setChecking(false);
    }
  }

  const set = (key: string, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-gray-500">Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <Link href="/matches" className="text-blue-600 hover:underline mb-4 inline-flex items-center gap-2 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to my matches
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Job Alerts</h1>
        <p className="text-gray-500 mb-8">Get notified when jobs match your profile.</p>

        <form onSubmit={save} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Alert frequency</label>
            <select value={form.alertFrequency} onChange={(e) => set("alertFrequency", e.target.value)} className={inputCls}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="off">Off</option>
            </select>
          </div>

          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.emailAlerts} onChange={(e) => set("emailAlerts", e.target.checked)} className="mt-0.5" />
            <span><strong>Email alerts</strong> — send matches to my email</span>
          </label>

          <div>
            <label className="flex items-start gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.whatsappAlerts} onChange={(e) => set("whatsappAlerts", e.target.checked)} className="mt-0.5" />
              <span><strong>WhatsApp alerts</strong> — send matches to WhatsApp</span>
            </label>
            {form.whatsappAlerts && (
              <input
                value={form.whatsappNumber}
                onChange={(e) => set("whatsappNumber", e.target.value)}
                placeholder="e.g. +2547XXXXXXXX"
                className={inputCls + " mt-2"}
              />
            )}
          </div>

          <button type="submit" disabled={saving} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition disabled:bg-blue-300 flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Preferences"}
          </button>

          <button type="button" onClick={checkNow} disabled={checking} className="w-full bg-white text-slate-900 font-bold py-3 rounded-xl border border-gray-300 hover:bg-slate-50 transition disabled:opacity-50 flex items-center justify-center gap-2">
            <RefreshCw className={`w-4 h-4 ${checking ? "animate-spin" : ""}`} /> {checking ? "Checking..." : "Check for new matches now"}
          </button>

          {status && <p className="text-center font-medium">{status}</p>}

          <Link href="/notifications" className="block text-center text-sm text-blue-600 font-semibold hover:underline">
            <Bell className="w-4 h-4 inline mr-1" /> View my notifications
          </Link>
        </form>
      </div>
    </main>
  );
}
