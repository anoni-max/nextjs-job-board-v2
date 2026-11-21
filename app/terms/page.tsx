import Link from "next/link";
import { FileText, ShieldCheck, User, Briefcase, CreditCard, AlertTriangle, Scale } from "lucide-react";

export const metadata = {
  title: "Terms of Service — KaziSpot",
  description: "The terms and conditions that govern your use of KaziSpot.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600 text-lg">Last updated: November 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-200 space-y-10">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" /> 1. Acceptance of these terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using KaziSpot (kazispot.com), including creating an account, browsing jobs, joining
              the Talent Pool, or posting a job, you agree to be bound by these Terms of Service. If you do not
              agree, you may not use the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" /> 2. What KaziSpot is (and is not)
            </h2>
            <p className="text-gray-700 leading-relaxed">
              KaziSpot is a job discovery platform that brings together remote and local opportunities and
              provides a Talent Pool where job seekers can showcase their skills.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              <strong>KaziSpot is not an employer.</strong> We do not hire candidates, we do not make hiring
              decisions, and we do not guarantee employment. All hiring decisions are made solely by the
              third-party employers and clients listed on our site. We are not a party to any employment
              relationship that may result from using the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" /> 3. Accounts and eligibility
            </h2>
            <p className="text-gray-700 leading-relaxed">
              You must be at least 18 years old to use KaziSpot. When you create an account, you agree to provide
              accurate and complete information and to keep your login credentials secure. You are responsible for
              all activity that occurs under your account.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              We may suspend or terminate accounts that violate these terms or that we believe pose a risk to the
              platform or other users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" /> 4. Job seekers and the Talent Pool
            </h2>
            <p className="text-gray-700 leading-relaxed">
              As a job seeker, you are responsible for the accuracy of the information you provide in your profile
              and job applications. You must not provide false or misleading information. Your Talent Pool
              information is kept private by default, and employers must request access to your contact details
              through us.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              <strong>Do your own research.</strong> Before applying or sharing personal information, verify the
              employer on their official website. Be cautious of any employer who asks for money to guarantee a
              job, interview, or training. KaziSpot does not charge job seekers to apply for jobs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" /> 5. Employers and job postings
            </h2>
            <p className="text-gray-700 leading-relaxed">
              As an employer, you agree to post only accurate, lawful, and non-misleading job listings. Job
              postings must describe real, available opportunities and must not contain discriminatory,
              fraudulent, or unlawful content.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              KaziSpot may review, edit, or remove job postings at our discretion. Reviewing a posting does not
              mean we endorse it, guarantee its accuracy, or confirm the job is still open.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-blue-600" /> 6. Acceptable use
            </h2>
            <p className="text-gray-700 leading-relaxed">You agree not to:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 leading-relaxed mt-3">
              <li>Post false, misleading, fraudulent, or unlawful content.</li>
              <li>Post content that is discriminatory, hateful, abusive, or harassing.</li>
              <li>Impersonate another person or organisation.</li>
              <li>Scrape, copy, or resell content from the platform without permission.</li>
              <li>Attempt to interfere with, disrupt, or gain unauthorised access to the platform.</li>
              <li>Use the platform for any illegal purpose.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" /> 7. Fees and payments
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Posting a job on KaziSpot is currently free. In the future, we may offer paid or premium services.
              Any fees will be clearly displayed before you make a purchase, and payments will be processed
              securely through third-party providers (such as M-Pesa or Stripe).
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              We do not store your M-Pesa PIN or card details. <strong>Never share your password or PIN with
              anyone, including us.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" /> 8. Intellectual property
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The KaziSpot name, logo, design, and original content are owned by us and are protected by
              applicable intellectual property laws. You may not use them without our prior written permission.
              You retain ownership of the content you submit, but you grant us a licence to display, store, and
              distribute it on the platform as necessary to provide our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" /> 9. Third-party links and content
            </h2>
            <p className="text-gray-700 leading-relaxed">
              KaziSpot may contain links to third-party websites (such as employer career pages). We are not
              responsible for the content, accuracy, or practices of any third-party site. You access them at your
              own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-blue-600" /> 10. Disclaimers
            </h2>
            <p className="text-gray-700 leading-relaxed">
              KaziSpot is provided on an &quot;as is&quot; and &quot;as available&quot; basis. To the fullest
              extent permitted by law, we disclaim all warranties, express or implied, including warranties of
              merchantability, fitness for a particular purpose, and non-infringement.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              We do not warrant that the platform will be uninterrupted, error-free, or secure, or that any job
              listing is accurate, current, or legitimate.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-600" /> 11. Limitation of liability
            </h2>
            <p className="text-gray-700 leading-relaxed">
              To the fullest extent permitted by law, KaziSpot shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, or any loss of profits, data, or goodwill, arising out
              of or in connection with your use of the platform.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              Our total liability to you for any claim arising out of the platform shall not exceed the amount you
              paid to us, if any, in the twelve months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" /> 12. Indemnification
            </h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify and hold KaziSpot harmless from any claims, damages, losses, or expenses
              arising out of your use of the platform, your violation of these terms, or your violation of the
              rights of any third party.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" /> 13. Termination
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may suspend or terminate your access to KaziSpot at any time, with or without notice, if we
              believe you have violated these terms or for any other lawful reason. You may stop using the
              platform at any time. Provisions that by their nature should survive termination will continue to
              apply.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-600" /> 14. Governing law
            </h2>
            <p className="text-gray-700 leading-relaxed">
              These terms are governed by the laws of the Republic of Kenya. Any disputes arising out of these
              terms shall be subject to the jurisdiction of the courts of Kenya.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" /> 15. Changes to these terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update these terms from time to time. We will post the updated version on this page with a
              new &quot;last updated&quot; date. Your continued use of the platform after changes are posted
              constitutes your acceptance of the updated terms.
            </p>
          </section>

          {/* Contact Box */}
          <div className="bg-slate-50 p-6 rounded-xl border border-gray-200 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Questions about these terms?</h3>
            <p className="text-gray-600 mb-4">
              If you have any questions, please email us.
            </p>
            <a
              href="mailto:sopportkazispot@gmail.com"
              className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition"
            >
              Contact Us
            </a>
            <p className="text-xs text-gray-500 mt-4">
              We aim to respond within 48 hours.
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
