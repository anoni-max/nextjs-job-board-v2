"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Check, X, Trash2, Star } from "lucide-react";

export default function AdminFeedback() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await fetch("/api/feedback?admin=1");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function setApproved(id: string, approved: boolean) {
    await fetch("/api/feedback", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, approved }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this feedback?")) return;
    await fetch("/api/feedback", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/admin" className="text-blue-600 hover:underline mb-4 inline-flex items-center gap-2 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Admin
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Manage Feedback</h1>
        <p className="text-gray-500 mb-8">Review and approve visitor feedback before it appears publicly.</p>

        {loading ? (
          <p className="text-gray-500 text-center py-12">Loading…</p>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No feedback yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className={`bg-white rounded-xl border p-4 ${item.approved ? "border-gray-200" : "border-amber-200 bg-amber-50/40"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-gray-900">{item.name}</p>
                    {item.rating && (
                      <div className="flex gap-0.5 mt-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className={`w-4 h-4 ${i <= item.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                        ))}
                      </div>
                    )}
                    <p className="text-gray-600 mt-2">{item.comment}</p>
                    <p className="text-xs text-gray-400 mt-2">{new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  {item.approved ? (
                    <button onClick={() => setApproved(item.id, false)} className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded hover:bg-gray-200 inline-flex items-center gap-1">
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  ) : (
                    <button onClick={() => setApproved(item.id, true)} className="text-xs font-bold text-white bg-green-600 px-3 py-1.5 rounded hover:bg-green-700 inline-flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                  )}
                  <button onClick={() => remove(item.id)} className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded hover:bg-red-100 inline-flex items-center gap-1">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
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
