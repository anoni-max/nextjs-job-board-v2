import HomeClient from "./HomeClient";

export default async function Home() {
  // Fetch jobs from the API
  const res = await fetch("https://remoteok.com/api", { next: { revalidate: 3600 } });
  const data = await res.json();
  
  // Safety check: Make sure the API actually returned a list of jobs
  const jobs = Array.isArray(data) ? data.slice(1, 20) : [];

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Latest Remote Jobs</h1>
        <HomeClient jobs={jobs} />
      </div>
    </main>
  );
}