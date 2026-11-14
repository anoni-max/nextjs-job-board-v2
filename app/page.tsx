import HomeClient from "./HomeClient";

export default async function Home() {
  const res = await fetch("https://remoteok.com/api", { next: { revalidate: 3600 } });
  const data = await res.json();
  const jobs = data.slice(1, 20);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Latest Remote Jobs</h1>
        <HomeClient jobs={jobs} />
      </div>
    </main>
  );
}