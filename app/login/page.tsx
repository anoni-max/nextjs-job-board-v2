"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") { 
      document.cookie = "admin_token=secret123; path=/; max-age=86400"; 
      router.push("/admin");
    } else {
      setError("Incorrect password");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl border border-gray-100 shadow-xl w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-extrabold text-center text-gray-900 mb-2">Admin Portal</h1>
        <p className="text-center text-gray-500 mb-8 text-sm">Enter your password to manage jobs.</p>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-slate-50" 
              placeholder="Enter password..."
              autoFocus
            />
          </div>
          
          {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
          
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2">
            Log In <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </main>
  );
}