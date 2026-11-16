import { prisma } from "@/lib/prisma";
import Link from "next/link";
import TalentClient from "./TalentClient";
import StatsHeader from "../components/StatsHeader";

export const dynamic = "force-dynamic";

export default async function TalentDirectory() {
  const candidates = await prisma.candidate.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-slate-50">
      
      {/* Sticky Stats Header */}
      <StatsHeader 
        title="Talent Pool" 
        subtitle="Browse top candidates ready to work" 
        count={candidates.length} 
        countLabel="Active Applicants"
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {candidates.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">No candidates yet. Be the first to join!</p>
            <Link href="/join-talent" className="text-blue-600 hover:underline mt-2 inline-block">
              Join the Talent Pool
            </Link>
          </div>
        ) : (
          <TalentClient candidates={candidates} />
        )}
      </div>
    </main>
  );
}