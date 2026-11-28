import Link from "next/link";

export default function EmployerBanner() {
  return (
    <section className="bg-slate-900 py-14 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">Are You Hiring?</h2>
        <p className="text-slate-300 mt-3">
          Reach qualified candidates and promote your vacancies through KaziSpot.
        </p>
        <Link href="/post" className="inline-block mt-6 bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition">
          Post a Job
        </Link>
      </div>
    </section>
  );
}
