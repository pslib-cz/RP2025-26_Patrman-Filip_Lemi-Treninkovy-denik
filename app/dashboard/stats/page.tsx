import StatsDirectionCard from "@/components/StatsDirectionCard";
import StatsFrequentSkills from "@/components/StatsFrequentSkills";
import StatsOverview from "@/components/StatsOverview";
import StatsRating from "@/components/StatsRating";
import RoutineSuccessCard from "@/components/StatsRoutineSuccess";
import StatsTimeFilter from "@/components/StatsTimeFilter";
import StatsTof from "@/components/StatsTof";
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";

interface Props {
  searchParams: Promise<{
    time?: string;
  }>;
}

export default async function StatsPage({ searchParams }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  const timeFilter = (await searchParams).time || "all";
  
  return (
    <div className="pb-14 min-h-screen bg-slate-50/50">
      <div className="max-w-md mx-auto w-full pt-6 px-4 flex flex-col gap-4">
        <h1 className="font-bold text-2xl">My Progress</h1>
        <StatsTimeFilter />
        <Suspense fallback={<p>Loading rounds count...</p>}>
          <StatsOverview filter={timeFilter} userId={user.id} />
          <StatsRating filter={timeFilter} userId={user.id} />
          <div className="grid grid-cols-2 gap-4">
            <RoutineSuccessCard filter={timeFilter} userId={user.id} />
            <StatsDirectionCard filter={timeFilter} userId={user.id} />
            <StatsFrequentSkills filter={timeFilter} userId={user.id} />
          </div>
          <StatsTof filter={timeFilter} userId={user.id} />
        </Suspense>
      </div>
    </div>
  );
}
