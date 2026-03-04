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
      className={`flex flex-col items-center justify-center bg-card p-4 shadow-sm ${className}`}
    >
      <div className={`mb-2 rounded-full p-2 ${iconBgClass}`}>{icon}</div>
      <span className="text-xl font-bold">{value}</span>
      <span className="text-[8px] text-muted-foreground uppercase mt-1 text-center">
        {label}
      </span>
    </div>
  );
}
