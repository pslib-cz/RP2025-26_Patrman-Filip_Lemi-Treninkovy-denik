export default function SessionMetricsCard({
  icon,
  value,
  label,
  className
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  className?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <span className={`text-2xl font-black ${className}`}>
        {value}
      </span>
    </div>
  );
}
