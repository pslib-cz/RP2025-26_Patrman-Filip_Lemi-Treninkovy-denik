import { Round } from "@/types/training";
import { Clock } from "lucide-react";

export function SessionDetailRounds({ rounds }: { rounds: Round[] }) {
  if (rounds.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 mt-6">
      <h2 className="font-bold text-base text-foreground">
        Rounds
      </h2>

      <div className="flex flex-col gap-3">
        {rounds.map((round, index) => (
          <div
            key={round.id}
            className="border bg-card border-border rounded-xl p-3 shadow-sm flex flex-col gap-2 transition-colors"
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-foreground">
                Round {index + 1}
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {round.skills.length} skills
                </span>
                <span className="bg-secondary text-white text-xs font-bold px-2 py-0.5 rounded-md">
                  Diff: {round.total_difficulty.toFixed(1)}
                </span>
              </div>
            </div>
            
            {round.is_routine && (
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-primary text-white text-xs font-bold rounded-md px-2 py-0.5">
                  {round.routine_type} Routine
                </span>
                {round.tof && (
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3"/> {round.tof}s
                  </span>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-1.5">
              {round.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="bg-muted border border-border text-foreground font-mono text-xs shadow-sm rounded-full px-2 py-1"
                >
                  {skill.fig_code === "-" && skill.tof !== undefined
                    ? `- (${skill.tof}s)`
                    : skill.fig_code} 
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
