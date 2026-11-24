"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";

export default function DuplicateReview() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchDuplicates() {
    try {
      const res = await fetch("/api/jobs/duplicates");
      if (res.ok) {
        setItems(await res.json());
      }
    } catch (e) {
      console.error("Failed to fetch duplicates", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDuplicates();
  }, []);

  async function handleAction(id: string, action: string) {
    try {
      await fetch("/api/jobs/duplicate-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      fetchDuplicates();
    } catch (e) {
      console.error("Action failed", e);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin" className="text-blue-600 hover:underline mb-4 inline-flex items-center gap-2 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Admin
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Duplicate Review</h1>
        <p className="text-gray-500 mb-8">Review incoming jobs that may duplicate existing listings.</p>

        {loading ? (
          <p className="text-gray-500 text-center py-12">Loading...</p>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <AlertTriangle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No duplicate matches to review.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
                  <span className="font-bold text-amber-900">{Math.round(item.duplicateScore)}% match</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    item.duplicateStatus === "confirmed"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {item.duplicateStatus === "confirmed" ? "Likely duplicate" : "Possible duplicate"}
                  </span>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-xl p-4">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-2">Incoming job</p>
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.company}</p>
                    <p className="text-sm text-gray-500 mt-1">📍 {item.location}</p>
                    {item.applyUrl && <p className="text-xs text-gray-400 mt-1 break-all">{item.applyUrl}</p>}
                    {item.applyEmail && <p className="text-xs text-gray-400 mt-1 break-all">{item.applyEmail}</p>}
                  </div>

                  <div className="border border-gray-200 rounded-xl p-4">
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Existing job</p>
                    {item.matchedJob ? (
                      <>
                        <h3 className="font-bold text-gray-900">{item.matchedJob.title}</h3>
                        <p className="text-sm text-gray-600">{item.matchedJob.company}</p>
                        <p className="text-sm text-gray-500 mt-1">📍 {item.matchedJob.location}</p>
                        {item.matchedJob.applyUrl && <p className="text-xs text-gray-400 mt-1 break-all">{item.matchedJob.applyUrl}</p>}
                        {item.matchedJob.applyEmail && <p className="text-xs text-gray-400 mt-1 break-all">{item.matchedJob.applyEmail}</p>}
                      </>
                    ) : (
                      <p className="text-sm text-gray-400">(original job no longer available)</p>
                    )}
                  </div>
                </div>

                {item.duplicateReasons && (
                  <div className="px-6 pb-4">
                    <p className="text-sm text-gray-600 bg-slate-50 border border-slate-100 rounded-lg p-3">
                      <strong>Why it matches:</strong> {item.duplicateReasons}
                    </p>
                  </div>
                )}

                <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleAction(item.id, "confirm")}
                    className="bg-red-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Confirm duplicate
                  </button>
                  <button
                    onClick={() => handleAction(item.id, "not-duplicate")}
                    className="bg-green-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Not a duplicate
                  </button>
                  <button
                    onClick={() => handleAction(item.id, "keep-both")}
                    className="bg-gray-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                  >
                    Keep both
                  </button>
                  <button
                    onClick={() => handleAction(item.id, "reject")}
                    className="bg-white text-red-600 border border-red-300 font-bold px-4 py-2 rounded-lg hover:bg-red-50 transition"
                  >
                    Reject incoming
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
