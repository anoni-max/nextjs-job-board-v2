import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Wrench, Code, HeartPulse, Landmark, ClipboardList,
  UtensilsCrossed, GraduationCap, Megaphone, Globe, Briefcase,
} from "lucide-react";

const CATEGORIES = [
  { name: "Engineering", icon: Wrench, keywords: ["engineer", "engineering", "technician", "mechanic", "electrician", "civil", "mechanical"] },
  { name: "IT & Technology", icon: Code, keywords: ["software", "developer", "data", "devops", "it support", "network", "cyber", "system", "programmer", "cloud"] },
  { name: "Healthcare", icon: HeartPulse, keywords: ["nurse", "doctor", "medical", "health", "clinical", "pharmac", "therapist", "dental"] },
  { name: "Finance", icon: Landmark, keywords: ["finance", "account", "audit", "bank", "tax", "bookkeeping", "treasur", "credit", "insurance"] },
  { name: "Administration", icon: ClipboardList, keywords: ["admin", "administrative", "office", "reception", "secretary", "clerk", "assistant", "hr"] },
  { name: "Hospitality", icon: UtensilsCrossed, keywords: ["hotel", "hospitality", "chef", "cook", "waiter", "restaurant", "housekeeping", "tourism", "barista"] },
  { name: "Education", icon: GraduationCap, keywords: ["teacher", "lecturer", "tutor", "education", "instructor", "school", "trainer"] },
  { name: "Sales & Marketing", icon: Megaphone, keywords: ["sales", "marketing", "business development", "account manager", "brand", "digital marketing"] },
  { name: "Government & NGO", icon: Globe, keywords: ["ngo", "non-profit", "government", "humanitarian", "program officer", "project officer", "unicef", "world vision", "county"] },
  { name: "Internships", icon: Briefcase, keywords: ["intern", "internship", "trainee", "graduate trainee", "attachment"] },
];

function matches(title: string, keywords: string[]) {
  const t = title.toLowerCase();
  return keywords.some((k) => t.includes(k));
}

export default async function Categories() {
  let counts: Record<string, number> = {};
  try {
    const jobs = await prisma.job.findMany({
      where: { isApproved: true, rejected: false, expiresAt: { gt: new Date() } },
      select: { title: true },
    });
    for (const cat of CATEGORIES) {
      counts[cat.name] = jobs.filter((j) => matches(j.title, cat.keywords)).length;
    }
  } catch (e) {
    console.error("Categories count failed:", e);
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Browse Jobs by Category</h2>
          <p className="text-gray-600 mt-2">{total} active opportunities across popular fields</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/jobs?q=${encodeURIComponent(cat.name)}`}
              className="bg-slate-50 hover:bg-blue-50 border border-gray-200 rounded-xl p-5 text-center transition"
            >
              <cat.icon className="w-7 h-7 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-900">{cat.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{counts[cat.name] ?? 0} jobs</p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/jobs" className="text-blue-600 font-semibold hover:underline">
            Browse all jobs →
          </Link>
        </div>
      </div>
    </section>
  );
}
