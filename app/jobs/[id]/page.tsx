import Link from "next/link";
import { cache } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import TrackJobView from "@/app/components/TrackJobView";
import ApplyButton from "@/app/components/ApplyButton";

export const dynamic = "force-dynamic";

const SITE = "https://www.kazispot.com";

const getJob = cache(async (id: string) => {
  return prisma.job.findFirst({
    where: {
      id,
      isApproved: true,
      rejected: false,
      expiresAt: { gt: new Date() },
    },
  });
});

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    return { title: "Job not found — KaziSpot" };
  }

  const description = (job.description || "").replace(/\s+/g, " ").slice(0, 160).trim();

  return {
    title: `${job.title} at ${job.company} — KaziSpot`,
    description:
      description || `Apply for the ${job.title} position at ${job.company} on KaziSpot.`,
    alternates: { canonical: `${SITE}/jobs/${job.id}` },
    robots: { index: true, follow: true },
  };
}

function formatDate(d?: Date | string | null) {
  if (!d) return null;
  const date = new Date(d);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function BulletList({ text }: { text?: string | null }) {
  if (!text) return null;
  const items = text
    .split("\n")
    .map((s) => s.replace(/^[-•*\s]+/, "").trim())
    .filter(Boolean);
  if (items.length === 0) return null;
  return (
    <ul className="list-disc pl-5 space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="text-gray-700 leading-relaxed">{item}</li>
      ))}
    </ul>
  );
}

function mapEmploymentType(t?: string | null) {
  if (!t) return undefined;
  const v = t.toUpperCase().replace(/[\s-]+/g, "_");
  const allowed = ["FULL_TIME", "PART_TIME", "CONTRACT", "TEMPORARY", "INTERN", "VOLUNTEER", "PER_DIEM", "OTHER"];
  return allowed.includes(v) ? v : undefined;
}

function buildJsonLd(job: any) {
  const json: any = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: typeof job.description === "string" ? job.description : "",
    hiringOrganization: { "@type": "Organization", name: job.company },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: job.location || "" },
    },
  };

  if (job.postedDate || job.createdAt) {
    json.datePosted = new Date(job.postedDate || job.createdAt).toISOString();
  }
  if (job.expiresAt) {
    json.validThrough = new Date(job.expiresAt).toISOString();
  }
  const employmentType = mapEmploymentType(job.employmentType);
  if (employmentType) {
    json.employmentType = employmentType;
  }
  if (job.applyUrl) {
    json.directApply = true;
  }

  return json;
}

export default async function JobDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Job not found</h1>
          <Link href="/jobs" className="text-blue-600 hover:underline">← Back to jobs</Link>
        </div>
      </main>
    );
  }

  // Apply link: website URL → email → Google search fallback
  const url = (job.applyUrl || "").trim();
  const email = (job.applyEmail || "").trim();
  let href = "";
  let label = "Apply";
  let external = true;
  let method: "url" | "email" | "search" = "search";

  if (url) {
    href = url.startsWith("http") ? url : `https://${url}`;
    label = "Apply Now";
    external = true;
    method = "url";
  } else if (email) {
    href = `mailto:${email}?subject=${encodeURIComponent(`Application for ${job.title} at ${job.company}`)}`;
    label = "Apply by Email";
    external = false;
    method = "email";
  } else {
    href = `https://www.google.com/search?q=${encodeURIComponent(`${job.title} ${job.company} jobs Kenya`)}`;
    label = "Find Apply Link";
    external = true;
    method = "search";
  }

  const meta: { label: string; value: string | null }[] = [
    { label: "Location", value: job.location || null },
    { label: "Date Posted", value: formatDate(job.postedDate) },
    { label: "Deadline", value: formatDate(job.expiresAt) },
    { label: "Salary", value: job.salary || null },
    { label: "Employment", value: job.employmentType || null },
    { label: "Positions", value: job.positions || null },
  ].filter((m) => m.value);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      {/* JobPosting structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(job)) }}
      />

      {/* GA4 event: job view */}
      <TrackJobView
        jobId={job.id}
        title={job.title}
        category={job.employmentType}
        location={job.location}
        employmentType={job.employmentType}
      />

      <div className="max-w-3xl mx-auto">
        <Link href="/jobs" className="text-blue-600 hover:underline mb-6 inline-block font-medium">
          ← Back to all jobs
        </Link>

        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
              {job.company ? job.company.charAt(0) : "J"}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{job.title}</h1>
              <p className="text-lg text-gray-600">{job.company}</p>
            </div>
          </div>

          {meta.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
              {meta.map((m) => (
                <div key={m.label} className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{m.label}</p>
                  <p className="text-sm font-medium text-gray-900">{m.value}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-4 mb-8 pb-8 border-b border-gray-200">
            <ApplyButton
              href={href}
              label={label}
              external={external}
              jobId={job.id}
              title={job.title}
              method={method}
            />
          </div>

          {job.responsibilities ? (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Responsibilities</h2>
              <BulletList text={job.responsibilities} />
            </div>
          ) : null}

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Job Description</h2>
            <div className="text-gray-700 whitespace-pre-line leading-relaxed">{job.description}</div>
          </div>

          {job.qualifications ? (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Qualifications</h2>
              <BulletList text={job.qualifications} />
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
