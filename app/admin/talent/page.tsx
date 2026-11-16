"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Phone, GraduationCap, Code, Lock } from "lucide-react";

export default function AdminTalent() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Security Check
  useEffect(() => {
    const hasToken = document.cookie.includes("admin_token=secret123");
    if (!hasToken) {
      router.push("/login");
    }
  }, [router]);

  // 2. Fetch Candidates
  useEffect(() => {
    async function fetchCandidates() {
      try {
        const res = await fetch(`${window.location.origin}/api/candidates`);
        const data = await res.json();
        setCandidates(data);
      } catch (error) {
        console.error("Failed to fetch candidates", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCandidates();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-blue-600 hover:underline mb-2 inline-flex items-center gap-2 font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Job Admin
            </Link>
            <h1 className="text-3xl font-extrabold text-gray-900">Talent Pool (Admin)</h1>
            <p className="text-gray-500">You can see contact details here. The public cannot.</p>
          </div>
          
          <button 
            onClick={() => { 
              document.cookie = "admin_token=; max-age=0"; 
              window.location.href = "/login"; 
            }} 
            className="text-sm text-red-600 hover:underline font-bold bg-red-50 px-4 py-2 rounded-lg"
          >
            Log out
          </button>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500 py-12">Loading candidates...</p>
        ) : candidates.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No candidates have joined yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{candidate.name}</h2>
                
                <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                    <Mail className="w-4 h-4 text-blue-500" /> {candidate.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                    <Phone className="w-4 h-4 text-green-500" /> {candidate.phone}
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
                    <p className="text-sm text-gray-600 italic">&quot;{candidate.bio}&quot;</p>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">
                    Mark as Contacted
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}