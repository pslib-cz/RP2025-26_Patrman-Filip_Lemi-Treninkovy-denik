import StatCard from "@/components/StatCard";
import TrainingCard from "@/components/TrainingCard";
import { Flame, Calendar, RotateCcw, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getDashboardData } from "@/services/dashboard.service";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const dashboardData = await getDashboardData(user?.id || "");

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-3">
        <Image src="/Lemi-nobg.svg" alt="Lemi Mascot" width={80} height={80} />
        <div>
          <p className="text-xs text-muted-foreground">Good to see you!</p>
          <h1 className="text-xl font-bold">
            Ready to fly,{" "}
            <span className="text-primary">
              {dashboardData.username || "Jumper"}
            </span>
            ?
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <StatCard
          icon={<Flame className="h-5 w-5 text-primary" />}
          value={dashboardData.maxDifficulty}
          label="Max Skill Diff"
          className="bg-transparent shadow-none rounded-none border-0"
        />
        <StatCard
          icon={<Calendar className="h-5 w-5 text-secondary" />}
          value={dashboardData.trainings}
          label="Trainings"
          className="bg-transparent shadow-none rounded-none border-0"
          iconBgClass="bg-secondary/10"
        />
        <StatCard
          icon={<RotateCcw className="h-5 w-5 text-primary" />}
          value={dashboardData.totalRounds}
          label="Total Rounds"
          className="bg-transparent shadow-none rounded-none border-0"
        />
      </div>

      <Link
        href="/dashboard/log"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary p-3.5 font-bold text-white shadow-md transition-transform hover:scale-[1.02]"
      >
        <Zap className="h-4 w-4 fill-current" />
        START NEW TRAINING SESSION
      </Link>

      <div className="mt-1 flex flex-col gap-2">
        <h2 className="text-sm font-bold text-foreground">Recent Trainings</h2>

        {dashboardData.recentTrainings.map((training) => (
          <TrainingCard key={training.id} data={training} />
        ))}
      </div>
    </div>
  );
}
