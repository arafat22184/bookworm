import { FadeIn } from "@/components/ui/motion";

function StatItem({
  label,
  value,
  delay,
}: {
  label: string;
  value: string;
  delay: number;
}) {
  return (
    <FadeIn delay={delay} className="space-y-2 group cursor-default">
      <div className="text-5xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-linear-to-br from-primary to-secondary group-hover:scale-110 transition-transform duration-300 ease-out">
        {value}
      </div>
      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
    </FadeIn>
  );
}

export function StatsSection() {
  return (
    <section className="py-6">
      <div className="w-11/12 max-w-6xl mx-auto bg-white/80 dark:bg-card/80 backdrop-blur-xl border shadow-2xl rounded-3xl p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-border/40">
          <StatItem label="Active Readers" value="10k+" delay={0} />
          <StatItem label="Books Tracked" value="500k+" delay={0.1} />
          <StatItem label="Reviews Written" value="250k+" delay={0.2} />
          <StatItem label="Reading Goals Met" value="92%" delay={0.3} />
        </div>
      </div>
    </section>
  );
}
