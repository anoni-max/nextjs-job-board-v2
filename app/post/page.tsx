"use client";

import Link from "next/link";

export default function PostJob() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block font-medium">
          ← Back to jobs
        </Link>

        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Post a Job</h1>
          <p className="text-gray-600 mb-6 text-sm">
            Reach thousands of qualified candidates. Fill out the form below and we&apos;ll review your listing.
          </p>

          <form action="https://formspree.io/f/mzerdyzy" method="POST" className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
              <input type="text" name="company" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
              <input type="text" name="title" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input type="text" name="location" required placeholder="Remote, New York, etc." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application URL or Email *</label>
              <input type="text" name="apply_url" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
              <textarea name="description" rows={5} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition">
              Submit Job ($49)
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
export const dynamic = "force-dynamic";