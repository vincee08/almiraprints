import { StatCard } from "@/components/ui/stat-card";
import { STATS } from "@/lib/constants";

export function StatsSection() {
  return (
    <section className="py-6 sm:py-8 bg-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </div>
      </div>
    </section>
  );
}
