import Link from "next/link";

function titleFromSlug(slug?: string[]) {
  if (!slug || slug.length === 0) return "";
  const last = slug[slug.length - 1];
  const words = last
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1));
  return words.join(" ");
}

export default async function ComingSoon({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const title = titleFromSlug(slug);

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-10 rounded-2xl border border-gray-200 shadow-sm max-w-md w-full">
        <div className="text-5xl mb-4">🚧</div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          {title ? `${title} is Coming Soon` : "Coming Soon"}
        </h1>
        <p className="text-gray-500 mb-6">
          We're working on this page. Check back soon!
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          ← Back to Jobs
        </Link>
      </div>
    </main>
  );
}
