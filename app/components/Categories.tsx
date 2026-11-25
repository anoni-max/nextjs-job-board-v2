import Link from "next/link";
import {
  Monitor, Cog, Code, DollarSign, HeartPulse,
  GraduationCap, Headphones, ClipboardList,
} from "lucide-react";

const categories = [
  { label: "Remote Jobs", href: "/jobs?type=Remote", icon: Monitor },
  { label: "Engineering", href: "/jobs?q=Engineering", icon: Cog },
  { label: "IT & Technology", href: "/jobs?q=Technology", icon: Code },
  { label: "Finance", href: "/jobs?q=Finance", icon: DollarSign },
  { label: "Healthcare", href: "/jobs?q=Medical", icon: HeartPulse },
  { label: "Education", href: "/jobs?q=Education", icon: GraduationCap },
  { label: "Customer Support", href: "/jobs?q=Support", icon: Headphones },
  { label: "Administrative", href: "/jobs?q=Administrative", icon: ClipboardList },
];

export default function Categories() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-8">Browse by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {categories.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col items-center gap-2 hover:border-blue-300 hover:bg-blue-50/50 transition text-center"
          >
            <c.icon className="w-7 h-7 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">{c.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
