import Link from "next/link";

interface StatsHeaderProps {
  title: string;
  subtitle: string;
  count: number;
  countLabel: string;
  showSocialButton?: boolean;
}

export default function StatsHeader({ title, subtitle, count, countLabel, showSocialButton = false }: StatsHeaderProps) {
  return (
    <section className="bg-white border-b border-gray-200 py-2.5 md:py-6 px-2 md:px-4 sticky top-14 md:top-16 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto flex flex-row items-center gap-1.5 md:gap-6">
        
        {/* Left: Title */}
        <div className="flex-1 min-w-0">
          <h2 className="text-base md:text-2xl font-bold text-gray-900 leading-tight truncate">{title}</h2>
          <p className="hidden sm:block text-[10px] md:text-sm text-gray-500 mt-0.5 truncate">{subtitle}</p>
        </div>

        {/* Middle: Button */}
        {showSocialButton && (
          <Link
            href="/social-media"
            className="inline-flex items-center justify-center bg-blue-600 text-white text-[9px] md:text-sm font-semibold px-2 md:px-4 py-1.5 md:py-2 rounded-lg hover:bg-blue-700 transition shrink-0 whitespace-nowrap"
          >
            <span className="hidden md:inline">Join our social media group for more updates</span>
            <span className="md:hidden">Join us</span>
          </Link>
        )}

        {/* Right: Stats */}
        <div className="flex items-center gap-1 md:gap-6 shrink-0">
          <div className="text-center">
            <div className="text-xs md:text-2xl font-extrabold text-gray-900 leading-none">{count}</div>
            <div className="text-[7px] md:text-[10px] uppercase tracking-wide text-gray-500 font-semibold mt-0.5">{countLabel}</div>
          </div>
          <div className="w-px h-4 md:h-8 bg-gray-300"></div>
          <div className="text-center">
            <div className="text-xs md:text-2xl font-extrabold text-gray-900 leading-none">2,353+</div>
            <div className="text-[7px] md:text-[10px] uppercase tracking-wide text-gray-500 font-semibold mt-0.5">Employers</div>
          </div>
          <div className="w-px h-4 md:h-8 bg-gray-300"></div>
          <div className="text-center">
            <div className="text-xs md:text-2xl font-extrabold text-gray-900 leading-none">9,005+</div>
            <div className="text-[7px] md:text-[10px] uppercase tracking-wide text-gray-500 font-semibold mt-0.5">Jobs This Year</div>
          </div>
        </div>

      </div>
    </section>
  );
}
