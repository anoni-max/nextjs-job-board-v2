import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { User, GraduationCap, Code, Lock } from "lucide-react";

export const dynamic = "force-dynamic";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default async function TalentDirectory() {
  // Fetch all candidates from the database
  const candidates = await prisma.candidate.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Talent Directory</h1>
          <p className="text-lg text-gray-600">
            Browse top candidates. Contact details are locked for privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {candidates.length === 0 ? (
            <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500">No candidates yet. Be the first to join!</p>
              <Link href="/join-talent" className="text-blue-600 hover:underline mt-2 inline-block">
                Join the Talent Pool
              </Link>
            </div>
          ) : (
            candidates.map((candidate) => (
              <div key={candidate.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{candidate.name}</h2>
                      <p className="text-sm text-gray-500">Joined recently</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <Code className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                      <span><strong>Skills:</strong> {candidate.skills}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <GraduationCap className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                      <span><strong>Education:</strong> {candidate.education}</span>
                    </div>
                    {candidate.bio && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg italic">
                        &quot;{candidate.bio}&quot;
                      </p>
                    )}
                  </div>
                </div>

                {/* THE PAYWALL / UNLOCK REQUEST */}
                <div className="pt-4 border-t border-gray-100 mt-auto">
                  <form 
                    action="https://formspree.io/f/mzerdyzy" 
                    method="POST" 
                    className="flex flex-col gap-2"
                  >
                    {/* Hidden fields to tell you who they want */}
                    <input type="hidden" name="candidate_name" value={candidate.name} />
                    <input type="hidden" name="candidate_id" value={candidate.id} />
                    <input type="hidden" name="candidate_email" value={candidate.email} />
                    
                    <input 
                      type="email" 
                      name="employer_email" 
                      placeholder="Enter your work email" 
                      required 
                      className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-gray-900 bg-slate-50"
                    />
                    <button type="submit" className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-900 transition flex items-center justify-center gap-2">
                      <Lock className="w-4 h-4" /> Interact
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}