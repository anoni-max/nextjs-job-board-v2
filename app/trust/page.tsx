import Link from "next/link";
import { ShieldCheck, Mail, CreditCard, Search } from "lucide-react";

export const metadata = {
  title: "Trust & Transparency — KaziSpot",
  description: "Learn how KaziSpot vets jobs, handles data, and processes payments safely.",
};

export default function TrustPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Trust and Transparency at KaziSpot
          </h1>
          <p className="text-gray-600 text-lg">
            We believe in being completely open about how KaziSpot works, what we offer, and how we protect you.
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-200 space-y-10">
          
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" /> What is KaziSpot?
            </h2>
            <p className="text-gray-700 leading-relaxed">
              KaziSpot is a Kenyan job discovery platform that brings together remote and local opportunities in one place. We also provide a Talent Pool where job seekers can showcase their skills to potential employers.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              <strong>Important:</strong> KaziSpot is a platform for discovering opportunities. We do not hire candidates, we do not make hiring decisions, and we do not guarantee employment. All hiring decisions are made solely by the third-party employers and clients listed on our site.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" /> How we review job listings
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We manually review job posts before they go live to ensure they meet our community guidelines. However, this review is for quality and safety only. It is not an endorsement of the employer, nor does it guarantee the job is still open or accurate.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              <strong>Always do your own research.</strong> Before applying or sharing personal information, verify the employer on their official website. We will never ask you for money to guarantee a job or interview. If you see a suspicious listing, please contact us immediately so we can remove it.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" /> Payments and Employer Postings
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Posting a job on KaziSpot is currently free. In the future, we may offer premium job postings. Any such fees will be clearly displayed before you post, and payments will be processed securely (e.g., via M-Pesa or Stripe).
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              If you pay for a service and experience an issue, please email us with your transaction reference. We do not store your M-Pesa PIN or card details. <strong>Never share your password or PIN with anyone, including us.</strong>
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" /> How we handle your data
            </h2>
            <p className="text-gray-700 leading-relaxed">
              When you join our Talent Pool, we collect the information you provide (such as your name, skills, and education). This information is kept private by default. Employers must request access to your contact details through us.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              We do not sell your data. If you have any questions about how your information is stored or want it removed, please reach out to us using the contact information below.
            </p>
          </section>

          {/* Contact Box */}
          <div className="bg-slate-50 p-6 rounded-xl border border-gray-200 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Need help or have a question?</h3>
            <p className="text-gray-600 mb-4">
              If you need to report a job listing, ask about a payment, or have a privacy concern, please email us.
            </p>
            <a 
              href="mailto:sopportkazispot@gmail.com" 
              className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition"
            >
              Contact Support
            </a>
            <p className="text-xs text-gray-500 mt-4">
              We aim to respond to all inquiries within 48 hours.
            </p>
          </div>

        </div>

        {/* Footer link */}
        <div className="text-center mt-8">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </div>

      </div>
    </main>
  );
}