export async function fetchArbeitnowJobs() {
  try {
    // Arbeitnow provides a free, public JSON API with no keys required
    const res = await fetch("https://www.arbeitnow.com/api/job-board-api", { 
      next: { revalidate: 3600 } // Cache for 1 hour to make it fast
    });
    
    const data = await res.json();

    if (!data || !data.data) return [];

    // Format the jobs to match the structure of RemoteOK and your local database
    return data.data.slice(0, 30).map((job: any) => ({
      // Generate a unique ID using the slug
      id: `arb-${job.slug}`, 
      position: job.title,
      company: job.company_name,
      location: job.remote ? "Remote" : job.location,
      description: job.description,
      url: job.url,
      tags: job.tags && job.tags.length > 0 ? job.tags.slice(0, 3) : ["Tech", "Global"],
    }));
  } catch (error) {
    console.error("Failed to fetch Arbeitnow jobs:", error);
    return [];
  }
}