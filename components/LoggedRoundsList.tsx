// components/LoggedRoundsList.tsx
import { Pencil, Trash2 } from "lucide-react";
import { Round } from "@/types/training";

interface Props {
  rounds: Round[];
  onDeleteRound: (roundId: string) => void;
}

export function LoggedRoundsList({ rounds, onDeleteRound }: Props) {
  if (rounds.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold text-lg text-slate-800">
        Logged Rounds ({rounds.length})
      </h2>

      <div className="flex flex-col gap-3">
        {rounds.map((round, index) => (
          <div
            key={round.id}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-3"
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-900">
                Round {index + 1}
              </span>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-500">
                  {round.skills.length} skills
                </span>
                <span className="bg-secondary text-white text-xs font-bold px-2.5 py-1 rounded-md">
                  DD: {round.total_difficulty.toFixed(1)}
                </span>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteRound(round.id)}
                  className="text-slate-400 hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {round.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="bg-slate-100 border border-slate-200 text-slate-700 font-mono text-sm shadow-sm rounded-full px-3 py-1.5"
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
