import { Check, Clock, X } from "lucide-react";
import { Skill, Round } from "@/types/training";
import { useState } from "react";

interface Props {
  skills: Skill[];
  onConfirm: (roundData: Partial<Round>) => void;
  isEditing: boolean;
  onCancelEdit: () => void;
  onRemoveSkill: (skillId: string) => void;
}

export function CurrentRoundBoard({
  skills,
  onConfirm,
  isEditing,
  onCancelEdit,
  onRemoveSkill,
}: Props) {
  const [isRoutine, setIsRoutine] = useState(false);
  const [routineType, setRoutineType] = useState<"VS" | "PS">("VS");
  const [routineTof, setRoutineTof] = useState("");

  const handleConfirm = () => {
    onConfirm({
      is_routine: isRoutine,
      routine_type: isRoutine ? routineType : undefined,
      tof: isRoutine && routineTof ? parseFloat(routineTof) : undefined,
    });
    setIsRoutine(false);
    setRoutineType("VS");
    setRoutineTof("");
  };

  if (skills.length === 0) return null;

  return (
    <div className="border border-primary/30 border-dashed rounded-xl p-3 flex flex-col gap-3 bg-primary/5">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-[10px] text-muted-foreground uppercase tracking-widest">
          Current round ({skills.length} skills)
        </p>
        <p className="text-primary text-sm font-semibold">
          Total DD:{" "}
          {skills.reduce((acc, skill) => acc + skill.difficulty, 0).toFixed(1)}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="group flex items-center gap-1.5 bg-card border border-border text-foreground font-mono text-xs shadow-sm font-medium rounded-full pl-2.5 pr-1.5 py-1"
          >
            <span>
              {skill.fig_code === "-" && skill.tof !== undefined
                ? `- (${skill.tof}s)`
                : skill.fig_code}
            </span>
            <button
              onClick={() => onRemoveSkill(skill.id)}
              className="text-muted-foreground hover:text-destructive rounded-full hover:bg-destructive/10 p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
      
        <div className="bg-card rounded-xl p-3 flex flex-col gap-2 border border-border mt-1 self-end">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isRoutine}
              onChange={(e) => setIsRoutine(e.target.checked)}
              className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
            />
            <span className="font-bold text-foreground">Mark as Routine</span>

            {isRoutine && (
              <div className="flex bg-muted rounded-lg p-1 ml-auto">
                <button
                  onClick={() => setRoutineType("VS")}
                  className={`px-3 py-1 text-sm font-bold rounded-md ${routineType === "VS" ? "bg-primary text-white" : "text-muted-foreground"}`}
                >
                  VS
                </button>
                <button
                  onClick={() => setRoutineType("PS")}
                  className={`px-3 py-1 text-sm font-bold rounded-md ${routineType === "PS" ? "bg-muted-foreground text-card" : "text-muted-foreground"}`}
                >
                  PS
                </button>
              </div>
            )}
          </div>
          {isRoutine && (
            <div className="flex items-center justify-between text-muted-foreground text-sm mt-2 pl-8">
              <div className="flex items-center gap-2">
                <span className="text-xs"><Clock className="w-3 h-3"/></span> Routine Height / Time (ToF):
              </div>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 16.5"
                value={routineTof}
                onChange={(e) => setRoutineTof(e.target.value)}
                className="w-24 px-3 py-1.5 border border-border rounded-lg text-foreground bg-muted/50"
              />
            </div>
          )}
        </div>
     
      <button
        onClick={handleConfirm}
        className="w-full mt-1 py-2.5 bg-primary hover:bg-orange-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-sm text-sm"
      >
        <Check className="w-4 h-4" />
        {isEditing ? "Update Round" : "Confirm Round"}
      </button>
      {isEditing && (
        <button
          onClick={onCancelEdit}
          className="text-sm font-bold text-red-500 underline text-center w-full mt-2"
        >
          Cancel editing
        </button>
      )}
    </div>
  );
}
