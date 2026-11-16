"use client";

import { useState } from "react";
import { User, GraduationCap, Code, Lock, Eye, X } from "lucide-react";

export default function TalentClient({ candidates }: { candidates: any[] }) {
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  // This function fires when they click "View Profile"
  async function handleView(candidate: any) {
    setSelectedCandidate(candidate);
    try {
      // Increment the view count in the database
      await fetch(`/api/candidates/${candidate.id}/view`, { method: "POST" });
    } catch (error) {
      console.error("Failed to track view");
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{candidate.name}</h2>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {candidate.views || 0} views
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => handleView(candidate)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg text-sm transition"
                >
                  View Profile
                </button>
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
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <form action="https://formspree.io/f/mzerdyzy" method="POST" className="flex flex-col gap-2">
                <input type="hidden" name="candidate_name" value={candidate.name} />
                <input type="hidden" name="candidate_id" value={candidate.id} />
                
                <input type="email" name="employer_email" placeholder="Enter your work email" required className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-gray-900 bg-slate-50" />
                <button type="submit" className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-900 transition flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" /> Request Contact Info ($10)
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Viewing the Full Profile */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
            <button 
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedCandidate.name}</h2>
            <p className="text-gray-600 mb-6">{selectedCandidate.bio || "No bio provided."}</p>
            
            <div className="space-y-2">
              <p className="text-sm"><strong>Skills:</strong> {selectedCandidate.skills}</p>
              <p className="text-sm"><strong>Education:</strong> {selectedCandidate.education}</p>
            </div>
            
            <div className="mt-8 pt-4 border-t border-gray-100">
               <p className="text-sm text-gray-500 italic">Contact info is hidden. Use the form to request access.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}