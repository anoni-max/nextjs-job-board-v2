import Link from "next/link";
import { Share2 } from "lucide-react";

export const metadata = {
  title: "Social Media — KaziSpot",
  description: "Follow KaziSpot on social media for daily job alerts.",
};

const socials = [
  { label: "WhatsApp Channel", href: "https://whatsapp.com/channel/0029Vb9lSsOFSAt5o20KvL1Q", color: "bg-[#25D366]", desc: "Daily job alerts" },
  { label: "Telegram", href: "https://t.me/kazispot", color: "bg-[#229ED9]", desc: "Join our community" },
  { label: "X (Twitter)", href: "https://x.com/", color: "bg-slate-900", desc: "Latest updates" },
  { label: "Instagram", href: "https://instagram.com/", color: "bg-gradient-to-r from-[#833AB4] to-[#FD1D1D]", desc: "Behind the scenes" },
  { label: "Facebook", href: "https://facebook.com/", color: "bg-[#1877F2]", desc: "Community & jobs" },
  { label: "TikTok", href: "https://tiktok.com/", color: "bg-black", desc: "Career tips" },
];

export default function SocialMediaPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
            <Share2 className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Follow KaziSpot</h1>
          <p className="text-gray-600 text-lg">Get daily job alerts and updates on your favourite platform.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              <div className={`${s.color} w-12 h-12 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shrink-0`}>
                {s.label.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{s.label}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/" className="text-blue-600 hover:underline">← Back to Home</Link>
        </div>
      </div>
    </main>
  );
}
