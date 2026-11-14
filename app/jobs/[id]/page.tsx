import Link from "next/link";
import Image from "next/image";

export default async function JobDetail({ params }: { params: { id: string } }) {
  try {
    const res = await fetch(`https://remoteok.com/api`, { next: { revalidate: 3600 } });
    const data = await res.json();
    const job = data.find((j: any) => j.id == params.id);

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

    // Clean up the description to prevent HTML parsing crashes
    const cleanDescription = job.description ? job.description.toString() : "No description available.";

    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block font-medium">
            ← Back to all jobs
          </Link>

          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <Image 
                src={`https://logo.clearbit.com/${job.company?.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`} 
                alt={job.company || "Company"}
                width={64}
                height={64}
                unoptimized
                className="rounded-xl object-contain bg-white border border-gray-200 p-1"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${job.company || "Job"}&background=random&color=fff`;
                }}
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.position}</h1>
                <p className="text-lg text-gray-600">{job.company} · {job.location}</p>
              </div>
            </div>

            <div className="flex gap-2 mb-8 mt-6">
              {job.tags?.slice(0, 5).map((tag: string) => (
                <span key={tag} className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full font-medium">
                  {tag}
                </span>
              ))}
            </div>

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

            <div className="prose max-w-none text-gray-700">
              <div dangerouslySetInnerHTML={{ __html: cleanDescription }} />
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Something went wrong loading this job.</h1>
          <Link href="/" className="text-blue-600 hover:underline">← Back to jobs</Link>
        </div>
      </main>
    );
  }
}