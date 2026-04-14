import { getFlipDirectionRatio } from "@/services/stats.service";
import StatsPieChart from "@/components/StatsPieChart";
import { RotateCw } from "lucide-react"; // Ikonka z tvého designu

interface Props {
  filter: string;
  userId: string;
}

export default async function StatsDirectionCard({ filter, userId }: Props) {
  const { frontRatio, backRatio } = await getFlipDirectionRatio(userId, filter);
  
  const chartData = [
    { name: "Vpřed", value: frontRatio, color: "fill-primary" }, 
    { name: "Vzad", value: backRatio, color: "fill-secondary" }  
  ].filter(item => item.value > 0);

  return (
    <div className="flex flex-col bg-card rounded-xl p-5 shadow-sm border border-border h-full">
      <h3 className="text-foreground font-bold mb-2">
        Flip Direction
      </h3>
      
      <div className="relative w-full flex items-center justify-center">
         <StatsPieChart data={chartData} />

         <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
           <RotateCw className="w-8 h-8 text-primary stroke-[2.5px]" /> 
         </div>
      </div>

      <div className="w-full flex flex-col gap-2 px-2">
         <div className="flex justify-between items-center w-full">
            <span className="text-muted-foreground text-sm">Front</span>
            <span className="text-muted-foreground text-sm">{Math.round(frontRatio)}%</span>
         </div>
         <div className="flex justify-between items-center w-full">
            <span className="text-muted-foreground text-sm">Back</span> 
            <span className="text-muted-foreground text-sm">{Math.round(backRatio)}%</span>
         </div>
      </div>

    </div>
  );
}
