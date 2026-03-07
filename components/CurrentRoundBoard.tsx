import { Check } from "lucide-react";
import { Skill } from "@/types/training";

interface Props {
  skills: Skill[];
  onConfirm: () => void;
}

export function CurrentRoundBoard({ skills, onConfirm }: Props) {
  if (skills.length === 0) return null;

  return (
    <div className="border border-orange-200 border-dashed rounded-xl p-4 flex flex-col gap-4 bg-orange-50/50">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-xs text-muted-foreground uppercase tracking-widest">
          Current round ({skills.length} skills)
        </p>
        <p className="text-primary text-sm font-semibold">Total DD: {skills.reduce((acc, skill) => acc + skill.difficulty, 0).toFixed(1)}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill.id}
            className="bg-white/80 border border-slate-200 text-slate-700 font-mono text-sm shadow-sm font-medium rounded-full px-3 py-1.5"
          >
            {skill.fig_code}
          </span>
        ))}
      </div>

      <button
        onClick={() => onConfirm()}
        className="w-full mt-2 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
      >
        <Check className="w-5 h-5" />
        Confirm Round
      </button>
    </div>
  );
}
