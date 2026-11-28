import { BetaAnalyticsDataClient } from "@google-analytics/data";

export const GA_PROPERTY_ID = process.env.GA_PROPERTY_ID;

let client: BetaAnalyticsDataClient | null = null;

function getClient(): BetaAnalyticsDataClient {
  if (!client) {
    const privateKey = (process.env.GA_SERVICE_ACCOUNT_PRIVATE_KEY || "").replace(/\\n/g, "\n");
    client = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GA_SERVICE_ACCOUNT_CLIENT_EMAIL,
        private_key: privateKey,
      },
    });
  }
  return client;
}

export async function runReport(opts: {
  startDate: string;
  endDate: string;
  metrics: { name: string }[];
  dimensions?: { name: string }[];
  orderBy?: { name: string; desc?: boolean; type?: "metric" | "dimension" }[];
  limit?: number;
  dimensionFilter?: any;
}) {
  const client = getClient();
  const [response] = await client.runReport({
    property: `properties/${GA_PROPERTY_ID}`,
    dateRanges: [{ startDate: opts.startDate, endDate: opts.endDate }],
    metrics: opts.metrics,
    dimensions: opts.dimensions || [],
    orderBys: (opts.orderBy || []).map((o) =>
      (o.type || "metric") === "dimension"
        ? { dimension: { dimensionName: o.name }, desc: o.desc ?? false }
        : { metric: { metricName: o.name }, desc: o.desc ?? false }
    ),
    limit: opts.limit ?? undefined,
    dimensionFilter: opts.dimensionFilter,
  } as any);
  return response;
}

export async function runRealtimeReport(opts: {
  metrics: { name: string }[];
  dimensions?: { name: string }[];
  limit?: number;
  orderBy?: { name: string; desc?: boolean }[];
}) {
  const client = getClient();
  const [response] = await client.runRealtimeReport({
    property: `properties/${GA_PROPERTY_ID}`,
    metrics: opts.metrics,
    dimensions: opts.dimensions || [],
    limit: opts.limit ?? undefined,
    orderBys: (opts.orderBy || []).map((o) => ({
      metric: { metricName: o.name },
      desc: o.desc ?? false,
    })),
  } as any);
  return response;
}
