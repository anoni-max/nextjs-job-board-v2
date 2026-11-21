import Link from "next/link";
import { Lock, User, Database, Globe, Mail, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — KaziSpot",
  description: "How KaziSpot collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600 text-lg">Last updated: November 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-200 space-y-10">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" /> Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              KaziSpot (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates kazispot.com, a job discovery and
              talent platform based in Kenya. This Privacy Policy explains what personal information we collect,
              how we use it, and the rights you have regarding your data.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              By using KaziSpot, you agree to this policy. If you do not agree, please do not use the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" /> Information we collect
            </h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>Account information:</strong> When you create an account (via Google sign-in or email), we
              collect your name and email address. If you sign up with email and password, we store your password
              in an encrypted (hashed) form — we never store or see your plain-text password.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              <strong>Talent Pool information:</strong> If you join our Talent Pool, you may provide your phone
              number, skills, education, and a short bio.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              <strong>Job applications:</strong> When you apply to a job, we collect the information you submit,
              such as your name, contact details, and any message or documents.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              <strong>Employer information:</strong> If you post a job, we collect your name, email, and the job
              details you provide.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              <strong>Usage data:</strong> We may automatically collect certain information such as your IP
              address, browser type, device type, pages visited, and the date and time of your visit. This helps us
              understand how the platform is used and improve it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" /> How we use your information
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 leading-relaxed">
              <li>To create and manage your account.</li>
              <li>To connect job seekers with employers.</li>
              <li>To review and publish job listings.</li>
              <li>To process job applications.</li>
              <li>To communicate with you (support, notifications).</li>
              <li>To improve and secure the platform.</li>
              <li>To comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" /> Legal basis for processing
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Under the Kenya Data Protection Act, 2019 (and the GDPR where applicable), we process your data on
              the following bases: your consent; the performance of a contract (providing the services you
              requested); our legitimate interests (such as security and improving the platform); and legal
              obligations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" /> Cookies and similar technologies
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We use cookies to keep you signed in and to remember your preferences. Examples include
              authentication cookies (session tokens) so you stay logged in, an admin session cookie for the admin
              dashboard, and preference cookies. You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" /> Third-party services
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We use trusted third parties to operate KaziSpot, including:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 leading-relaxed mt-3">
              <li><strong>Google</strong> — for Google sign-in (OAuth).</li>
              <li><strong>Supabase</strong> — database hosting.</li>
              <li><strong>Vercel</strong> — application hosting.</li>
              <li><strong>Fikra (AI)</strong> — to parse job-alert emails you submit.</li>
              <li><strong>Payment providers</strong> (e.g., M-Pesa / Stripe) — for any future paid services.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              These providers process data according to their own privacy policies and only as needed to provide
              their services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" /> How we share information
            </h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>We do not sell your personal information.</strong> We share data only with the service
              providers listed above, or when required by law. Employers may see the information you include in
              your Talent Pool profile or job application, subject to our access rules.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" /> Data retention
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We keep your data only as long as needed for the purposes described in this policy, or as required
              by law. You may request deletion at any time (see &quot;Your rights&quot; below).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" /> Security
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We take reasonable technical and organisational measures to protect your data, including encrypted
              connections (HTTPS), hashed passwords, and restricted access. However, no method of transmission
              over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" /> Your rights
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Depending on where you live, you may have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 leading-relaxed mt-3">
              <li>Access the personal data we hold about you.</li>
              <li>Correct inaccurate data.</li>
              <li>Delete your data (&quot;right to be forgotten&quot;).</li>
              <li>Object to or restrict processing.</li>
              <li>Withdraw consent at any time.</li>
              <li>Request data portability.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              To exercise these rights, contact us at the email below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" /> International data transfers
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our hosting providers may store data on servers outside Kenya. We use providers that apply
              appropriate safeguards to protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" /> Children&apos;s privacy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              KaziSpot is not intended for children under 18. We do not knowingly collect personal data from
              children.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" /> Changes to this policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this policy from time to time. We will post the updated version on this page with a
              new &quot;last updated&quot; date.
            </p>
          </section>

          {/* Contact Box */}
          <div className="bg-slate-50 p-6 rounded-xl border border-gray-200 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Questions about your privacy?</h3>
            <p className="text-gray-600 mb-4">
              For any privacy questions or requests, please email us.
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
