"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, Users, Eye, BarChart3, Clock, MousePointerClick,
  Search, Globe, Smartphone, Activity,
} from "lucide-react";

function getCookie(name: string) {
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? m[1] : "";
}


const RANGES = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "90d", label: "90 days" },
];

const CHART_METRICS = [
  { key: "activeUsers", label: "Active users" },
  { key: "totalUsers", label: "Total users" },
  { key: "pageViews", label: "Page views" },
  { key: "sessions", label: "Sessions" },
];

function fmtDate(ymd: string) {
  if (!/^\d{8}$/.test(ymd)) return ymd;
  const d = new Date(`${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}`);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function AdminAnalytics() {
  const [range, setRange] = useState("7d");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [metric, setMetric] = useState("activeUsers");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    params.set("range", range);
    if (range === "custom") {
      if (!customStart || !customEnd) { setLoading(false); return; }
      params.set("start", customStart);
      params.set("end", customEnd);
    }
    fetch(`/api/admin/analytics?${params.toString()}`, {
  headers: { "x-admin-token": getCookie("admin_token") },
})
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error || "Failed to load analytics");
        if (!cancelled) setData(json);
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [range, customStart, customEnd]);

  const trendMax = data?.trend?.length
    ? Math.max(1, ...data.trend.map((t: any) => t[metric] || 0))
    : 1;

  const t = data?.totals;

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <Link href="/admin" className="text-blue-600 hover:underline mb-2 inline-flex items-center gap-2 font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Admin
            </Link>
            <h1 className="text-3xl font-extrabold text-gray-900">Website Analytics</h1>
            {data?.updatedAt && (
              <p className="text-xs text-gray-400 mt-1">
                Updated {new Date(data.updatedAt).toLocaleString()}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {RANGES.map((r) => (
              <button key={r.key} onClick={() => setRange(r.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${range === r.key ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200 hover:bg-slate-50"}`}>
                {r.label}
              </button>
            ))}
            <button onClick={() => setRange("custom")}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${range === "custom" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200 hover:bg-slate-50"}`}>
              Custom
            </button>
          </div>
        </div>

        {range === "custom" && (
          <div className="flex gap-2 mb-6 bg-white rounded-xl border border-gray-200 p-3">
            <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <span className="self-center text-gray-400">→</span>
            <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-500 py-16">Loading analytics…</p>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-sm">{error}</div>
        ) : data ? (
          <>
            {/* Realtime */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
              <Activity className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-sm font-bold text-emerald-800">{data.realtime?.total ?? 0} active users right now</p>
                <p className="text-xs text-emerald-600">Last 30 minutes · {data.realtime?.pages?.length ?? 0} pages</p>
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              <Stat icon={<Users className="w-5 h-5" />} label="Active users" value={t?.activeUsers} />
              <Stat icon={<Users className="w-5 h-5" />} label="Total users" value={t?.totalUsers} />
              <Stat icon={<Users className="w-5 h-5" />} label="New users" value={t?.newUsers} />
              <Stat icon={<BarChart3 className="w-5 h-5" />} label="Sessions" value={t?.sessions} />
              <Stat icon={<Eye className="w-5 h-5" />} label="Page views" value={t?.pageViews} />
              <Stat icon={<Clock className="w-5 h-5" />} label="Avg. engagement" value={`${t?.avgEngagementSeconds}s`} />
              <Stat icon={<MousePointerClick className="w-5 h-5" />} label="Apply clicks" value={data.applyClicks} />
              <Stat icon={<Search className="w-5 h-5" />} label="Job views" value={data.jobViews} />
              <Stat icon={<Users className="w-5 h-5" />} label="Returning users" value={t?.returningUsers} />
            </div>

            {/* Traffic chart */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h2 className="font-bold text-gray-900">Traffic over time</h2>
                <div className="flex gap-1 flex-wrap">
                  {CHART_METRICS.map((m) => (
                    <button key={m.key} onClick={() => setMetric(m.key)}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold ${metric === m.key ? "bg-blue-600 text-white" : "bg-slate-100 text-gray-600 hover:bg-slate-200"}`}>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
              {data.trend?.length ? (
                <div className="flex items-end gap-1 h-48">
                  {data.trend.map((t: any) => (
                    <div key={t.date} className="flex-1 flex flex-col items-center" title={`${fmtDate(t.date)}: ${t[metric] || 0}`}>
                      <div className="w-full bg-blue-500 rounded-t" style={{ height: `${Math.max(3, Math.round(((t[metric] || 0) / trendMax) * 100))}%` }} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No traffic data yet.</p>
              )}
            </div>

            {/* Top pages */}
            <Card title="Most visited pages">
              {data.topPages?.length ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-400 uppercase">
                      <th className="pb-2">Page</th><th className="pb-2">Views</th><th className="pb-2">Users</th><th className="pb-2">Engagement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topPages.map((p: any, i: number) => (
                      <tr key={i} className="border-t border-gray-100">
                        <td className="py-2 pr-2">
                          <p className="font-medium text-gray-900 truncate max-w-[260px]">{p.title || p.path}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[260px]">{p.path}</p>
                        </td>
                        <td className="py-2">{p.views}</td>
                        <td className="py-2">{p.users}</td>
                        <td className="py-2">{Math.round(Number(p.engagement) || 0)}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <Empty />}
            </Card>

            {/* Job performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card title="Most viewed jobs">
                {data.topJobs?.length ? (
                  <ul className="space-y-3">
                    {data.topJobs.map((j: any) => (
                      <li key={j.id} className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{j.title || `Job ${j.id}`}</p>
                          {j.company && <p className="text-xs text-gray-400 truncate">{j.company}{j.location ? ` · ${j.location}` : ""}</p>}
                        </div>
                        <span className="text-sm text-gray-600 font-medium shrink-0">{j.views} views</span>
                      </li>
                    ))}
                  </ul>
                ) : <Empty />}
              </Card>

              <Card title="Traffic sources">
                <Bars items={data.sources} />
              </Card>
            </div>

            {/* Locations, devices, browsers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Top countries"><Bars items={data.topCountries} /></Card>
              <Card title="Top cities"><Bars items={data.topCities} /></Card>
              <Card title="Devices"><Bars items={data.devices} /></Card>
              <Card title="Browsers"><Bars items={data.browsers} /></Card>
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number | undefined }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      <div className="flex items-center gap-2 text-blue-600 mb-2">{icon}</div>
      <p className="text-2xl font-extrabold text-gray-900">{value ?? 0}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <h2 className="font-bold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Bars({ items }: { items: any[] }) {
  if (!items?.length) return <p className="text-sm text-gray-400">No data yet.</p>;
  const max = Math.max(1, ...items.map((i) => Number(i.value) || 0));
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700 truncate">{item.dimension || "(not set)"}</span>
            <span className="text-gray-500 font-medium shrink-0 ml-2">{item.value}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.round(((Number(item.value) || 0) / max) * 100)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Empty() {
  return <p className="text-sm text-gray-400">No data yet.</p>;
}
