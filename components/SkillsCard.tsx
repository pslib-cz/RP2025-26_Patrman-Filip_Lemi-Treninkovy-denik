"use client";
import { updateSkillStatus } from "@/services/skills.service";
import { SkillLibrary } from "@/types/training";
import { BookOpen, CircleCheckBig, CircleDashed } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SkillsCard({ skill }: { skill: SkillLibrary }) {
  const router = useRouter();
  const statusLabels = {
    not_started: "Not Started",
    learning: "Learning",
    mastered: "Mastered",
  };
  const statusIcons = {
    mastered: (
      <CircleCheckBig className="text-orange-500 bg-orange-100 p-2 rounded-full w-10 h-10" />
    ),
    learning: (
      <BookOpen className="text-secondary bg-secondary/10 p-2 rounded-full w-10 h-10" />
    ),
    not_started: (
      <CircleDashed className="text-slate-300 bg-slate-50 p-2 rounded-full w-10 h-10" />
    ),
  };
  const handleStatusChange = async (
    newStatus: "not_started" | "learning" | "mastered",
  ) => {
    await updateSkillStatus(skill.id, newStatus);
    router.refresh();
  };
  return (
    <div className="flex justify-between shadow-md rounded-lg p-2 bg-white ">
      <div className="flex items-center gap-2">
        {statusIcons[skill.status]}
        <div className="flex flex-col">
          <h2 className="text-black font-bold">{skill.name}</h2>
          <div className="flex gap-2">
            <span className="text-muted-foreground text-sm">
              {skill.fig_code}
            </span>
            <span className="text-muted-foreground text-sm">
              {skill.difficulty_value} Diff
            </span>
            <span className="text-muted-foreground text-sm">
              {skill.direction === "B" ? "Backwards" : "Forwards"}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <button
          className={`hover:cursor-pointer hover:scale-105 transition-transform text-sm text-white rounded-full px-3 py-1 ${skill.status === "mastered" ? "bg-primary" : skill.status === "learning" ? "bg-secondary" : "bg-muted-foreground"}`}
        >
          {statusLabels[skill.status]}
        </button>
        {skill.date_mastered && (
            <p className="text-xs text-muted-foreground">{new Date(skill.date_mastered).toLocaleDateString()}</p>
            
        )}
      </div>
    </div>
  );
}
