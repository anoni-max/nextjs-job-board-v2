import Link from "next/link";

const socials = [
  { label: "WhatsApp", href: "https://whatsapp.com/channel/0029Vb9lSs@FSAt5o20KvL1Q", color: "bg-[#25D366]" },
  { label: "Telegram", href: "https://t.me/kazispot", color: "bg-[#229ED9]" },
  { label: "X (Twitter)", href: "https://x.com/kazispot", color: "bg-slate-900" },
  { label: "Instagram", href: "https://instagram.com/kazispot", color: "bg-gradient-to-r from-[#833AB4] to-[#FD1D1D]" },
  { label: "Facebook", href: "https://facebook.com/kazispot", color: "bg-[#1877F2]" },
  { label: "TikTok", href: "https://tiktok.com/@kazispot", color: "bg-black" },
];

const links = [
  { label: "About Us", href: "/about" },
  { label: "Trust & Transparency", href: "/trust" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Help & FAQ", href: "/help" },
  { label: "Salary Guide", href: "/salary-guide" },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-28 md:pb-8 mt-12">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Never miss a job opportunity.</h3>
        <p className="text-gray-500 mb-6">Join our community for daily job alerts.</p>

        {/* Social buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${s.color} text-white px-4 py-2 rounded-full font-semibold text-sm hover:opacity-90 transition`}
            >
              {s.label}
            </a>
          ))}
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm mb-6">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-gray-500 hover:text-gray-900">
              {l.label}
            </Link>
          ))}
        </div>

        <p className="text-gray-400 text-sm">© {new Date().getFullYear()} KaziSpot. All rights reserved.</p>
      </div>
    </footer>
  );
}
