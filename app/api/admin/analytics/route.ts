import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runReport, runRealtimeReport, GA_PROPERTY_ID } from "@/lib/analyticsAdmin";

export const dynamic = "force-dynamic";

const PRESETS: Record<string, { startDate: string; endDate: string }> = {
  today: { startDate: "today", endDate: "today" },
  yesterday: { startDate: "yesterday", endDate: "yesterday" },
  "7d": { startDate: "7daysAgo", endDate: "today" },
  "30d": { startDate: "30daysAgo", endDate: "today" },
  "90d": { startDate: "90daysAgo", endDate: "today" },
};

export async function GET(req: NextRequest) {
  if (!GA_PROPERTY_ID) {
    return NextResponse.json({ error: "GA_PROPERTY_ID is not configured" }, { status: 500 });
  }

  const sp = req.nextUrl.searchParams;
  const range = sp.get("range") || "7d";
  let dates = PRESETS[range];
  if (range === "custom") {
    dates = {
      startDate: sp.get("start") || "30daysAgo",
      endDate: sp.get("end") || "today",
    };
  }
  if (!dates) dates = PRESETS["7d"];

  try {
    const [
      totals, events, trend, topPages, topJobs, topCountries, topCities,
      sources, mediums, devices, browsers, realtime,
    ] = await Promise.all([
      runReport({
        startDate: dates.startDate, endDate: dates.endDate,
        metrics: [
          { name: "activeUsers" }, { name: "totalUsers" }, { name: "newUsers" },
          { name: "sessions" }, { name: "screenPageViews" }, { name: "averageEngagementTime" },
        ],
      }),
      runReport({
        startDate: dates.startDate, endDate: dates.endDate,
        metrics: [{ name: "eventCount" }],
        dimensions: [{ name: "eventName" }],
        orderBy: [{ name: "eventCount", desc: true }],
        limit: 25,
      }),
      runReport({
        startDate: dates.startDate, endDate: dates.endDate,
        metrics: [
          { name: "activeUsers" },
          { name: "screenPageViews" }, { name: "sessions" },
        ],
        dimensions: [{ name: "date" }],
        orderBy: [{ name: "date", desc: false, type: "dimension" }],
      }),
      runReport({
        startDate: dates.startDate, endDate: dates.endDate,
        metrics: [
          { name: "screenPageViews" }, { name: "activeUsers" }, { name: "userEngagementDuration" },
        ],
        dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
        orderBy: [{ name: "screenPageViews", desc: true }],
        limit: 10,
      }),
      runReport({
        startDate: dates.startDate, endDate: dates.endDate,
        metrics: [{ name: "screenPageViews" }],
        dimensions: [{ name: "pagePath" }],
        dimensionFilter: {
          filter: {
            fieldName: "pagePath",
            stringFilter: { matchType: "BEGINS_WITH", value: "/jobs/" },
          },
        },
        orderBy: [{ name: "screenPageViews", desc: true }],
        limit: 10,
      }),
      runReport({
        startDate: dates.startDate, endDate: dates.endDate,
        metrics: [{ name: "activeUsers" }],
        dimensions: [{ name: "country" }],
        orderBy: [{ name: "activeUsers", desc: true }],
        limit: 10,
      }),
      runReport({
        startDate: dates.startDate, endDate: dates.endDate,
        metrics: [{ name: "activeUsers" }],
        dimensions: [{ name: "country" }, { name: "city" }],
        orderBy: [{ name: "activeUsers", desc: true }],
        limit: 10,
      }),
      runReport({
        startDate: dates.startDate, endDate: dates.endDate,
        metrics: [{ name: "sessions" }],
        dimensions: [{ name: "sessionSource" }],
        orderBy: [{ name: "sessions", desc: true }],
        limit: 10,
      }),
      runReport({
        startDate: dates.startDate, endDate: dates.endDate,
        metrics: [{ name: "sessions" }],
        dimensions: [{ name: "sessionMedium" }],
        orderBy: [{ name: "sessions", desc: true }],
        limit: 10,
      }),
      runReport({
        startDate: dates.startDate, endDate: dates.endDate,
        metrics: [{ name: "activeUsers" }],
        dimensions: [{ name: "deviceCategory" }],
        orderBy: [{ name: "activeUsers", desc: true }],
        limit: 5,
      }),
      runReport({
        startDate: dates.startDate, endDate: dates.endDate,
        metrics: [{ name: "activeUsers" }],
        dimensions: [{ name: "browser" }],
        orderBy: [{ name: "activeUsers", desc: true }],
        limit: 5,
      }),
      runRealtimeReport({
        metrics: [{ name: "activeUsers" }],
        dimensions: [{ name: "pagePath" }],
        limit: 10,
        orderBy: [{ name: "activeUsers", desc: true }],
      }),
    ]);

    const jobRows = parseRows(topJobs);
    const jobIds = jobRows.map((r) => r.dimension.replace("/jobs/", "")).filter(Boolean);
    const jobRecords = jobIds.length
      ? await prisma.job.findMany({
          where: { id: { in: jobIds } },
          select: { id: true, title: true, company: true, location: true },
        })
      : [];
    const jobMap = new Map(jobRecords.map((j) => [j.id, j]));
    const topJobsWithTitles = jobRows.map((r) => {
      const id = r.dimension.replace("/jobs/", "");
      const j = jobMap.get(id);
      return {
        id,
        title: j?.title || null,
        company: j?.company || null,
        location: j?.location || null,
        views: r.value,
      };
    });

    return NextResponse.json({
      range,
      startDate: dates.startDate,
      endDate: dates.endDate,
      updatedAt: new Date().toISOString(),
      totals: parseTotals(totals),
      applyClicks: extractEventCount(events, "apply_click"),
      jobViews: extractEventCount(events, "job_view"),
      events: parseRows(events),
      trend: parseTrend(trend),
      topPages: parsePageRows(topPages),
      topJobs: topJobsWithTitles,
      topCountries: parseRows(topCountries),
      topCities: parseCityRows(topCities),
      sources: parseRows(sources),
      mediums: parseRows(mediums),
      devices: parseRows(devices),
      browsers: parseRows(browsers),
      realtime: parseRealtime(realtime),
    });
  } catch (e: any) {
    console.error("Analytics API error:", e);
    const details = e?.details || e?.message || String(e);
    return NextResponse.json(
      { error: "Failed to fetch analytics: " + details },
      { status: 500 }
    );
  }
}

function num(v: any) { return Number(v) || 0; }

function parseTotals(res: any) {
  const row = res?.rows?.[0];
  if (!row) return null;
  const [activeUsers, totalUsers, newUsers, sessions, pageViews, engagement] =
    row.metricValues.map((m: any) => m.value);
  return {
    activeUsers: num(activeUsers),
    totalUsers: num(totalUsers),
    newUsers: num(newUsers),
    returningUsers: Math.max(0, num(totalUsers) - num(newUsers)),
    sessions: num(sessions),
    pageViews: num(pageViews),
    avgEngagementSeconds: Math.round(num(engagement)),
  };
}

function parseRows(res: any) {
  return (res?.rows || []).map((r: any) => ({
    dimension: r.dimensionValues?.[0]?.value ?? "",
    value: r.metricValues?.[0]?.value ?? "0",
  }));
}

function parseCityRows(res: any) {
  return (res?.rows || []).map((r: any) => ({
    dimension: r.dimensionValues?.[1]?.value || r.dimensionValues?.[0]?.value || "",
    value: r.metricValues?.[0]?.value ?? "0",
  }));
}

function parsePageRows(res: any) {
  return (res?.rows || []).map((r: any) => ({
    path: r.dimensionValues?.[0]?.value ?? "",
    title: r.dimensionValues?.[1]?.value ?? "",
    views: r.metricValues?.[0]?.value ?? "0",
    users: r.metricValues?.[1]?.value ?? "0",
    engagement: r.metricValues?.[2]?.value ?? "0",
  }));
}

function parseTrend(res: any) {
  return (res?.rows || []).map((r: any) => ({
    date: r.dimensionValues?.[0]?.value ?? "",
    activeUsers: num(r.metricValues?.[0]?.value),
    pageViews: num(r.metricValues?.[1]?.value),
    sessions: num(r.metricValues?.[2]?.value),
  }));
}

function parseRealtime(res: any) {
  const rows = (res?.rows || []).map((r: any) => ({
    path: r.dimensionValues?.[0]?.value ?? "",
    activeUsers: num(r.metricValues?.[0]?.value),
  }));
  return { total: rows.reduce((s, r) => s + r.activeUsers, 0), pages: rows };
}

function extractEventCount(res: any, eventName: string) {
  const row = (res?.rows || []).find(
    (r: any) => r.dimensionValues?.[0]?.value === eventName
  );
  return num(row?.metricValues?.[0]?.value);
}
