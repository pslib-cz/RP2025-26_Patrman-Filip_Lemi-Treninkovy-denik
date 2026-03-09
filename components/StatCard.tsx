export default function StatCard({
  icon,
  value,
  label,
  className = "rounded-2xl border border-border",
  iconBgClass = "bg-accent",
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  className?: string;
  iconBgClass?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-card p-3 shadow-sm ${className}`}
    >
      <div className={`mb-1.5 rounded-full p-1.5 ${iconBgClass}`}>{icon}</div>
      <span className="text-lg font-bold">{value}</span>
      <span className="text-[9px] text-muted-foreground uppercase mt-0.5 text-center">
        {label}
      </span>
    </div>
  );
}
