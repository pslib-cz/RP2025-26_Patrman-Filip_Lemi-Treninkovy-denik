import { getRoutineSuccessRate } from "@/services/stats.service";
import StatsPieChart from "@/components/StatsPieChart";

interface Props {
  filter: string;
  userId: string;
}

export default async function RoutineSuccessCard({ filter, userId }: Props) {
  const rate = await getRoutineSuccessRate(userId, filter);
  
  const chartData = [
    { name: "Success", value: rate, color: "fill-primary" },
    { name: "Incomplete", value: 100 - rate, color: "fill-slate-100" }       
  ].filter((item) => item.value > 0);

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-card p-6 shadow-sm border border-border">
      <h3 className="text-sm font-bold text-muted-foreground uppercase mb-2">
        Routine Success Rate
      </h3>
      
      <div className="relative w-full flex items-center justify-center mt-2">
         
         <StatsPieChart data={chartData} />
         <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
           <span className="text-3xl font-bold text-primary">{Math.round(rate)}%</span>
         </div>

      </div>
    </div>
  );
}
