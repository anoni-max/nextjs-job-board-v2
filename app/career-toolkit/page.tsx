export const metadata = {
  title: "Career Toolkit — KaziSpot",
  description: "CV writing tips, interview preparation and job search advice.",
};

const sections = [
  {
    title: "CV Writing Tips",
    body: "Tailor your CV to each job. Lead with a short professional summary, list your most relevant skills first, and quantify achievements where possible (e.g. 'reduced costs by 15%'). Keep it to one or two pages and proofread carefully.",
  },
  {
    title: "Interview Preparation",
    body: "Research the company and role before the interview. Practise answering common questions using the STAR method (Situation, Task, Action, Result), and prepare two or three thoughtful questions to ask the interviewer.",
  },
  {
    title: "Career Development",
    body: "Set clear short-term and long-term goals. Seek feedback regularly, keep learning new skills, and build a professional network. Certifications and online courses can help you stay competitive in your field.",
  },
  {
    title: "Job Search Advice",
    body: "Treat your job search like a project. Search consistently, customise each application, and track your progress. Follow up politely after applying, and use your network — many roles are filled through referrals.",
  },
];

export default function CareerToolkitPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Career Toolkit</h1>
        <p className="text-gray-500 mb-8">Practical advice to help you find and win your next opportunity.</p>

        <div className="space-y-6">
          {sections.map((s) => (
            <div key={s.title} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h2>
              <p className="text-gray-700 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
