import Link from "next/link";
import { Target, Users, Briefcase, ShieldCheck, CheckCircle, Sparkles, Mail } from "lucide-react";

export const metadata = {
  title: "About Us — KaziSpot",
  description: "KaziSpot is a Kenyan job discovery platform connecting talent with opportunity.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
            <Sparkles className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Connecting Kenyan talent with opportunity
          </h1>
          <p className="text-gray-600 text-lg">
            KaziSpot is a job discovery platform that brings remote and local opportunities into one simple place.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-200 space-y-12">

          {/* Mission */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" /> Our mission
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Finding a job shouldn&apos;t be complicated. KaziSpot exists to make discovering work — and finding
              talent — simpler, faster, and more transparent for everyone in Kenya.
            </p>
          </section>

          {/* What we do */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" /> What we do
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-gray-100">
                <Users className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">For job seekers</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Browse verified local and remote jobs, filter by location and job type, and join our Talent
                    Pool so employers can find you.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-gray-100">
                <Briefcase className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">For employers</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Post jobs for free, reach thousands of job seekers, and search our Talent Pool to find the
                    right people for your team.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-gray-100">
                <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Reviewed with care</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Our team reviews job postings before they go live to help keep the platform safe and reliable
                    for everyone.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Values */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" /> What we stand for
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Transparency", desc: "We're open about how we work and how we handle your data." },
                { title: "Trust", desc: "We review listings and protect your personal information." },
                { title: "Opportunity", desc: "Everyone deserves fair access to the right job." },
                { title: "Simplicity", desc: "A clean, easy-to-use platform — no clutter." },
              ].map((v) => (
                <div key={v.title} className="p-4 rounded-xl border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-1">{v.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How it works */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" /> How it works
            </h2>
            <ol className="space-y-4">
              {[
                { step: "1", title: "Create your account", desc: "Sign up in seconds with Google or email." },
                { step: "2", title: "Find or post a job", desc: "Search and filter jobs, or post a role if you're hiring." },
                { step: "3", title: "Connect", desc: "Apply to roles or connect with talent through the Talent Pool." },
              ].map((s) => (
                <li key={s.step} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{s.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* CTA */}
          <div className="bg-slate-50 p-8 rounded-xl border border-gray-200 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to get started?</h3>
            <p className="text-gray-600 mb-6">
              Join KaziSpot today and take the next step in your career — or find your next hire.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/signin"
                className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
              <Link
                href="/post"
                className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg border border-blue-200 hover:bg-blue-50 transition"
              >
                Post a Job
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-gray-600">
              Questions or feedback? Email us at{" "}
              <a href="mailto:sopportkazispot@gmail.com" className="text-blue-600 font-semibold hover:underline">
                sopportkazispot@gmail.com
              </a>
            </p>
          </div>

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
