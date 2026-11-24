"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function AdminSettings() {
  const [confirm, setConfirm] = useState(90);
  const [pending, setPending] = useState(70);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setConfirm(data.confirm ?? 90);
          setPending(data.pending ?? 70);
        }
      } catch (e) {
        console.error("Failed to load settings", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function save() {
    setSaving(true);
    setStatus("");
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm, pending }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("✅ Settings saved.");
      } else {
        setStatus("❌ " + (data.error || "Failed to save."));
      }
    } catch (e) {
      setStatus("❌ Network error.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <Link href="/admin" className="text-blue-600 hover:underline mb-4 inline-flex items-center gap-2 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Admin
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Duplicate Settings</h1>
        <p className="text-gray-500 mb-8">Configure the similarity thresholds used to flag duplicates.</p>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
          {loading ? (
            <p className="text-gray-500 text-center py-8">Loading...</p>
          ) : (
            <>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Confirm threshold (very likely duplicate)</label>
                <p className="text-xs text-gray-500 mb-2">Jobs scoring at or above this are marked "likely duplicate".</p>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={confirm}
                  onChange={(e) => setConfirm(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Pending threshold (possible duplicate)</label>
                <p className="text-xs text-gray-500 mb-2">Jobs scoring at or above this (but below confirm) are marked "possible duplicate".</p>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={pending}
                  onChange={(e) => setPending(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={save}
                disabled={saving}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Settings"}
              </button>

              {status && <p className="text-center text-sm font-medium">{status}</p>}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
