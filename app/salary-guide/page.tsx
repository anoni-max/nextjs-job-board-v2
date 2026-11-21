import Link from "next/link";
import { TrendingUp, BarChart3, ListChecks, Lightbulb, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Salary Guide — KaziSpot",
  description: "Indicative salary ranges for common roles in Kenya to help you benchmark your pay.",
};

const salaryRanges = [
  { role: "Customer Support / Administration", range: "KSh 30,000 – 80,000" },
  { role: "Sales Representative", range: "KSh 40,000 – 120,000 (+ commission)" },
  { role: "Teacher / Tutor", range: "KSh 30,000 – 90,000" },
  { role: "Nurse / Clinical Officer", range: "KSh 40,000 – 120,000" },
  { role: "Accountant", range: "KSh 50,000 – 150,000" },
  { role: "Marketing / Communications", range: "KSh 50,000 – 180,000" },
  { role: "Graphic / UI-UX Designer", range: "KSh 50,000 – 150,000" },
  { role: "Data Analyst", range: "KSh 60,000 – 180,000" },
  { role: "Human Resources", range: "KSh 60,000 – 180,000" },
  { role: "Software Developer / Engineer", range: "KSh 80,000 – 300,000+" },
  { role: "Mechanical / Electrical Engineer", range: "KSh 70,000 – 200,000" },
  { role: "Project / Product Manager", range: "KSh 120,000 – 400,000" },
  { role: "Senior / Executive roles", range: "KSh 300,000 – 1,000,000+" },
];

const factors = [
  "Your level of experience and seniority",
  "The industry or sector you work in",
  "Location (Nairobi typically pays more than other towns)",
  "Specialised skills and certifications",
  "Company size and budget",
  "Remote roles (global remote jobs may pay in USD)",
];

const tips = [
  "Research the market before you negotiate — use guides like this one.",
  "Know your worth and be ready to explain the value you bring.",
  "Consider the total package, not just salary (benefits, allowances, flexibility).",
  "Be confident but realistic — aim high while staying within market range.",
  "Always get the agreed offer in writing before you accept.",
];

export default function SalaryGuidePage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Salary Guide</h1>
          <p className="text-gray-600 text-lg">
            Indicative salary ranges for common roles in Kenya — to help you benchmark your pay.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl mb-8 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 leading-relaxed">
            These figures are <strong>estimates only</strong> and vary widely by company, location, experience, and
            industry. Use them as a general benchmark — they are not a guarantee of earnings.
          </p>
        </div>

        {/* Salary ranges */}
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" /> Indicative monthly ranges
          </h2>
          <div className="divide-y divide-gray-100">
            {salaryRanges.map((s) => (
              <div key={s.role} className="flex items-center justify-between gap-4 py-3">
                <span className="text-gray-700 text-sm md:text-base">{s.role}</span>
                <span className="text-blue-700 font-semibold text-sm md:text-base whitespace-nowrap">{s.range}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Factors */}
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-blue-600" /> What affects your salary
          </h2>
          <ul className="space-y-3">
            {factors.map((f) => (
              <li key={f} className="flex gap-3 text-gray-700 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">✓</span>
                <span className="text-sm md:text-base">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tips */}
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-blue-600" /> Salary negotiation tips
          </h2>
          <ul className="space-y-3">
            {tips.map((t) => (
              <li key={t} className="flex gap-3 text-gray-700 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">✓</span>
                <span className="text-sm md:text-base">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="bg-slate-900 p-8 rounded-2xl text-center">
          <h3 className="text-xl font-bold text-white mb-2">Ready to find your next role?</h3>
          <p className="text-slate-300 mb-6">Browse jobs and benchmark your offer with confidence.</p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition"
          >
            Browse Jobs
          </Link>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
