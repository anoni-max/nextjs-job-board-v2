import Link from "next/link";
import { FileText, Mic, TrendingUp, Search } from "lucide-react";

const resources = [
  { label: "CV Writing Tips", href: "/career-toolkit", icon: FileText },
  { label: "Interview Preparation", href: "/career-toolkit", icon: Mic },
  { label: "Career Development", href: "/career-toolkit", icon: TrendingUp },
  { label: "Job Search Advice", href: "/career-toolkit", icon: Search },
];

export default function CareerResources() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-8">Career Resources</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {resources.map((r) => (
          <Link
            key={r.label}
            href={r.href}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:bg-blue-50/50 transition"
          >
            <r.icon className="w-7 h-7 text-blue-600" />
            <p className="font-semibold text-gray-900 mt-3">{r.label}</p>
            <p className="text-xs text-gray-500 mt-1">Learn more →</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
