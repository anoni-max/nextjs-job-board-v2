"use client";

import { useState } from "react";
import Link from "next/link";
import { HelpCircle, ChevronDown, Mail } from "lucide-react";

const faqGroups = [
  {
    title: "Getting Started",
    items: [
      {
        q: "Do I need an account to browse jobs?",
        a: "No. You can browse, search, and filter all jobs on KaziSpot without an account. You only need an account for features like the Talent Pool and applying on-site.",
      },
      {
        q: "How do I create an account?",
        a: "Click 'Sign in' in the top menu, then 'Create an account'. You can sign up with Google or with your email and password.",
      },
      {
        q: "Can I sign in with Google?",
        a: "Yes. Click 'Continue with Google' on the sign-in page. We only use your name and email address to identify you.",
      },
      {
        q: "I forgot my password. What do I do?",
        a: "Password reset is coming soon. For now, if you signed up with Google, use the Google sign-in button. If you still can't access your account, email us and we'll help.",
      },
    ],
  },
  {
    title: "Finding & Applying for Jobs",
    items: [
      {
        q: "How do I search or filter jobs?",
        a: "Use the search bar at the top of the page, or the filters for location and job type (full-time, part-time, contract, remote, etc.).",
      },
      {
        q: "What does the 'Verified' badge mean?",
        a: "Jobs with the green 'Verified' badge are posted and reviewed directly by the KaziSpot team. Listings without this badge are gathered from external sources and may be less reliable.",
      },
      {
        q: "How do I apply for a job?",
        a: "Open the job and click the 'Apply' button. This takes you to the employer's application page (or the application link provided). Always review the employer before applying.",
      },
      {
        q: "Do I have to pay to apply for jobs?",
        a: "No. Applying for jobs on KaziSpot is completely free for job seekers.",
      },
    ],
  },
  {
    title: "Talent Pool",
    items: [
      {
        q: "What is the Talent Pool?",
        a: "The Talent Pool lets you showcase your skills, education, and experience to employers. Employers can browse profiles and request your contact details.",
      },
      {
        q: "Is my Talent Pool information private?",
        a: "Yes, by default. Employers must request access to your contact details through us. We never sell your personal data.",
      },
    ],
  },
  {
    title: "For Employers",
    items: [
      {
        q: "How do I post a job?",
        a: "Go to 'Employers' → 'Post a Job', fill in the job details, and submit. Your job is reviewed by our team before it goes live.",
      },
      {
        q: "Is posting a job free?",
        a: "Yes, posting a job is currently free. Premium options may be added in the future and will be clearly labelled before you pay.",
      },
      {
        q: "How long does it take for my job to go live?",
        a: "Jobs are usually reviewed and published within 24–48 hours.",
      },
    ],
  },
  {
    title: "Safety & Support",
    items: [
      {
        q: "I found a suspicious or fake job. What should I do?",
        a: "Stop interacting with it and report it immediately by emailing sopportkazispot@gmail.com. We'll review and remove it as soon as possible.",
      },
      {
        q: "How do I delete my account or data?",
        a: "Email sopportkazispot@gmail.com with your request, and we'll process it (subject to any legal obligations).",
      },
      {
        q: "Who do I contact for help?",
        a: "Email sopportkazispot@gmail.com. We aim to respond to all inquiries within 48 hours.",
      },
    ],
  },
];

export default function HelpPage() {
  const [open, setOpen] = useState<string | null>("0-0");

  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Help &amp; FAQ</h1>
          <p className="text-gray-600 text-lg">Answers to the most common questions about KaziSpot.</p>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-200 space-y-8">
          {faqGroups.map((group, gi) => (
            <section key={group.title}>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{group.title}</h2>
              <div className="divide-y divide-gray-100">
                {group.items.map((item, ii) => {
                  const key = `${gi}-${ii}`;
                  const isOpen = open === key;
                  return (
                    <div key={key}>
                      <button
                        onClick={() => setOpen(isOpen ? null : key)}
                        className="w-full flex items-center justify-between gap-4 py-4 text-left"
                      >
                        <span className="font-semibold text-gray-900 text-sm md:text-base">{item.q}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <p className="pb-4 text-gray-600 leading-relaxed text-sm md:text-base">{item.a}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Contact Box */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center mt-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Still need help?</h3>
          <p className="text-gray-600 mb-4">Our team is happy to assist you.</p>
          <a
            href="mailto:sopportkazispot@gmail.com"
            className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition"
          >
            Contact Support
          </a>
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
