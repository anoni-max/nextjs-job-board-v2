interface StatsHeaderProps {
  title: string;
  subtitle: string;
  count: number;
  countLabel: string;
}

export default function StatsHeader({ title, subtitle, count, countLabel }: StatsHeaderProps) {
  return (
    <section className="bg-white border-b border-gray-200 py-3 md:py-6 px-3 md:px-4 sticky top-14 md:top-16 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto flex flex-row justify-between items-center gap-2 md:gap-6">
        
        {/* Left Side: Title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-2xl font-bold text-gray-900 leading-tight truncate">{title}</h1>
          <p className="text-[10px] md:text-sm text-gray-500 mt-0.5 truncate">{subtitle}</p>
        </div>

        {/* Right Side: The Stats */}
        <div className="flex items-center gap-2 md:gap-6 shrink-0">
          <div className="text-center">
            <div className="text-base md:text-2xl font-extrabold text-gray-900 leading-tight">{count}</div>
            <div className="text-[8px] md:text-[10px] uppercase tracking-wider text-gray-500 font-semibold mt-0.5">{countLabel}</div>
          </div>
          
          <div className="w-px h-6 md:h-8 bg-gray-300"></div>
          
          <div className="text-center">
            <div className="text-base md:text-2xl font-extrabold text-gray-900 leading-tight">2,353+</div>
            <div className="text-[8px] md:text-[10px] uppercase tracking-wider text-gray-500 font-semibold mt-0.5">Employers</div>
          </div>
          
          <div className="w-px h-6 md:h-8 bg-gray-300"></div>
          
          <div className="text-center">
            <div className="text-base md:text-2xl font-extrabold text-gray-900 leading-tight">9,005+</div>
            <div className="text-[8px] md:text-[10px] uppercase tracking-wider text-gray-500 font-semibold mt-0.5">Jobs This Year</div>
          </div>
        </div>

      </div>
    </section>
  );
}