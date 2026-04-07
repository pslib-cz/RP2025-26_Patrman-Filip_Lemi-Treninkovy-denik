import { Calendar, FlameIcon, ListChecksIcon, RotateCcw, Trophy } from "lucide-react";
import StatCard from "./StatCard";
import { getTopOverviewStats } from "@/services/stats.service";

interface Props {
    filter: string;
    userId: string;
}

export default async function StatsOverview({filter, userId}: Props){
    const stats = await getTopOverviewStats(userId, filter);
    return (
        <div className="grid grid-cols-6 gap-3">
            <div className="col-span-2">
              <StatCard
                icon={<RotateCcw className="h-5 w-5 text-primary" />}
                value={stats.totalRounds}
                label={"Total Rounds"}
              />
            </div>
            <div className="col-span-2">
              <StatCard
                icon={<Calendar className="h-5 w-5 text-secondary" />}
                value={stats.trainings}
                label={"Trainings"}
                iconBgClass="bg-secondary/10"
              />
            </div>
            <div className="col-span-2">
              <StatCard
                icon={<ListChecksIcon className="h-5 w-5 text-primary" />}
                value={stats.routines}
                label={"Routines"}
              />
            </div>
            <div className="col-span-3">
              <StatCard
                icon={<FlameIcon className="h-5 w-5 text-primary" />}
                value={stats.maxSkillDiff}
                label={"Max Skill Diff"}
              />
            </div>
            <div className="col-span-3">
              <StatCard
                icon={<Trophy className="h-5 w-5 text-secondary" />}
                value={stats.maxRoutineDiff}
                label={"Max Routine Diff"}
                iconBgClass="bg-secondary/10"
              />
            </div>
          </div>
    )
}