interface StatsHeaderProps {
  title: string;
  subtitle: string;
  count: number;
  countLabel: string; // <-- New: Allows us to change the text
}

export default function StatsHeader({ title, subtitle, count, countLabel }: StatsHeaderProps) {
  return (
    <section className="bg-white border-b border-gray-200 py-6 px-4 sticky top-14 md:top-16 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        
        {/* Left Side: Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
        </div>

        {/* Right Side: The Stats */}
        <div className="flex items-center gap-4 md:gap-6 shrink-0">
          <div>
            <div className="text-xl md:text-2xl font-extrabold text-gray-900">{count}</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">{countLabel}</div>
          </div>
          <div className="w-px h-8 bg-gray-300"></div>
          <div>
            <div className="text-xl md:text-2xl font-extrabold text-gray-900">2,353+</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Employers</div>
          </div>
          <div className="w-px h-8 bg-gray-300"></div>
          <div>
            <div className="text-xl md:text-2xl font-extrabold text-gray-900">9,005+</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Jobs This Year</div>
          </div>
        </div>

      </div>
    </section>
  );
}