"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, CheckCheck, ArrowLeft } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (e) {
      console.error("Failed to load notifications", e);
    } finally {
      setLoading(false);
    }
  }

  async function markAllRead() {
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    load();
  }

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/alerts" className="text-blue-600 hover:underline mb-4 inline-flex items-center gap-2 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to alerts
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Notifications</h1>
          {unread > 0 && (
            <button onClick={markAllRead} className="text-sm text-blue-600 font-semibold hover:underline inline-flex items-center gap-1">
              <CheckCheck className="w-4 h-4" /> Mark all read
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-gray-500 text-center py-12">Loading…</p>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`bg-white rounded-xl border p-4 ${n.read ? "border-gray-200" : "border-blue-300 bg-blue-50/50"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{n.title}</p>
                    <p className="text-gray-600 text-sm mt-0.5">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                  {!n.read && <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-blue-600 mt-1.5"></span>}
                </div>
                {n.jobId && (
                  <Link href={`/jobs/${n.jobId}`} className="inline-block mt-2 text-sm text-blue-600 font-semibold hover:underline">
                    View job →
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
