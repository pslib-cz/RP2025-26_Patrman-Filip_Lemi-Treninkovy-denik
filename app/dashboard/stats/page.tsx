import StatCard from "@/components/StatCard";
import StatsTimeFilter from "@/components/StatsTimeFilter";
import {
  Calendar,
  FlameIcon,
  ListChecksIcon,
  RotateCcw,
  Trophy,
} from "lucide-react";
import { Suspense } from "react";

interface Props {
  searchParams: Promise<{
    time?: string;
  }>;
}

export default async function StatsPage({ searchParams }: Props) {
  const timeFilter = (await searchParams).time || "all";

  return (
    <div className="pb-14 min-h-screen bg-slate-50/50">
      <div className="max-w-md mx-auto w-full pt-6 px-4 flex flex-col gap-4">
        <h1 className="font-bold text-2xl">My Progress</h1>
        <StatsTimeFilter />
        <Suspense fallback={<p>Načítám počet kol...</p>}>
          <div className="grid grid-cols-6 gap-3">
            <div className="col-span-2">
              <StatCard
                icon={<RotateCcw className="h-5 w-5 text-primary" />}
                value={10}
                label={"Total Rounds"}
              />
            </div>
            <div className="col-span-2">
              <StatCard
                icon={<Calendar className="h-5 w-5 text-secondary" />}
                value={5}
                label={"Trainings"}
                iconBgClass="bg-secondary/10"
              />
            </div>
            <div className="col-span-2">
              <StatCard
                icon={<ListChecksIcon className="h-5 w-5 text-primary" />}
                value={2}
                label={"Routines"}
              />
            </div>
            <div className="col-span-3">
              <StatCard
                icon={<FlameIcon className="h-5 w-5 text-primary" />}
                value={1.5}
                label={"Max Skill Diff"}
              />
            </div>
            <div className="col-span-3">
              <StatCard
                icon={<Trophy className="h-5 w-5 text-secondary" />}
                value={12.5}
                label={"Max Routine Diff"}
                iconBgClass="bg-secondary/10"
              />
            </div>
          </div>
        </Suspense>
      </div>
    </div>
  );
}
