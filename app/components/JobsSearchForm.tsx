"use client";

import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

type Props = {
  initialQ?: string;
  initialLocation?: string;
  initialType?: string;
  initialSort?: string;
};

export default function JobsSearchForm({
  initialQ = "",
  initialLocation = "",
  initialType = "",
  initialSort = "newest",
}: Props) {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const q = String(data.get("q") || "").trim();
    const location = String(data.get("location") || "").trim();
    const type = String(data.get("type") || "");
    const sort = String(data.get("sort") || "newest");

    trackEvent("search", {
      search_term: q,
      search_location: location,
      employment_type: type,
      sort_order: sort,
    });

    if (location || type || sort !== "newest") {
      trackEvent("filter_used", {
        filter_location: location,
        filter_type: type,
        filter_sort: sort,
      });
    }

    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (location) params.set("location", location);
    if (type) params.set("type", type);
    if (sort && sort !== "newest") params.set("sort", sort);
    const qs = params.toString();
    router.push(`/jobs${qs ? `?${qs}` : ""}`);
  }

  const inputCls =
    "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
    >
      <input name="q" defaultValue={initialQ} placeholder="Job title, skill or company" className={inputCls} />
      <input name="location" defaultValue={initialLocation} placeholder="Location or country" className={inputCls} />
      <select name="type" defaultValue={initialType} className={inputCls}>
        <option value="">All employment types</option>
        <option value="Full-time">Full-time</option>
        <option value="Part-time">Part-time</option>
        <option value="Contract">Contract</option>
        <option value="Internship">Internship</option>
        <option value="Remote">Remote</option>
      </select>
      <select name="sort" defaultValue={initialSort} className={inputCls}>
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
      </select>
      <button
        type="submit"
        className="sm:col-span-2 lg:col-span-4 bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 transition"
      >
        Search Jobs
      </button>
    </form>
  );
}
