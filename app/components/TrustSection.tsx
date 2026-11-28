import Link from "next/link";
import { ShieldCheck, AlertTriangle, FileSearch, CreditCard } from "lucide-react";

const items = [
  { icon: FileSearch, title: "How we source jobs", text: "Vacancies are submitted by employers and collected from public job-alert emails." },
  { icon: ShieldCheck, title: "How vacancies are checked", text: "Every listing is reviewed by our team before it goes live. We do not guarantee accuracy — always verify the employer." },
  { icon: AlertTriangle, title: "Report suspicious listings", text: "Spotted something wrong? Contact us and we'll review and remove it quickly." },
  { icon: CreditCard, title: "Never pay to get a job", text: "No legitimate employer asks for money to guarantee a job or an interview." },
];

export default function TrustSection() {
  return (
    <section className="bg-slate-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Trust &amp; Transparency</h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            KaziSpot is a job discovery platform. Here&apos;s how we work to keep you safe.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((it) => (
            <div key={it.title} className="bg-white rounded-xl border border-gray-200 p-5">
              <it.icon className="w-6 h-6 text-blue-600 mb-3" />
              <h3 className="font-bold text-gray-900 text-sm mb-1">{it.title}</h3>
              <p className="text-gray-600 text-sm">{it.text}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/trust" className="inline-block bg-white border border-gray-300 text-gray-700 font-semibold px-6 py-2.5 rounded-lg hover:bg-slate-50 transition">
            Learn more about how we work
          </Link>
        </div>
      </div>
    </section>
  );
}
