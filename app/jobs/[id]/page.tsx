import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { fetchArbeitnowJobs } from "@/lib/arbeitnow";

export const dynamic = "force-dynamic";

function formatDate(d?: Date | string | null) {
  if (!d) return null;
  const date = new Date(d);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function BulletList({ text }: { text?: string }) {
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

export default async function JobDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let job: any = null;

  try {
    const localJob = await prisma.job.findFirst({
      where: {
        id,
        isApproved: true,
        rejected: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (localJob) {
      job = {
        position: localJob.title,
        company: localJob.company,
        location: localJob.location,
        description: localJob.description,
        url: localJob.applyUrl,
        salary: localJob.salary,
        employmentType: localJob.employmentType,
        positions: localJob.positions,
        postedDate: localJob.postedDate,
        deadline: localJob.expiresAt,
        qualifications: localJob.qualifications,
        responsibilities: localJob.responsibilities,
        tags: ["Local", "Featured"],
        isLocal: true,
      };
    }
  } catch (error) {
    console.error("Failed to fetch local job:", error);
  }

  if (!job) {
    try {
      const res = await fetch("https://remoteok.com/api", { next: { revalidate: 3600 } });
      const data = await res.json();
      job = data.find((j: any) => j.id == id);
    } catch (error) {
      console.error("Failed to fetch remote jobs:", error);
    }
  }

  if (!job) {
    try {
      const arbeitnowData = await fetchArbeitnowJobs();
      job = arbeitnowData.find((j: any) => j.id == id);
    } catch (error) {
      console.error("Failed to fetch arbeitnow jobs:", error);
    }
  }

  if (!job) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Job not found</h1>
          <Link href="/" className="text-blue-600 hover:underline">← Back to jobs</Link>
        </div>
      </main>
    );
  }

  const rawDesc = job.description || "No description provided.";
  const safeDesc = typeof rawDesc === "string" ? rawDesc : JSON.stringify(rawDesc);

  const meta: { label: string; value: string | null }[] = [
    { label: "Location", value: job.location || null },
    { label: "Date Posted", value: formatDate(job.postedDate) },
    { label: "Deadline", value: formatDate(job.deadline) },
    { label: "Salary", value: job.salary || null },
    { label: "Employment", value: job.employmentType || null },
    { label: "Positions", value: job.positions || null },
  ].filter((m) => m.value);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block font-medium">
          ← Back to all jobs
        </Link>

        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
              {job.company ? job.company.charAt(0) : "J"}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{job.position}</h1>
              <p className="text-lg text-gray-600">{job.company}</p>
            </div>
          </div>

          {job.isLocal && meta.length > 0 && (
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
            <a
              href={job.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Apply Now ↗
            </a>
          </div>

          {job.isLocal && job.responsibilities ? (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Responsibilities</h2>
              <BulletList text={job.responsibilities} />
            </div>
          ) : null}

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Job Description</h2>
            {job.isLocal ? (
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">{safeDesc}</div>
            ) : (
              <div className="text-gray-700 prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: safeDesc }} />
            )}
          </div>

          {job.isLocal && job.qualifications ? (
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
