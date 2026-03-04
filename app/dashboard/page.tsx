import LemiMascot from "@/components/Lemi-mascot";
import StatCard from "@/components/StatCard";
import TrainingCard from "@/components/TrainingCard";
import { createClient } from "@/utils/supabase/server";
import { Flame, Calendar, RotateCcw, Zap } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const stats = { maxDifficulty: 12.6, trainings: 5, totalRounds: 10 };
  const recentTrainings = [
    {
      id: 1,
      date: "Sunday, Mar 1",
      time: "2:30 PM",
      rounds: 3,
      jumps: 17,
      diff: 12.1,
    },
    {
      id: 2,
      date: "Friday, Feb 27",
      time: "10:00 AM",
      rounds: 2,
      jumps: 10,
      diff: 12.6,
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <LemiMascot size="lg" expression="excited" />
        <div>
          <p className="text-sm text-muted-foreground">Good to see you!</p>
          <h1 className="text-2xl font-bold">
            Ready to fly,{" "}
            <span className="text-primary">
              {user?.user_metadata.username || "Jumper"}
            </span>?
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <StatCard
          icon={<Flame className="h-5 w-5 text-primary" />}
          value={stats.maxDifficulty}
          label="Max Difficulty"
          className="bg-transparent shadow-none rounded-none border-0"
        />
        <StatCard
          icon={<Calendar className="h-5 w-5 text-secondary" />}
          value={stats.trainings}
          label="Trainings"
          className="bg-transparent shadow-none rounded-none border-0"
          iconBgClass="bg-secondary/10"
        />
        <StatCard
          icon={<RotateCcw className="h-5 w-5 text-primary" />}
          value={stats.totalRounds}
          label="Total Rounds"
          className="bg-transparent shadow-none rounded-none border-0"
        />
      </div>

      <Link
        href="/dashboard/sessions"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 p-4 font-bold text-white shadow-md transition-transform hover:scale-[1.02]"
      >
        <Zap className="h-5 w-5 fill-current" />
        START NEW TRAINING SESSION
      </Link>

      <div className="mt-2 flex flex-col gap-3">
        <h2 className="text-base font-bold text-foreground">
          Recent Trainings
        </h2>

        {recentTrainings.map((training) => (
          <TrainingCard key={training.id} data={training} />
        ))}
      </div>
    </div>
  );
}
